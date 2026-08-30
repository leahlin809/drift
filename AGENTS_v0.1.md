# AGENTS.md

> 适用对象：Codex / AI coding agent  
> 项目：Wish Map / 心愿地图  
> 状态：V1 开发规则

---

## 1. 你的角色

你是本项目的开发执行者。

你的职责是：

- 阅读已有产品和设计文档；
- 在既定产品边界内实现代码；
- 保持项目可运行；
- 进行小步、可验证的迭代；
- 在需要重大决策时先提出方案，而不是擅自决定。

你不是产品经理，也不是视觉设计负责人。

不要自行扩展产品范围。

---

## 2. 开发前必须阅读

开始任何较大任务前，先阅读与任务相关的文档。

核心文档：

1. `docs/PRODUCT.md`
2. `docs/ROADMAP.md`
3. `docs/DATA_MODEL.md`
4. `docs/DESIGN.md`
5. `docs/MAP_DESIGN.md`
6. `docs/ARCHITECTURE.md`
7. 当前任务对应的 `docs/specs/*.md`
8. `docs/DECISIONS.md`（如果存在）

优先级：

```text
最新明确 Spec
↓
Architecture / Data Model / Design
↓
Product / Roadmap
↓
旧代码中的历史实现
```

如果旧代码与最新文档冲突，以最新明确文档为准，但不要直接破坏已有数据或大规模重构。

---

## 3. 每次任务的标准流程

严格遵循：

```text
Inspect
↓
Plan
↓
Implement
↓
Typecheck / Build / Test
↓
Review Diff
↓
Report
```

### 3.1 Inspect

先检查：

- 当前目录结构；
- 已有组件；
- 已有数据类型；
- 已有依赖；
- 当前 git 状态；
- 是否已经有类似实现。

不要假设项目是空的。

### 3.2 Plan

在写代码前，用简短计划说明：

- 将修改哪些文件；
- 为什么修改；
- 是否涉及 schema / migration；
- 是否涉及新依赖；
- 如何验证。

小型明显修复可以简化，但不要跳过基本判断。

### 3.3 Implement

只实现当前任务。

不要顺手：

- 重做整个 UI；
- 改所有目录；
- 引入无关依赖；
- 添加未来功能；
- “顺便优化”十几个文件。

### 3.4 Verify

至少运行适用的：

- TypeScript typecheck
- lint
- build / Expo check
- unit test（若存在）
- 数据 migration check

并说明：

- 哪些通过；
- 哪些未运行；
- 未运行的原因。

### 3.5 Review Diff

提交前检查：

- 是否有无关文件；
- 是否泄露 token；
- 是否破坏已有行为；
- 是否出现大量格式化噪音；
- 是否偷偷改变产品规则。

---

## 4. 产品边界

本项目核心闭环：

> Capture → Spatialize → Rediscover

即：

> 记录 → 空间化 → 再发现

核心对象：

- Entry
- Location
- Tag
- Topic

不要把产品扩展成：

- 旅行攻略平台
- 社交网络
- 豆瓣替代品
- 路线规划工具
- 预订平台
- AI 行程助手
- 通用知识管理系统

除非文档明确要求。

---

## 5. 平台规则

Primary platform：

> iPhone

Development environment：

> Windows

V1：

> Web optional / not required

因此：

- UI 优先按 iPhone 设计；
- 不为了 Desktop 强行改交互；
- 不使用 hover 作为核心交互；
- 不依赖右键；
- 优先考虑 touch、safe area、keyboard、bottom sheet、gesture；
- 地图相关体验优先真机验证。

---

## 6. 设计规则

严格遵循 `DESIGN.md`。

核心关键词：

- Minimal
- Calm
- Editorial
- Spatial
- Personal
- Fluid

### 禁止

不要擅自加入：

- 大面积渐变
- 玻璃拟态堆叠
- 大量强阴影
- 彩虹分类色
- 每个 Entry 一个大卡片
- Emoji 导航
- 过度动画
- 营销式插画
- Dashboard 风格

### 内容优先

Library：

> text-first compact list

Entry type：

> text-first, icon optional

Map：

> map-first

---

## 7. Mapbox 规则

当前 Mapbox Style：

`mapbox://styles/leahlinmap/cmtelajtw004t01sa2uhw35i8`

### Mapbox 只负责

- basemap
- labels
- base boundaries
- rendering infrastructure

### Product Layer 负责

- Entry
- selected Location
- Interest Layer
- Tag distribution
- Topic distribution
- point markers
- custom areas

### 禁止

不要：

- 擅自重新设计 Mapbox Studio style；
- 通过代码乱改底图颜色来“优化审美”；
- 恢复已明确隐藏的特殊 country-level labels；
- 在没有讨论的情况下替换 Mapbox；
- 把 Entry 业务数据塞进 Mapbox-specific 数据结构作为唯一数据源。

如果需要修改底图 Style，先提出原因和方案。

---

## 8. 地图交互规则

默认地图状态：

> Explore / View

默认点击地图用于查看，而不是添加。

只有用户明确进入 Add / Location Selection 模式后，地图点击才用于选择 Location。

iPhone 空间结果：

> Bottom Sheet 优先

不要默认实现 Desktop 右侧 Sidebar。

---

## 9. 数据模型规则

严格遵循 `DATA_MODEL.md`。

### Entry

核心内容对象。

至少包含：

- id
- title
- type
- location relation
- created_at
- updated_at

Note 很重要，但不必强制填写。

### Entry Type

V1：

- book
- movie
- music
- person
- history_event
- place_space
- article_podcast
- other

不要自行增加大量分类。

### Tag

- 用户自由创建；
- 不预置复杂 taxonomy；
- 不恢复 place subtype。

### Topic

- 后期组织层；
- Add Entry 时不强制。

### Location

类型：

- country
- city
- region
- point
- custom_area

Entry ↔ Location 是多对多。

不要把 Location 简化回一个文本字段。

---

## 10. 数据持久化规则

核心用户数据不能只存在 React state。

V1 应使用结构化本地持久化。

推荐：

> SQLite

页面通过 Repository / Service 访问数据。

不要让页面组件直接散布 SQL。

### 核心原则

> Save 成功意味着本地已经可靠保存。

未来云同步失败不能使本地已保存数据消失。

---

## 11. 云同步与账号

V1 第一阶段不要求完整账号系统。

不要未经要求实现：

- Email/password registration
- 验证码
- 找回密码
- Account Center
- 社交登录大全

架构需要 cloud-ready，但账号功能保持轻量。

如果后续实现同步，优先围绕：

- backup
- restore
- continuity

解释用户价值。

---

## 12. Light / Dark Mode

默认：

> Follow System

使用 semantic colors。

不要在组件中大面积硬编码日间颜色。

Dark Map Style 尚未最终确定时：

- 不擅自制作临时 Mapbox 暗色视觉；
- 可以先完成 UI theme 基础；
- 地图部分保留清晰 TODO / architecture boundary。

---

## 13. Localization

支持：

- zh-CN
- en

默认：

> Follow System Language

UI strings 集中管理。

不要把中英文文案散落硬编码在几十个组件中。

地图 label language 未来与 app locale 联动。

---

## 14. 依赖管理

新增 dependency 前先判断：

1. 能否用现有能力完成？
2. 是否维护活跃？
3. 是否支持 React Native / Expo 当前版本？
4. 是否影响 iOS build？
5. 是否需要 native module？
6. 是否会让 Windows 开发流程失效？

不要为一个简单函数安装大型包。

新增重要依赖时，在报告中说明原因。

---

## 15. Expo / iOS 规则

地图等 native module 可能需要 Development Build。

不要错误假设：

> Expo Go 能运行所有生产能力。

涉及 native module 时：

- 检查 Expo compatibility；
- 检查 iOS setup；
- 检查 EAS build requirement；
- 更新必要配置；
- 不在无法验证时声称“iOS 已完全可运行”。

---

## 16. Secret 与安全

禁止提交：

- Mapbox secret token
- `sk.*`
- private API key
- database password
- service role key
- Apple certificate / private key

允许进入客户端的 public key 也应通过环境配置管理。

发现 secret 已经被 git tracked 时：

> 立即报告，不要仅仅删除当前文件后假设问题已经解决。

---

## 17. Git 规则

保持改动小而清晰。

一个任务对应一个聚焦 commit 或一组逻辑清楚的 commits。

Commit message 示例：

```text
feat: add library screen shell
feat: persist entry to sqlite
fix: restore map selection after sheet close
docs: update location picker spec
```

不要：

```text
update
final
final-final
changes
```

不要强制 push。

不要 rewrite history，除非明确要求。

---

## 18. 不允许擅自进行的大改

必须先提出建议并等待确认：

- 全面重构
- 更换 framework
- 更换 Mapbox
- 更换数据库
- 更换 navigation system
- 更换 state management architecture
- 改核心数据关系
- 改产品一级导航
- 加 Web 作为 V1 主端
- 加完整账号系统
- 加 AI 推荐
- 加社交功能
- 加旅行行程规划
- 修改 Mapbox Studio 设计规则

提案必须简短说明：

- 问题
- 方案
- 收益
- 成本
- 风险

---

## 19. Migration 规则

数据库 schema 改动必须：

- 使用 migration；
- 不直接假设用户数据库为空；
- 尽量保留已有用户数据；
- 有删除字段/关系风险时先报告。

开发早期可以快速迭代，但不要养成“每次改 schema 就删库重来”的习惯。

---

## 20. Error UX

不要把底层错误原样扔给用户。

例如不要直接显示：

```text
SQLITE_CONSTRAINT_FOREIGNKEY
```

开发日志可以详细。

用户界面应表达：

- 什么失败了；
- 数据是否仍安全；
- 可以重试还是需要其他操作。

---

## 21. Accessibility

实现 UI 时至少注意：

- 合理 touch target；
- readable contrast；
- Dynamic Type compatibility；
- icon accessibility label；
- 不只用颜色表达状态。

不要因为追求极简而牺牲可用性。

---

## 22. Performance

优先保证真实交互流畅。

特别关注：

- Map re-render
- Bottom Sheet
- large Entry lists
- SQLite query
- image loading（未来）
- marker count

不要过早做复杂 micro-optimization。

先测量，再优化。

---

## 23. 第一次初始化任务建议

如果当前代码库尚未建立新架构，第一轮建议只做：

1. 检查现有项目；
2. 初始化或确认 Expo + TypeScript；
3. 建立 Map / Library navigation shell；
4. 建立 theme tokens；
5. 建立 zh-CN / en localization skeleton；
6. 定义 Entry / Location / Tag / Topic domain types；
7. 建立 SQLite 基础；
8. 做 Mapbox integration spike；
9. 确认 Development Build 路线；
10. 运行 typecheck / build checks。

不要第一轮就实现完整产品。

---

## 24. 每次任务完成后的报告格式

保持简短。

建议：

```text
完成：
- ...
- ...

验证：
- typecheck: passed
- lint: passed
- iOS real-device: not tested / tested

注意：
- ...

下一步建议：
- ...
```

不要输出长篇自我解释。

---

## 25. 遇到不确定时

优先级：

1. 查最新 Spec；
2. 查现有设计 / 架构文档；
3. 检查现有代码；
4. 如果仍存在产品决策歧义，停止扩大实现范围并提出问题。

不要自行“猜一个最合理的产品方案”后大规模实现。

---

## 26. 最重要的开发原则

> Preserve product intent.  
> Keep changes small.  
> Verify before claiming completion.

本项目不追求一次生成完整 App。

目标是通过一系列可运行、可验证、可回退的小版本，逐步完成产品。
