# DESIGN.md

> 版本：v0.3  
> 平台：iPhone-first  
> 状态：V1 设计基线

---

## 1. 文档目的

本文档用于定义产品在地图底图之外的整体视觉语言与交互原则。

它主要回答：

- 这个 App 整体应该呈现什么样的气质？
- 信息层级如何组织？
- iPhone 上的主要交互方式是什么？
- 日间 / 夜间模式如何适配？
- 中文 / English 如何跟随系统变化？
- Map、Library、Add Entry、Entry Detail 等界面如何保持一致？

地图本身的视觉与地图层级规则继续以 `MAP_DESIGN.md` 为准。

---

## 2. 品牌身份

产品名称：

- 英文名：**Drift**
- 英文副标题：**Your Own Cultural Atlas**
- 中文名：**所见**
- 中文副标题：**你的私人文化地图**

品牌名称强调的是漫游、积累与个人文化世界的形成，而不是旅行打卡或心愿清单。

在 App 内部，品牌呈现应保持克制，不反复展示完整副标题；副标题主要用于启动页、项目展示、App Store 素材或品牌说明。

---

## 3. 整体设计定位

产品应该呈现为一个**安静、私人、具有编辑感的文化地图工具**。

它不应该像：

- 旅行攻略 App
- 社交媒体 Feed
- 媒体数据库
- 后台管理系统
- 功能堆叠型效率工具

核心设计关键词：

- Minimal：简洁
- Calm：安静
- Editorial：具有编辑感
- Spatial：空间感
- Personal：私人化
- Fluid：流畅

界面应该服务于内容和地图，而不是与内容争夺注意力。

### 2.1 核心原则

> 简洁并不意味着删掉有用的信息，而是尽量减少没有必要的界面噪音。

设计上优先考虑：

- 清晰层级，而不是装饰
- 文字可读性，而不是大量图标
- 系统原生交互，而不是为了独特而独特
- 留白，而不是密集框架
- 渐进展示，而不是一次展示全部信息
- 情境化操作，而不是永久显示所有按钮

---

## 4. 平台策略

### 3.1 主要平台

V1 主要面向：

- iPhone
- 触控操作
- 移动场景
- 短时间快速记录
- 旅行或移动中查看地图

Web 不作为 V1 的核心设计目标。

未来如果增加 iPad 或 Web 客户端，可以复用相同的产品逻辑，但当前不应为了兼容桌面端而牺牲 iPhone 的体验。

### 3.2 iOS 原生交互优先

在合适的情况下，优先采用用户已经熟悉的 iOS 交互方式：

- Navigation Stack
- Bottom Sheet
- Search
- Context Menu
- Swipe
- Safe Area
- 系统键盘
- Dynamic Type
- Haptic Feedback
- 系统外观
- 系统语言

产品应该有自己的视觉气质，但不需要故意违背 iOS 用户的使用习惯。

---

## 5. 视觉参考

参考产品只学习其中适合本产品的部分，不整体照搬。

### Apple Maps / Apple 原生 App

主要参考：

- 地图作为视觉主体
- Bottom Sheet 的交互方式
- 系统级动效
- 克制的界面元素
- 日间 / 夜间模式适配
- Safe Area 处理

### Felt

主要参考：

- 地图保持主舞台
- 地图工具轻量化
- 避免大量永久性 UI 覆盖地图

### Things 3

主要参考：

- 安静的列表层级
- 文字优先的信息组织
- 大量内容下依然保持清爽
- 良好的留白与节奏

### Linear

主要参考：

- 精确
- 克制
- 紧凑但不混乱
- 状态变化清晰

整体目标不是复制某个产品，而是：

> **Apple 式原生交互 + 编辑感内容呈现 + 安静的地图界面**

---

## 6. 外观模式

### 5.1 跟随系统

默认：

> Follow System

App 自动跟随 iOS 当前的 Light / Dark Mode。

V1 暂时不必额外提供手动切换外观模式，除非后续真实使用中发现有明显需求。

### 5.2 Semantic Color

界面颜色应尽量按照“作用”定义，而不是写死具体颜色值。

例如：

- Background
- Secondary Background
- Primary Text
- Secondary Text
- Separator
- Accent
- Selected
- Disabled
- Overlay

同一语义颜色在日间和夜间模式下可以使用不同实际色值。

### 5.3 色彩策略

整体色彩保持克制。

建议：

- 中性背景
- 根据系统外观自动切换的文字颜色
- 一个低饱和主强调色
- 轻微分隔线
- 极少量状态色

避免：

- 每一种 Entry 类型使用一种强烈颜色
- 彩虹式分类系统
- 大面积渐变
- 过度彩色卡片
- 强阴影

V1 不需要给 Book / Movie / Music / Person 等分别建立强烈视觉色彩身份。

---

## 7. 夜间模式

Dark Mode 应作为完整设计状态，而不是简单“把颜色反转”。

需要保证：

- 文字对比度足够
- 分隔线依然克制
- Sheet 和背景层级清晰
- Overlay 不显得厚重
- 地图依然是视觉背景
- Entry 内容夜间阅读舒适

UI 自动跟随系统。

地图也应尽量跟随系统外观。

当对应的 Mapbox Dark Style 完成后：

```text
iOS Light
→ Light UI
→ Light Map Style

iOS Dark
→ Dark UI
→ Dark Map Style
```

在 Dark Map Style 尚未正式设计完成之前，不应在代码中随意制造与底图风格不一致的“临时暗色地图”。

---

## 8. 语言与本地化

V1 支持：

- 简体中文
- English

默认：

> Follow System Language

### 7.1 App 界面语言

如果系统主要语言为中文：

- App UI 使用中文

如果系统主要语言为 English：

- App UI 使用 English

### 7.2 地图语言

在技术允许的情况下，地图 Label 应与当前 App Locale 保持一致。

理想逻辑：

```text
System / App Locale
        ↓
App UI Language
        ↓
Map Label Language
```

尽量避免：

- App 全中文，但地图长期全英文
- App 全英文，但地图长期全中文

### 7.3 本地化设计原则

布局不能依赖固定文字宽度。

中文和英文都需要自然适配。

避免：

- 太长的按钮文本
- 依赖英文大写来制造全部视觉层级
- 固定宽度标签造成英文溢出

---

## 9. 字体

优先使用 iOS 系统字体。

原因：

- 中文 / 英文适配自然
- 原生渲染
- Dynamic Type 支持更好
- 与系统控件保持协调

文字层级主要通过：

- 字号
- 字重
- 间距
- 位置

来建立，而不是大量使用不同颜色或装饰字体。

建议文字层级：

- Screen Title
- Section Title
- Entry Title
- Body
- Metadata
- Caption
- Type Label

其中：

> Entry Title 应明显高于 Metadata。

Metadata 应保持安静、次要。

---

## 10. 间距与布局

界面应该有足够留白，但不能显得空洞。

统一使用一套间距体系，而不是每个页面任意决定。

概念上可以采用：

- XS：非常紧密的内部间距
- S：图标 / Metadata 之间
- M：普通组件 Padding
- L：内容组之间
- XL：主要 Section 之间

### 布局原则

- 尊重 iPhone Safe Area
- 正文不要紧贴屏幕边缘
- 地图可以 Edge-to-Edge
- 地图浮动控件要留出舒适点击空间
- 避免不必要的 Card 套 Card
- 不需要给每一组内容都加边框

留白本身就是信息层级的一部分。

---

## 11. 圆角、边框与阴影

### 圆角

适度使用。

建议：

- Bottom Sheet：接近系统风格
- 浮动控件：中等圆角
- Chip：Pill 或小圆角矩形
- Library Row：通常无需卡片圆角

避免所有 Entry 都做成大面积悬浮卡片。

### 边框

需要结构时使用轻微 Separator。

### 阴影

仅用于表达层级，例如：

- 地图浮动控件
- Bottom Sheet

不把阴影作为装饰。

---

## 12. 图标

只有在图标比文字更快、更清楚时才使用。

优先：

- SF Symbols
- 或与系统图标风格兼容的简单图标

避免：

- Emoji 作为主要界面图标
- 普通操作使用插画
- 多套不同风格 Icon
- 用户看不懂含义的抽象图标

### 11.1 图标与文字原则

导航、高频操作可以使用熟悉的图标。

内容分类保持：

> **文字优先，小图标辅助。**

例如：

```text
BOOK
小王子
圣埃克苏佩里 · 法国
```

或者：

```text
▣  小王子
   书籍 · 圣埃克苏佩里 · 法国
```

不要让用户必须依靠某个图标才能知道 Entry 是书籍还是电影。

---

## 13. 一级导航

V1 保持非常简单。

主要产品入口：

1. Map
2. Library

全局操作：

3. Add Entry

不要为以下内容分别建立一级导航：

- Books
- Movies
- Music
- People
- Topics
- Tags
- Places

这些应该是内容分类、过滤条件或组织方式，而不是独立产品模块。

### 12.1 推荐结构

V1 可以采用：

```text
Map        Library
```

的底部 Tab。

Add Entry 作为全局动作存在，但不需要成为第三个“内容页面”。

Add 的最终位置可以在实际实现中进一步验证。

---

## 14. Map 首页

地图是产品最重要的主界面。

视觉优先级：

```text
Map
↓
当前空间上下文
↓
用户内容
↓
地图控件
```

地图控件不能抢过地图本身。

长期存在的控件应尽量限制在真正必要的范围，例如：

- Search
- Current Location
- Add
- 可选的地图模式入口

具体地图视觉与交互继续遵循 `MAP_DESIGN.md`。

---

## 15. Spatial Sheet

在 iPhone 上，空间查询结果优先使用：

> **Bottom Sheet**

例如：

```text
点击 France
↓
France 被选中
↓
Bottom Sheet 出现
↓
Peek
↓
半屏
↓
必要时展开
```

地图应尽量保持可见。

Spatial Sheet 可以展示：

- Location 名称
- Entry 数量
- Entry 类型概况
- 相关 Entry
- 相关 Tags
- 后续可加入 Topics

### Sheet 交互

应支持：

- 拖动
- 收起
- 展开
- 下滑关闭
- 自然速度与惯性
- 保持地图上下文
- 正确处理 Safe Area 与键盘

未来如果开发 iPad / Web，相同概念可以转化为 Side Panel。

---

## 16. Add Entry

添加 Entry 是核心动作。

设计目标：

> **Capture First, Organize Later.**

整个流程应该轻量，不要像填写数据库后台。

### 15.1 核心字段优先级

推荐顺序：

1. Title
2. Type
3. Location
4. Note
5. Tags
6. Optional Metadata

只把必要信息立即展示。

次要 Metadata 可以渐进展开。

### 15.2 Entry Type

Entry Type 要容易扫视。

使用：

- 文字
- 可选的小型 Symbol

避免使用大型、彩色、九宫格式分类 Icon。

### 15.3 Location 选择

V1 保留两种方式：

- Search
- Select on Map

已经选择的 Location 使用 Chip 或紧凑 Row 显示。

例如：

```text
Paris ×    Vienna ×    + Add
```

---

## 17. Library

Library 是 Map 的“内容视角”。

主要作用：

- 查看所有 Entries
- Search
- Filter
- 回看 Note
- Edit / Delete
- 后续通过 Tag / Topic 组织

### 16.1 默认布局

V1 采用：

> **Compact Text-first List**

例如：

```text
小王子
书籍 · 圣埃克苏佩里
法国
#文学  #想象力

────────────────────

蒙帕纳斯公墓
地点 / 空间
巴黎
#墓地
```

优先级：

1. Entry Title
2. Type / Creator / Location
3. Tags
4. 必要时显示 Note Preview

### 16.2 图片与封面

图片属于辅助内容。

V1 不围绕大尺寸封面设计 Library。

未来如果发现视觉浏览价值较高，可以增加：

> List / Gallery

但 V1 默认仍然是文字优先。

### 16.3 类型呈现

优先：

- 小型文字 Label
- 必要时搭配轻量 Symbol

避免：

- 大 Icon
- 每种类型一种强烈颜色
- 到处都是 Badge

---

## 18. Entry Detail

Entry Detail 应该更像：

> 打开一条自己的文化笔记

而不是数据库记录页。

推荐层级：

```text
Type
Title
Creator / Year
Locations
Tags

Note

Source / Link
Other Metadata
```

其中 Note 是重要的个人内容，应拥有舒适的阅读空间。

Edit 应容易找到，但不需要长期成为页面最大视觉元素。

---

## 19. Search

Search 保持轻量，并尽量遵循 iOS 用户熟悉的搜索方式。

未来搜索范围可以逐步包括：

- Entry Title
- Creator
- Note
- Tag
- Location
- Topic

V1 不需要高级筛选 Dashboard。

---

## 20. Tags 与 Topics

### Tags

Tag 使用轻量文字 Chip。

不应比 Entry Title 更突出。

### Topics

Topic 是比 Tag 更丰富的组织对象。

未来可以展示：

- Title
- Description
- Entry Count
- Spatial Distribution

Topic 不是添加 Entry 时的必填项。

界面不应该逼迫用户一开始就为每个 Entry 创建 Topic。

---

## 21. 按钮与操作

### Primary Action

每个上下文尽量只有一个最明显的主要动作。

例如：

- Save
- Add
- Done

### Secondary Action

次要动作优先放在：

- Text Button
- Toolbar
- Context Menu
- Swipe Action

避免一排多个同等视觉权重的按钮。

### Destructive Action

删除需要明确区分。

涉及重要数据损失时应使用适当确认。

---

## 22. 动效

动效应该：

- 流畅
- 短
- 有目的

适合使用在：

- Bottom Sheet 出现
- Sheet 展开
- Location Selection
- Mode 切换
- Entry 保存
- 页面导航
- Map 状态变化

避免：

- 装饰性 Bounce
- 很长的 Transition
- 动态渐变
- 为了“高级感”而延迟用户操作

核心原则：

> 动效应该帮助用户理解一个元素从哪里来、到哪里去。

---

## 23. Haptic Feedback

可以在重要动作中使用轻微触觉反馈，例如：

- Entry 保存成功
- 选择 Location
- 进入地图 Location Selection 模式
- 删除确认
- Bottom Sheet 吸附到主要位置

不要每次点击都震动。

---

## 24. 键盘与输入

由于 Entry Capture 包含文字输入，键盘体验非常重要。

要求：

- 输入框不能被键盘遮住
- Save / Done 应保持容易触达
- 键盘能够自然关闭
- 长 Note 编辑舒适
- 切换到地图 Location Selection 时，不应让键盘继续干扰操作

---

## 25. Accessibility

V1 不需要一次完成所有 Accessibility 功能，但设计不能阻碍未来支持。

要求：

- 尽量支持 Dynamic Type
- 不只依靠颜色表达含义
- 点击区域足够大
- 对比度可读
- Icon 具备 Accessibility Label
- 关键地图操作尽量存在非地图替代路径
- 中文 / English 在系统字号下保持可读

---

## 26. Empty State

空状态保持克制、有用。

例如 Library：

```text
还没有内容

把一本书、一部电影，
或一个与你有关的地方放进地图。
```

操作：

```text
添加第一条 Entry
```

避免：

- 大型插画
- 营销文案
- 很长的新手教程

---

## 27. Loading 与 Error

Loading 应保持安静。

优先：

- 系统 Activity Indicator
- 必要时 Skeleton
- 刷新时尽量保留已有内容

错误信息应该告诉用户：

1. 发生了什么
2. 数据是否安全
3. 接下来能做什么

例如云同步失败时，不应该让用户误以为本地 Entry 已经消失。

---

## 28. 数据持久化的界面原则

产品应该让用户感受到：

> 数据保存是即时的，备份和同步是可靠而安静的。

用户不需要理解：

- 数据库
- 同步协议
- 后端服务商

如果未来云备份需要 Apple 身份或其他轻量登录机制，界面应该解释其价值：

- 数据备份
- 换机恢复
- 多设备连续性

而不是单纯要求“请先登录”。

---

## 29. V1 Design System 范围

V1 不需要建立庞大的 Design System。

先定义一组可复用基础组件即可：

- Typography
- Semantic Colors
- Spacing
- Button
- Icon Button
- Text Field
- Search Field
- Chip
- Entry Row
- Bottom Sheet
- Navigation / Toolbar
- Empty State
- Loading
- Alert / Confirmation

不要在真正页面还没做之前就提前建立大量抽象组件。

---

## 30. Product UI 与 Map UI 的边界

### Product UI

包括：

- Navigation
- Add Entry
- Library
- Entry Detail
- Search
- Filters
- Sheets
- Tags
- Topics
- 数据同步状态

### Map UI

包括：

- Basemap
- Map Labels
- Spatial Selection
- Map Controls
- Interest Layer
- Point Marker
- Custom Area

地图具体规则仍以 `MAP_DESIGN.md` 为准。

---

## 31. V1 核心页面

### 1. Map

产品首页与主要空间入口。

### 2. Spatial Sheet

展示当前选中空间相关的 Entries。

### 3. Add Entry

快速记录入口。

### 4. Location Picker

通过 Search 或 Map 选择空间。

### 5. Library

所有 Entries + Search + 轻量 Filter。

### 6. Entry Detail

查看 / 编辑一个 Entry。

### 7. Minimal Settings

仅保留真正必要的设置项。

后续可能增加：

- Topic Detail
- Tag Spatial View
- Sync / Account
- Data Export
- 手动 Appearance Override
- 手动 Language Override
- Web Client

---

## 32. 设计验收标准

一个页面符合当前设计方向时，应满足：

- 主要动作容易理解
- 有地图时，地图仍然是视觉主体
- 不依赖装饰也能理解信息层级
- 不依赖大量彩色分类 Icon
- Light / Dark Mode 都保持协调
- 中文 / English 都不会破坏布局
- iPhone 上常用操作容易触达
- Sheet 与页面切换保持空间上下文
- Capture 足够轻量
- Entry 数量增加后 Library 仍保持安静
- 产品感觉是私人、个人化的，而不是社交化、商业化的

---

## 33. V1 非目标

V1 不围绕以下内容设计：

- Desktop Dashboard
- Social Feed
- Followers
- Travel Booking
- Complex Itinerary
- 大型媒体封面瀑布流
- Gamification
- 大量主题皮肤
- 大型 Settings Center
- 每种 Entry 类型独立视觉品牌
- 复杂 Onboarding

V1 始终聚焦于：

> **Capture → Spatialize → Rediscover**

即：

> **记录 → 空间化 → 再发现**
