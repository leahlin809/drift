# ARCHITECTURE.md

> 产品：**Drift / 所见**  
> Tagline：**Your Own Cultural Atlas / 你的私人文化地图**

> 版本：v0.2  
> 平台：iPhone-first  
> 开发环境：Windows  
> 状态：V1 技术架构基线

---

## 1. 文档目的

本文档定义 V1 的技术架构边界、技术栈、目录组织、数据流与实现原则。

目标不是一次性设计一个复杂系统，而是保证：

- 可以在 Windows 上持续开发；
- 可以在 iPhone 真机上测试；
- 最终可以构建并发布 iOS App；
- 业务数据不依赖 Mapbox；
- 数据结构未来可以支持备份、恢复与多端同步；
- Codex 可以在明确边界内持续迭代，而不是每次重新选择技术方案。

---

## 2. 核心架构原则

### 2.1 iPhone-first

V1 的主要客户端是 iPhone。

Web 不作为 V1 必须交付的客户端，不为了未来 Web 提前牺牲移动端体验。

### 2.2 Windows-first development

日常开发环境为 Windows。

因此技术方案必须满足：

- Windows 可以编辑、运行开发服务和管理代码；
- iOS 原生编译可以交由 EAS Cloud Build 或后续临时使用 Mac 完成；
- 不依赖“开发者日常必须拥有 Mac”这一前提。

### 2.3 Local-first, cloud-ready

V1 优先保证：

> 数据先可靠保存，再考虑复杂账号体系。

核心用户数据首先需要在本机稳定持久化，同时数据模型必须为未来云备份、恢复和同步保留清晰接口。

不要在 V1 第一阶段强制实现完整账号系统。

### 2.4 业务数据与地图服务解耦

Mapbox 只负责：

- 底图；
- 地图渲染；
- 地图交互能力；
- 必要的地图基础服务。

以下内容属于产品自己的数据层：

- Entry
- Location relation
- Tag
- Topic
- Note
- 用户数据
- 内容组织关系

业务数据不能以“只能被 Mapbox 理解”的结构存储。

### 2.5 Vertical Slice First

优先完成完整的小闭环：

> 添加 Entry → 绑定 Location → 保存 → 地图中重新发现 → 查看 Detail

不要同时把所有页面都做 30%。

---

## 3. 推荐技术栈

### 3.1 App Framework

推荐：

- React Native
- Expo

原因：

- Windows 开发友好；
- iPhone-first；
- 后续可以通过 EAS Build 构建 iOS；
- 适合当前个人项目规模；
- 可以保留未来 Android / Web 扩展可能，但不要求 V1 实现。

### 3.2 Language

- TypeScript

要求：

- 开启严格类型检查；
- 核心业务对象必须定义明确类型；
- 避免大面积使用 `any`。

### 3.3 Navigation

推荐使用 Expo Router 或等价的 React Navigation 方案。

V1 导航至少包含：

- Map
- Library
- Add Entry
- Entry Detail
- Location Picker
- Settings（最小化）

如果项目初始化时已经选择其中一种方案，不要在没有明确收益的情况下切换导航框架。

### 3.4 Map

底图视觉规则由 `MAP_DESIGN.md` 定义。

当前 Mapbox Style：

`mapbox://styles/leahlinmap/cmtelajtw004t01sa2uhw35i8`

React Native 侧优先采用支持 Mapbox Maps SDK 的成熟集成方案。

推荐实施方向：

- `@rnmapbox/maps`
- Expo Development Build / EAS Build

重要：

> Mapbox 原生能力不应假设可以完整运行在 Expo Go 中。

因此地图相关功能进入真实开发后，应尽早使用 Development Build 真机测试。

### 3.5 State Management

V1 优先保持简单。

建议分为：

- Screen / component local state：React state
- 跨页面轻量 UI state：小型 store
- 持久化业务数据：Repository / Data layer

如果需要全局 store，优先使用轻量方案，例如 Zustand。

不要为了“架构完整”提前引入 Redux 等较重方案，除非真实复杂度要求。

### 3.6 Local Persistence

V1 核心数据应使用结构化本地数据库，而不是散落在 AsyncStorage 中。

推荐：

- SQLite（通过 Expo 支持的 SQLite 方案）

适合存储：

- Entry
- Location
- Tag
- Topic
- join relations
- sync metadata

AsyncStorage 仅用于轻量偏好，例如：

- onboarding 是否看过
- 非关键 UI preference
- 临时本地设置

### 3.7 Cloud Backup / Sync

V1 架构需要预留，但不要求第一阶段完成。

建议未来在以下方向中选择：

- Supabase / PostgreSQL
- 其他可靠云数据库
- Apple 生态同步方案

当前代码应通过 Repository / Service 边界隔离具体实现。

例如：

```text
UI
↓
EntryService / Repository
↓
Local Database
↓
Future Sync Layer
↓
Cloud
```

页面组件不应直接调用某个云数据库 SDK。

---

## 4. 数据架构

核心数据模型以 `DATA_MODEL.md` 为准。

主要实体：

- Entry
- Location
- Tag
- Topic

主要关系：

```text
Entry ↔ Location
Entry ↔ Tag
Entry ↔ Topic
Topic ↔ Location
```

均按多对多关系处理。

### 4.1 ID

所有核心对象使用稳定、全局唯一 ID。

推荐 UUID。

不要使用数组索引或 UI 顺序作为数据 ID。

### 4.2 时间字段

核心对象至少保留：

- created_at
- updated_at

为未来同步预留时，可增加：

- deleted_at
- sync_status
- version

但不要在 V1 第一阶段过度实现同步协议。

### 4.3 用户所有权

即使 V1 暂时只有单用户，也应避免让数据库结构天然无法支持用户所有权。

未来可加入：

- owner_id / user_id

但在正式确定账号方案前，不需要强迫所有本地数据依赖登录状态。

---

## 5. Location 架构

Location 是独立空间锚点，不只是 Entry 的字符串字段。

类型：

- country
- city
- region
- point
- custom_area

### 5.1 Point

内部保存：

- latitude
- longitude

用户不需要手动输入坐标。

### 5.2 Country / City / Region

可以保存稳定地理标识和展示名称。

不要仅依赖当前语言下的 `name` 字符串作为唯一识别依据。

### 5.3 Custom Area

后续使用 Polygon / MultiPolygon。

V1 可以暂缓完整编辑能力。

---

## 6. 地图与产品数据层

### Basemap Layer

负责：

- land
- water
- boundaries
- labels
- roads
- base visual hierarchy

主要由 Mapbox Studio Style 控制。

### Product Layer

负责：

- selected location
- point markers
- Entry spatial data
- Interest Layer
- Tag distribution
- Topic distribution
- custom area
- user-generated geometry

Codex 不应通过修改底图 Style 来解决产品数据展示问题。

---

## 7. Light / Dark Mode

App UI 默认跟随系统。

架构上通过 semantic theme tokens 控制界面颜色。

不要在各组件中大量硬编码：

```text
#FFFFFF
#000000
```

地图：

- 当前已有 Light Style；
- Dark Style 尚未正式确定；
- 在 Dark Style 完成前，不擅自重做 Mapbox Studio 视觉。

未来应建立：

```text
system appearance
↓
app theme
↓
map style selection
```

切换 Mapbox style 后，运行时 Product Layers 需要重新挂载。

---

## 8. Localization

V1：

- 简体中文
- English

默认跟随系统语言。

字符串不得散落硬编码在大量组件中。

推荐集中管理：

```text
/locales
  zh-CN
  en
```

地图标签语言也应尽量与 App locale 一致。

---

## 9. 推荐项目结构

可以根据 Expo Router 实际初始化结构微调，但职责保持清晰。

```text
drift/
├─ app/
│  ├─ (tabs)/
│  │  ├─ map.tsx
│  │  └─ library.tsx
│  ├─ entry/
│  │  └─ [id].tsx
│  ├─ add-entry.tsx
│  ├─ location-picker.tsx
│  └─ settings.tsx
│
├─ src/
│  ├─ components/
│  │  ├─ entry/
│  │  ├─ map/
│  │  ├─ forms/
│  │  └─ common/
│  │
│  ├─ domain/
│  │  ├─ entry.ts
│  │  ├─ location.ts
│  │  ├─ tag.ts
│  │  └─ topic.ts
│  │
│  ├─ data/
│  │  ├─ repositories/
│  │  ├─ database/
│  │  └─ migrations/
│  │
│  ├─ services/
│  │  ├─ map/
│  │  ├─ location/
│  │  └─ sync/
│  │
│  ├─ stores/
│  ├─ hooks/
│  ├─ theme/
│  ├─ locales/
│  └─ utils/
│
├─ docs/
│  ├─ PRODUCT.md
│  ├─ ROADMAP.md
│  ├─ DATA_MODEL.md
│  ├─ DESIGN.md
│  ├─ MAP_DESIGN.md
│  ├─ ARCHITECTURE.md
│  ├─ DECISIONS.md
│  └─ specs/
│
├─ references/
├─ AGENTS.md
├─ app.json
├─ package.json
├─ tsconfig.json
└─ README.md
```

不要为了匹配这份示例目录而进行无意义的大规模搬迁。

---

## 10. Repository Pattern

页面不应该直接负责数据库细节。

例如：

```text
Map Screen
↓
EntryRepository
↓
SQLite
```

未来加入云同步后：

```text
Map Screen
↓
EntryRepository
↓
Local SQLite
   ↕
Sync Service
   ↕
Cloud
```

这样未来更换云服务时，不需要重写所有页面。

---

## 11. 保存策略

用户按下 Save 后：

1. 先验证核心字段；
2. 本地事务保存；
3. UI 立即反馈成功；
4. 未来存在云同步时，在后台进入同步队列。

核心原则：

> 网络失败不能阻止用户正常记录本地 Entry。

未来同步失败应显示“尚未同步”，而不是表现为“保存失败”，前提是本地保存已经成功。

---

## 12. Search

V1 搜索先保持本地和轻量。

优先范围：

- Entry title
- creator
- note
- tags
- location display name

不要在 V1 第一阶段引入复杂搜索引擎。

当数据量和需求证明必要时再升级。

---

## 13. Interest Layer

Interest Layer 属于后续能力。

V1 不需要复杂空间算法。

初期可使用简单聚合思路：

```text
Entry
↓
Location
↓
按空间单元统计数量
↓
normalize
↓
映射到低饱和视觉强度
```

原则：

- 不使用夸张红黄绿热力图；
- 算法输出和视觉渲染分离；
- 后续可以替换算法而不改变 Entry 数据结构。

---

## 14. Environment Variables

所有密钥和环境配置统一管理。

例如：

- Mapbox public token
- future backend URL
- future public client key

不得提交：

- secret token
- service role key
- private certificate
- password

`.env*` 应根据实际情况加入 `.gitignore`。

GitHub 可以保留：

```text
.env.example
```

但只能包含变量名和示例占位符。

---

## 15. Mapbox Token

客户端只使用允许公开分发的 public token。

要求：

- 不在文档中保存 secret token；
- 不把 `sk.` token 放入客户端；
- public token 尽可能配置允许的限制；
- Mapbox Style URL 可以进入项目配置。

---

## 16. Error Handling

至少区分：

- 用户输入错误
- 本地数据库错误
- 地图加载错误
- 网络错误
- 云同步错误
- 权限错误

UI 不应直接展示底层 SDK exception。

用户需要看到：

- 发生什么；
- 数据是否安全；
- 能做什么。

开发环境可以记录详细错误日志。

---

## 17. Logging

V1 只保留必要开发日志。

禁止：

- 打印 secret；
- 打印完整身份 token；
- 无限制打印用户私人 Note 内容。

生产版本应减少 debug log。

---

## 18. Testing Strategy

第一阶段最低要求：

### Type / Static

- TypeScript typecheck
- lint（若项目已配置）

### Functional

重点人工测试核心闭环：

```text
Add Entry
→ choose Location
→ Save
→ reopen app
→ data still exists
→ Map / Library can rediscover
→ Detail opens
```

### iPhone Real Device

地图、键盘、Safe Area、Bottom Sheet、Dark Mode、定位等功能应尽量真机验证。

不能只依赖 Web preview。

---

## 19. Build Strategy

### 日常开发

```text
Windows
↓
VS Code / Codex
↓
Expo Development Environment
↓
iPhone real device
```

### iOS Native Build

```text
Windows
↓
EAS Build
↓
Cloud macOS build
↓
Development / Preview / Production build
```

### 发布阶段

可以：

- 使用 EAS Build / Submit；
- 或在关键阶段使用 Mac + Xcode。

GitHub 是跨设备代码中枢。

---

## 20. Git Strategy

每个明确功能独立提交。

建议：

```text
feat: add entry form shell
fix: restore selected location state
docs: update map interaction spec
refactor: extract entry repository
```

避免：

```text
update
changes
final
final2
```

不要在一个 commit 中混入大量无关改动。

---

## 21. V1 当前不做

除非 Roadmap / Spec 后续明确升级，不主动加入：

- Web client
- Android-specific optimization
- social features
- followers
- comments
- travel booking
- itinerary generation
- AI recommendation system
- complex account center
- real-time collaboration
- heavy analytics infrastructure
- large-scale search backend
- custom map engine

---

## 22. 架构变更规则

以下属于重大架构变化，Codex 不应自行决定：

- 更换 React Native / Expo
- 更换 Mapbox
- 更换数据库类型
- 从 local-first 改为 cloud-only
- 引入新的大型状态管理框架
- 引入完整后端框架
- 改变核心数据关系
- 更换导航体系
- 大规模重构目录
- 修改 Mapbox Studio 底图设计原则

需要先说明：

1. 当前问题；
2. 为什么现有方案不足；
3. 新方案收益；
4. 迁移成本；
5. 风险。

经确认后再实施。

---

## 23. 当前第一轮开发目标

第一轮只建立可运行的 App Foundation：

- React Native + Expo + TypeScript
- iPhone-first navigation
- Map / Library 基础页面
- Add Entry 页面骨架
- Light / Dark theme foundation
- 中文 / English localization foundation
- 核心 Domain Types
- SQLite database foundation
- Mapbox integration spike
- iPhone Development Build 可运行

第一轮不要求：

- 完整云同步
- 完整账号
- Interest Layer
- Topic 高级能力
- Polygon 编辑
- Web

完成 Foundation 后，再根据 `docs/specs/` 逐功能进入真实实现。
