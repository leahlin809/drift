# DECISIONS.md

> 版本：v0.2  
> 状态：已确认产品 / 设计 / 技术决策记录  
> 用途：防止后续开发过程中重复讨论或被 Codex 擅自推翻

---

## 0. 品牌命名

### D-000：正式产品名称

当前正式品牌名称：

- 英文名：**Drift**
- 英文副标题：**Your Own Cultural Atlas**
- 中文名：**所见**
- 中文副标题：**你的私人文化地图**

旧名称 `Wish Map / 心愿地图` 不再作为正式产品名使用。

内部历史文件、旧 commit 或临时目录中可以暂时保留旧名称，但新 UI、README、项目展示、品牌文案和新文档应统一使用 `Drift / 所见`。

---

## 1. 平台策略

### D-001：iPhone-first

V1 的主要产品形态是：

> iPhone App

Web 不作为 V1 必须交付的平台。

未来如果开发 Web，应作为新增客户端，而不是反过来限制当前 iPhone 体验。

---

### D-002：Windows 为主要开发环境

日常开发环境：

> Windows

因此技术路线必须允许：

- Windows 持续开发；
- iPhone 真机验证；
- iOS 构建通过 EAS Cloud Build 或后续临时使用 Mac / Xcode 完成。

不采用“必须长期拥有 Mac 才能开发”的架构前提。

---

## 2. 技术方向

### D-003：React Native + Expo + TypeScript

V1 推荐技术栈：

- React Native
- Expo
- TypeScript

除非出现明确技术阻塞，不主动更换框架。

---

### D-004：Mapbox 负责地图基础能力，不承载业务数据

Mapbox 用于：

- Basemap
- Labels
- Base boundaries
- 地图渲染
- 地图交互基础能力

产品自己的数据层负责：

- Entry
- Location relation
- Tag
- Topic
- Note
- 用户内容

业务数据必须与 Mapbox 解耦。

---

### D-005：当前 Mapbox Style 固定

当前主 Basemap Style：

`mapbox://styles/leahlinmap/cmtelajtw004t01sa2uhw35i8`

Codex 不应擅自修改 Mapbox Studio 的整体视觉设计。

如确实需要修改，应先说明原因和影响。

---

## 3. 产品核心

### D-006：产品核心不是旅行规划，而是私人文化地图

产品核心价值：

> 看见自己如何认识世界。

核心闭环：

> Capture → Spatialize → Rediscover

即：

> 记录 → 空间化 → 再发现

产品不主动扩展成：

- 旅行攻略平台
- 行程规划工具
- 社交网络
- 媒体数据库
- 通用知识管理系统

---

### D-007：Map 是主视图，Library 是辅助视图

一级导航：

```text
Map        Library
```

App 默认进入：

> Map

Library 主要负责：

- 浏览
- 搜索
- 筛选
- 打开 Entry

Map 才是主要产品体验。

---

## 4. Entry

### D-008：Entry 是核心内容对象

Entry 是产品的核心内容单元。

V1 类型：

- book
- movie
- music
- person
- history_event
- place_space
- article_podcast
- other

---

### D-009：Add Entry 必填字段保持极简

必填：

- Title
- Type
- 至少一个 Location

其他字段均为选填。

原则：

> Capture First, Organize Later.

---

### D-010：Note 是唯一自由文本字段

V1 不再设置独立 `Remark`。

所有自由补充内容统一进入：

> Note

Note 可用于：

- 感受
- 联想
- Metadata 补充
- 版本说明
- 临时说明
- 碎碎念

---

### D-011：Source 与 Link 分开

`Source`：

> 来源名称，例如豆瓣、小红书、朋友推荐、课堂、某本书等。

`Link`：

> 外部 URL。

两者不合并。

---

### D-012：Place / Space 不设置固定 subtype

不建立：

- Museum
- Cemetery
- Street
- Building

等固定 Place taxonomy。

这些更细分类统一通过：

> Tags

表达。

---

## 5. Location

### D-013：Location 是层级结构，不是并列枚举

典型层级：

```text
Point
→ City
→ Region
→ Country
```

实际地理结构允许缺层级。

---

### D-014：Location 只向上继承，不向下推断

例如：

```text
Point
→ City
→ Region
→ Country
```

可以向上继承。

但：

```text
Country
↛ Region
↛ City
↛ Point
```

不能反向推断。

---

### D-015：区分 Explicit Location 与 Derived Ancestors

用户真正选择的是：

> Explicit Location

系统自动解析的是：

> Derived Ancestors

两者不能在数据逻辑中完全混为一谈。

---

### D-016：一个 Entry 可以绑定多个 Explicit Location

支持：

- 单 Location
- 多 Location

例如：

```text
Paris
Vienna
```

---

### D-017：Point 可以是任意坐标

Point 不要求对应已有 POI。

用户可以保存：

- 电影取景街角
- 山坡
- 某段街道
- 历史事件发生的大致位置
- 其他自定义空间点

用户默认不需要手动输入经纬度。

---

### D-018：允许 Point + City 等显式重叠绑定

例如：

```text
Point in Paris
+
Paris · City
```

可以同时作为 Explicit Location 保留。

因为它们表达不同粒度的用户意图。

---

### D-019：所有聚合必须按 Entry ID 去重

即使同一 Entry：

- 通过 Point ancestor 命中 Paris；
- 又显式绑定 Paris；

在 Paris 中仍然：

> 只计 1 条 Entry。

该规则适用于：

- Entry Count
- Interest Layer
- Spatial Sheet
- Tag 分布
- Topic 分布
- Library Location Filter

---

### D-020：V1 不做 Polygon

`custom_area / Polygon` 保留在数据模型中。

但 V1 不实现：

- Polygon drawing
- vertex editing
- custom area editor

后续如需要再单独做 Spec。

---

## 6. Map Browse

### D-021：默认显示 Country-level Interest Layer

App 打开 Map 后：

> 默认显示 Interest Layer。

Interest Layer 以 Country 为主要聚合单位。

Point 默认不显示。

---

### D-022：Interest Layer 使用克制的颜色强度表达内容密度

视觉语义：

> Fill intensity = 内容密度

不用夸张红黄绿 Heatmap。

---

### D-023：Selection 使用 Outline，不再改变填充色

因为 Interest Layer 已经使用 Fill 表达密度。

因此：

> Outline = 当前选中空间

避免“内容密度”和“选中状态”使用同一种视觉信号。

---

### D-024：不同空间层级使用不同视觉语言

```text
Country
→ Area Fill

City / Region
→ Dot / Halo

Point
→ Marker
```

Point 默认隐藏，用户主动开启后显示。

---

### D-025：点击空间后进行克制的 Contextual Zoom

点击 Country / Region / City：

- 选中
- Outline / selected state
- 平滑居中
- 适度 zoom-in
- 打开 Bottom Sheet

缩放需要保留必要地理上下文，不做激烈跳转。

---

### D-026：Bottom Sheet 是空间内容主要承载方式

点击 Country / Region / City 后：

> 使用中等高度 Bottom Sheet。

支持：

- 上滑展开
- 下滑收起 / 关闭

Sheet 顶部只保留：

- Location name
- N Entries

不做复杂 Dashboard。

---

## 7. Entry Row

### D-027：Type 在列表中用图标，不直接写文字

Entry Row 中：

> Type 使用单色、线性、小尺寸 Icon。

底层仍保留明确 type enum，用于：

- Search
- Filter
- Accessibility
- Data logic

---

### D-028：Entry Row 固定为紧凑三层

标准结构：

```text
[Type Icon]  Title
             Metadata
             Tags
```

---

### D-029：列表中的文字不自动换行

Title：

- 1 行
- 超长 `…`

Metadata：

- 1 行
- 超长 `…`

Tags：

- 1 行
- 不横向滚动
- 超出显示 `+N`

Note 默认不在列表中显示。

---

### D-030：Tag 使用轻微有色 Chip

Tag：

- 低饱和
- 小型
- 有轻微背景色
- 与正文形成层级
- 不做成高权重按钮

---

## 8. Tag / Topic Filter

### D-031：Tag 与 Topic 都支持地图筛选

筛选后的地图不是额外叠加一套颜色。

而是：

> 对匹配 Entry 重新计算当前 Interest Layer。

---

### D-032：Tag / Topic 支持多选

V1 最多：

> 5 个 Tag / Topic 筛选条件。

可以：

- 多 Tag
- 多 Topic
- Tag + Topic 混合

---

### D-033：支持 Any / All 两种匹配方式

默认：

> Any / 任一匹配

可切换：

> All / 全部匹配

UI 不直接向普通用户显示 AND / OR 技术表达。

---

### D-034：Map Filter 与 Library Filter 独立

两者使用相同数据和相似规则。

但状态不自动同步。

避免用户在 Library 中筛选后，Map 被意外改变。

---

## 9. Library

### D-035：Library 使用紧凑列表，不做封面墙

默认：

> Compact text-first Entry List

复用 Map Bottom Sheet 的 Entry Row。

V1 不做：

- Cover Grid
- Masonry
- 大型媒体卡片

---

### D-036：Library 常驻 Type Filter

Library 顶部保留：

- Search
- Type Filter

Type Filter 常驻且轻量。

高级 Tag / Topic / Location / Sort 放进 Filter Sheet。

---

### D-037：Library 默认按最近更新排序

默认：

```text
updated_at DESC
created_at DESC
```

其他 V1 排序：

- 最近创建
- 标题排序

---

## 10. Entry Detail

### D-038：Entry Detail 是个人笔记页

不做数据库字段表。

视觉上优先：

- Title
- Metadata
- Locations
- Tags / Topics
- Note
- Source / Link

---

### D-039：Location / Tag / Topic 都可以从 Detail 跳回 Map

点击 Location：

> Map spatial selection

点击 Tag：

> 新建对应 Tag Filter

点击 Topic：

> 新建对应 Topic Filter

这是“从内容重新进入地图漫游”的核心路径。

---

### D-040：普通返回恢复上下文

从 Map 进入 Detail 再返回：

- 恢复 viewport
- zoom
- selected location
- Bottom Sheet
- filters
- Point Layer state

从 Library 进入再返回：

- 恢复 Search
- Filters
- Sort
- scroll position

---

## 11. Search

### D-041：Browse / Explore 大于 Search

Map 首页：

> 不放常驻大型 Search Bar。

Search 只作为辅助能力。

Location Picker Search：

> 快速定位地点。

Library Search：

> 搜用户自己的内容。

---

## 12. Appearance / Language

### D-042：默认跟随系统外观

App：

> Follow System Light / Dark

V1 暂不强制提供手动 Appearance override。

---

### D-043：默认跟随系统语言

支持：

- 简体中文
- English

App UI 与 Map labels 尽量使用同一 locale。

---

## 13. 数据保存与同步

### D-044：Local-first

用户点击 Save：

> 先可靠写入本地数据库。

本地保存成功即视为保存成功。

---

### D-045：云同步重要，但账号不是 V1 的核心目的

长期目标：

- 数据不因手机丢失而永久丢失；
- 换机可以恢复；
- 未来可支持多端。

但 V1 第一阶段不需要先实现复杂登录体系。

---

### D-046：SQLite 用于核心本地数据

核心业务数据使用结构化本地数据库。

AsyncStorage 不作为 Entry / Location / Tag / Topic 的核心数据存储。

---

## 14. 开发协作

### D-047：Spec 驱动，小步迭代

开发流程：

```text
Spec
↓
Inspect
↓
Plan
↓
Implement
↓
Verify
↓
Review
```

不一次性生成完整 App。

---

### D-048：重大架构变化必须先确认

Codex 不得自行：

- 更换框架
- 更换 Mapbox
- 更换数据库
- 引入 Web 作为 V1 主端
- 加完整账号系统
- 加社交
- 加 AI 推荐
- 大规模重构

必须先说明：

- 问题
- 方案
- 收益
- 成本
- 风险

再等待确认。

---

## 15. 当前 V1 核心 Specs

当前已确定：

- `SPEC_ADD_ENTRY.md`
- `SPEC_LOCATION_PICKER.md`
- `SPEC_MAP_BROWSE.md`
- `SPEC_LIBRARY.md`
- `SPEC_ENTRY_DETAIL.md`

如果旧代码、旧文档与这些最新明确 Spec 冲突：

> 优先遵循最新 Spec 与本文件中记录的已确认决策。

---

## 16. 当前暂缓能力

明确暂缓：

- Polygon / Custom Area Editor
- Web Client
- 完整账号中心
- 云同步完整实现
- AI Recommendation
- AI Auto Metadata
- Social Features
- Travel Itinerary
- Route Planning
- Gallery / Cover Wall
- Complex Dashboard

这些能力不是“永远不做”，而是：

> 不属于当前 V1 核心闭环。
