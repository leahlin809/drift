# SPEC_MAP_BROWSE.md

> 版本：v0.2  
> 平台：iPhone-first  
> 状态：V1 功能规格  
> 关联文档：
> - `PRODUCT.md`
> - `DATA_MODEL.md`
> - `DESIGN.md`
> - `MAP_DESIGN.md`
> - `ARCHITECTURE.md`

---

## 1. 功能目的

`Map Browse` 是产品的核心浏览体验。

它的目标不是帮助用户像 Google Maps 一样“搜索地点”，而是让用户：

- 在地图上漫游；
- 看到自己的文化内容在世界上的空间分布；
- 从 Country → Region / City → Point 逐层下钻；
- 通过 Tag / Topic 切换不同的兴趣切片；
- 在某个空间中重新发现自己曾经记录过的 Entry。

核心体验：

> **Browse / Explore > Search**

地图不是地点搜索工具，而是用户长期积累内容的“空间入口”。

---

## 2. 默认地图状态

App 打开后，Map 为默认主界面。

默认状态：

- 显示 Mapbox Basemap；
- 显示 Country-level Interest Layer；
- 不默认显示 Point；
- 不默认铺开大量 City / Region；
- 不显示永久性大搜索框；
- 保持地图界面克制、安静、可漫游。

### 2.1 默认 Interest Layer

默认 Interest Layer 以 **Country** 为主要空间单位。

作用：

> 让用户一眼看到自己在哪些国家积累了更多内容。

视觉方式：

- 使用低饱和、克制的填充色；
- 通过明暗 / 强度差异表达内容密度；
- 不使用红黄绿强热力图；
- 不让 Interest Layer 覆盖或破坏 Basemap 的基本地理可读性。

概念示例：

```text
无内容
→ 原始 Basemap

少量内容
→ 极轻的填充

中等内容
→ 稍明显的填充

较多内容
→ 更明显，但仍克制
```

V1 暂不要求最终确定精确色值与强度算法，但需要保证视觉语义清晰：

> 填充强度 = 内容密度，而不是“当前选中状态”。

---

## 3. Location 层级模型

Country / Region / City / Point 并不是完全并列关系，而是存在明确空间层级。

典型关系：

```text
Point
→ City
→ Region
→ Country
```

并非所有国家或地区都一定具有完整四级层级，但系统应尽可能解析可用的上级空间。

### 3.1 向上继承

Entry 显式绑定某个 Location 后，应自动继承所有可解析的上级空间，用于：

- 地图聚合；
- Entry count；
- Interest Layer；
- Spatial Sheet；
- Tag / Topic 空间分布；
- Library / Filter 中的空间筛选。

例如：

```text
Entry A
Explicit Location:
Montparnasse Cemetery · Point

Ancestors:
Paris · City
Île-de-France · Region
France · Country
```

那么 Entry A 应该可以在：

- Point
- Paris
- Île-de-France
- France

这些层级中被发现。

### 3.2 不向下推断

上级 Location 不反向推断下级空间。

例如：

```text
Entry B
Explicit Location:
France · Country
```

系统只能确定该 Entry 与 France 相关。

不能自动推断：

- Île-de-France
- Paris
- 某个 Point

### 3.3 显式绑定与继承的区别

系统需要区分：

- Explicit Location：用户真正选择的空间；
- Derived Ancestors：系统为了聚合而自动继承的上级空间。

这两者在数据上不应完全混为一谈。

---

## 4. 聚合去重规则

这是 Map Browse 的核心规则之一。

> **同一个 Entry 在同一空间层级中只能计数一次。**

例如：

```text
Entry A 显式绑定：
- Montparnasse Cemetery · Point
- Paris · City
```

Point 会自动继承到 Paris。

因此 Entry A 同时通过：

- Point ancestor
- Explicit Paris

命中 Paris。

但 Paris 的统计必须是：

```text
Entry A = 1
```

不能重复计数。

该规则必须同时应用于：

- Country Entry Count
- Region Entry Count
- City Entry Count
- Interest Layer
- Tag 分布
- Topic 分布
- Spatial Sheet Entry List

去重依据：

> Entry ID

---

## 5. 不同空间层级的视觉表达

不同空间层级使用不同的视觉语言。

### 5.1 Country

默认视觉：

> Area Fill

作用：

- 参与 Interest Layer；
- 表达 Country-level 内容密度。

### 5.2 Region / City

默认视觉：

> Dot / Halo

作用：

- 表示“这里有你的内容”；
- 不代表具体 Entry；
- 不应该像 Point Marker 一样被误认为精确地点。

City / Region 提示随 zoom 逐渐出现。

### 5.3 Point

默认视觉：

> Marker

但 V1 默认隐藏 Point Layer。

只有用户主动开启 Point Layer，并且 zoom 达到合理范围后才逐渐显示。

---

## 6. Zoom 层级与渐进展示

地图遵循：

> More zoom does not mean show everything.

不同 zoom 下展示不同层次的信息。

### 6.1 世界 / 大区域视角

显示：

- Country-level Interest Layer
- Country labels
- Country boundaries
- Basemap 核心信息

默认不显示：

- 大量 City / Region 提示
- Point Marker
- Entry Marker

### 6.2 国家视角

进入某个国家后：

- Country Interest Layer 可继续保留，但视觉上可以适度弱化；
- 与用户内容有关的 City / Region 提示逐渐出现；
- 不展示所有行政区域与所有城市；
- 只突出与用户内容相关的空间。

### 6.3 Region / City 视角

进一步放大后：

- City / Region 提示更明确；
- 用户可以继续点击下钻；
- Point 仍默认不显示；
- 用户可主动开启 Point Layer。

### 6.4 Point 视角

Point Layer 开启，并且 zoom 足够近时：

- 显示 Point Marker；
- Zoom 越近，Point 显示越完整；
- Zoom 太远时应减少 Marker 数量或隐藏；
- 避免整个地图被大量 Marker 覆盖。

---

## 7. 点击空间后的反馈

点击 Country / Region / City 后，系统应同时提供：

1. Selection visual feedback
2. Contextual zoom
3. Bottom Sheet content feedback

---

## 8. Selection 视觉反馈

选中空间默认不通过再次改变 Interest Layer 填充色来表达。

原因：

> Interest Layer 已经使用颜色强度表达内容密度。

因此选中状态使用：

> **Boundary / Outline**

### 8.1 Country Selection

点击 Country 后：

- 保留原 Interest Layer 填充；
- Country 外轮廓出现更清晰的 Selection Outline；
- Outline 比 Basemap 原国家边界明显；
- 但不应过粗或抢眼；
- 可以使用中性色或克制的 Accent；
- 可使用短暂淡入动画。

视觉语义：

```text
Area Fill
= 内容密度

Outline
= 当前选中
```

### 8.2 Region Selection

Region 选中后：

- 使用 Region boundary / outline；
- 保持与 Country Selection 相同的视觉语义。

### 8.3 City Selection

如果存在可靠城市边界：

- 可使用轻量边界 outline；

如果没有适合的 boundary geometry：

- 可以使用 subtle halo / selected node state。

### 8.4 Point Selection

Point 不使用区域 outline。

选中后使用：

- Marker selected state
- 轻微尺寸 / halo / emphasis

即可。

---

## 9. Contextual Zoom

空间选择可以触发适度自动缩放。

原则：

> **Contextual zoom should be conservative and preserve geographic context.**

即：

> 空间选择可以触发情境化缩放，但缩放应保持克制，并保留必要的地理上下文。

### 9.1 Country

点击 Country：

```text
Country selected
↓
Selection Outline
↓
地图平滑居中
↓
小幅 zoom-in
↓
Bottom Sheet 出现
```

要求：

- 保留部分周边国家作为空间参照；
- 不直接跳到 City level；
- 不让 Country 瞬间撑满整个屏幕；
- 动画平滑；
- 用户仍然可以立即手动 drag / zoom。

### 9.2 Region

点击 Region：

- 适度再下钻一级；
- 保留部分周边区域；
- 不自动进一步进入 City。

### 9.3 City

点击 City：

- 居中 City；
- 可以比 Country 稍明显地 zoom-in；
- 仍然避免激烈跳转。

### 9.4 Point

点击 Point：

- 以居中为主；
- 不需要大幅 zoom；
- 若当前 zoom 太远，可做适度补偿。

---

## 10. Bottom Sheet

点击 Country / Region / City 后，Bottom Sheet 从底部出现。

### 10.1 默认高度

默认：

> 中等高度

目标：

- 用户仍然能看到地图；
- 同时能立即看到当前空间中的前几条 Entry。

### 10.2 Sheet 状态

至少支持：

- Medium
- Expanded
- Collapsed / Dismissed

交互：

- 上滑 → 展开
- 下滑 → 收起 / 关闭
- 保持自然惯性
- 尊重 Safe Area

### 10.3 Sheet Header

顶部保持克制。

只显示：

- 当前 Location 名称
- `N Entries`

例如：

```text
France
12 Entries
```

V1 不放：

- 统计图
- Tag cloud
- Topic chart
- 大型筛选工具栏
- Dashboard 信息

---

## 11. Bottom Sheet Entry 数据范围

### 11.1 Country / Region / City

展示：

> 当前空间层级下聚合后的 Entry。

包括：

- 显式绑定到该空间的 Entry；
- 通过下级 Location 向上继承到该空间的 Entry。

例如：

```text
Entry A
Point in Paris
→ 会出现在 France Sheet

Entry B
Paris · City
→ 会出现在 France Sheet

Entry C
France · Country
→ 会出现在 France Sheet
```

### 11.2 Point

Point Sheet 优先展示：

> 显式绑定到该 Point 的 Entry。

不要因为 Point 属于 Paris，就把所有 Paris Entry 都塞进该 Point Sheet。

---

## 12. Bottom Sheet Entry 去重

同一个 Entry 只出现一次。

即使通过：

- 多个显式 Location
- Explicit + Derived ancestor
- 多条空间关系

同时命中当前空间，也只显示一次。

---

## 13. Entry Row 视觉结构

Bottom Sheet 与 Library 共用统一 Entry Row。

### 13.1 Type 表达

视觉上不直接写：

- Book
- Movie
- Place

而使用：

> **单色、简洁、线性的小尺寸 Type Icon**

例如：

- Book → 书籍线稿
- Movie → 电影 / 胶片图标
- Place / Space → Location pin
- Music → 音符 / 唱片
- Person → 人像轮廓
- History / Event → 时间 / 纪念类图标
- Article / Podcast → 文章 / 耳机 / 麦克风
- Other → 通用图标

要求：

- 单色
- 黑白 / semantic foreground
- 不使用大面积颜色
- 不使用 Emoji
- 不使用拟物图标
- 与 iOS / SF Symbols 风格协调

系统内部仍保留 type 文字枚举，用于：

- filter
- search
- accessibility
- data logic

### 13.2 Entry Row 信息层级

标准结构：

```text
[Type Icon]  Title
             Secondary Metadata
             Tag Chips
```

例如：

```text
[书籍图标]  小王子
           圣埃克苏佩里 · 1943 · 法国
           #文学  #想象力
```

---

## 14. Title 截断规则

Title：

- 只显示一行；
- 不自动换行；
- 不横向滚动；
- 不使用跑马灯；
- 超出宽度后显示省略号 `…`。

例如：

```text
百年孤独：关于拉丁美洲历史与……
```

完整标题在 `Entry Detail` 中查看。

---

## 15. Metadata 截断规则

Metadata：

- 只显示一行；
- 不自动换行；
- 超出宽度后省略。

示例：

```text
加西亚·马尔克斯 · 1967 · 哥伦……
```

Metadata 只承担快速扫视作用。

---

## 16. Tags 视觉与溢出规则

Tag 使用：

> 轻微有色的小型 Chip

视觉要求：

- 低饱和底色；
- 小圆角矩形或 pill；
- 比正文更有区分度；
- 但不能像主要按钮一样抢眼。

示例：

```text
#存在主义
#韩国文学
#墓地
```

### 16.1 Tag 单行规则

Tags：

- 只显示一行；
- 不换行；
- 不做横向滚动。

空间不足时：

```text
#韩国文学  #女性作家  #历史  +4
```

其中：

`+4` = 还有 4 个 Tag 未显示。

完整 Tag 列表在 Entry Detail 中查看。

---

## 17. Note 在 Entry Row 中的规则

V1 默认：

> 不在 Bottom Sheet Entry Row 中展示 Note 正文。

原因：

- Note 长度不可控；
- 容易破坏 Row 高度；
- 会降低列表扫描效率。

完整 Note 只在 `Entry Detail` 中阅读。

后续如有真实需求，可再增加“一行 Note Preview”选项。

---

## 18. Entry Row 高度原则

Entry Row 应保持：

- 紧凑；
- 稳定；
- 高度差异尽可能小。

核心目标：

> 即使用户未来有数百条 Entry，列表依然能快速扫视。

---

## 19. Entry 排序

V1 默认：

1. `updated_at` 较新优先
2. 如果 `updated_at` 相同或缺失，则 `created_at` 较新优先

即：

> 最近创建 / 最近更新的内容优先出现。

V1 不做复杂推荐排序。

---

## 20. 点击 Entry

点击 Bottom Sheet 中某个 Entry：

```text
Spatial Sheet
↓
Entry Row
↓
Entry Detail
```

进入 Entry Detail 后：

- 显示完整内容；
- 可查看完整 Title；
- 完整 Metadata；
- 完整 Tags；
- Note；
- Location；
- Source / Link 等。

---

## 21. 从 Entry Detail 返回

返回 Map 后必须尽可能恢复：

- 原地图中心位置；
- 原 zoom；
- 当前选中的 Country / Region / City / Point；
- Bottom Sheet 状态；
- 当前筛选条件；
- Point Layer 开关状态。

禁止：

> 返回后直接跳回默认世界地图。

这是核心上下文保持规则。

---

## 22. Point Layer

Point 默认不显示。

原因：

- 防止地图过度拥挤；
- 默认体验强调空间漫游与宏观分布；
- Point 属于更精确的下钻内容。

### 22.1 开启方式

用户可以通过轻量地图层级 / 内容控制主动开启。

具体 UI 可在实现时进一步验证，但应保持：

- 小型
- 不长期占据大量地图空间
- 不做复杂 GIS layer panel

### 22.2 开启后

只显示：

- 当前视野 / zoom 合适范围内的 Point；
- 当前 Filter 条件下相关的 Point。

如果 Point 数量过多，应通过：

- zoom threshold
- clustering / reduction
- progressive reveal

避免屏幕爆炸。

---

## 23. Filter 概念

Map Browse 支持通过：

- Tag
- Topic

切换当前正在看的“知识切片”。

核心原则：

> Tag / Topic 不叠加第二套地图视觉语言，而是重新计算当前 Interest Layer。

即：

```text
All Entries
↓
Selected Filters
↓
Filtered Entries
↓
Recalculate Map Distribution
```

---

## 24. Filter 后的地图变化

应用 Tag / Topic Filter 后：

- Country Interest Layer 重新计算；
- City / Region dot / halo 重新计算；
- Point Layer（若开启）只显示匹配内容；
- Bottom Sheet 只显示匹配 Entry；
- Entry Count 只统计匹配结果；
- 所有聚合仍按 Entry ID 去重。

关闭 Filter：

> 恢复 All Entries。

---

## 25. Tag / Topic 多选

V1 支持：

- 多个 Tag
- 多个 Topic
- Tag + Topic 混合选择

总数量：

> 最多 5 个。

目的：

- 支持更丰富的兴趣切片；
- 同时限制界面复杂度。

---

## 26. Match Mode

V1 支持两种匹配方式。

### 26.1 Any

默认模式：

> 任一匹配

底层逻辑：

```text
Tag A OR Tag B OR Topic C
```

适合：

- 漫游
- 扩大探索范围
- 查看多个主题的联合空间分布

### 26.2 All

可切换：

> 全部匹配

底层逻辑：

```text
Tag A AND Tag B AND Topic C
```

适合：

- 聚焦
- 切出更具体的内容子集

例如：

```text
#韩国文学
+
#女性作家
```

使用 `All`：

> 只显示同时属于“韩国文学”和“女性作家”的 Entry。

---

## 27. Filter UI 文案

主界面不直接显示技术表达：

- AND
- OR
- Boolean

用户看到：

```text
匹配方式

● 任一匹配
○ 全部匹配
```

英文：

```text
Match

● Any
○ All
```

---

## 28. Filter 主入口

Map 页面提供一个轻量 Filter 入口。

建议：

- 小型 Filter icon；
- 作为地图浮动控件或顶部轻量操作；
- 不放常驻大型筛选栏。

点击后打开：

> Filter Sheet

---

## 29. Filter Sheet

Filter Sheet 可包含：

```text
筛选地图

Tags
[ #韩国文学 ]
[ #女性作家 ]
[ #墓地 ]

Topics
[ 法国文学想象 ]
[ 现代主义 ]

匹配方式
● 任一匹配
○ 全部匹配

已选择 3 / 5

[应用]
```

要求：

- 不超过 5 个筛选项；
- Tag / Topic 视觉上可以区分；
- 不做复杂 query builder。

---

## 30. Filter 应用后的地图顶部状态

应用 Filter 后，主地图只显示轻量 Filter Chips。

例如：

```text
#韩国文学   #女性作家   +1   ×
```

避免：

- 显示全部 5 个导致地图顶部拥挤；
- 常驻大型筛选面板。

`+1` 表示还有 1 个已选 Filter 未展开显示。

点击 `×`：

> 清除当前 Filter，恢复 All Entries。

---

## 31. 从 Entry Detail 进入地图筛选

Entry Detail 中的 Tag / Topic 可以成为快捷入口。

例如点击：

```text
#韩国文学
```

可以：

```text
Entry Detail
↓
Map
↓
Filter = #韩国文学
```

地图立即显示该 Tag 的空间分布。

这是一种：

> 从内容进入地图

的快捷路径。

---

## 32. Library 与地图 Filter 的关系

Library 可以拥有自己的内容筛选。

但 V1 不要求：

> Library Filter 自动修改 Map Filter。

两者可以共享 Tag / Topic 数据结构，但界面状态可以独立。

避免用户在 Library 中筛选后，回 Map 时突然发现地图也被意外改变。

---

## 33. Search 的角色

Search 是辅助功能，不是 Map Browse 的核心。

### 33.1 Map 首页

V1 不放常驻大搜索栏。

### 33.2 Location Picker

保留轻量 Search，用于：

- 快速找到国家
- 快速找到城市
- 快速找到已知地点
- 快速移动地图到目标区域

### 33.3 Library

Search 用于查找用户自己的内容，例如：

- Title
- Creator
- Tag
- Topic
- Location

Map 的主要浏览方式始终是：

> Explore / Browse / Filter

而不是 Search。

---

## 34. Interest Layer 与 Filter Color Rule

Interest Layer 的颜色只表达：

> 内容密度

Tag / Topic 的颜色主要表达：

> 当前筛选身份

例如：

```text
#韩国文学
```

Filter Chip 可以拥有轻微有色背景。

但地图本身不因此切换成“韩国文学专属蓝色”。

地图继续使用统一 Interest Layer 色阶，只是输入数据从：

```text
All Entries
```

变成：

```text
Filtered Entries
```

这样不同 Tag / Topic 之间不会制造多套视觉语言。

---

## 35. Map Browse 状态模型

Map Browse 至少需要管理以下状态：

```text
selectedSpatialLocation
mapViewport
sheetState
pointLayerEnabled
selectedTags[]
selectedTopics[]
matchMode
activeFilterState
```

返回 Entry Detail 后，应尽量恢复这些状态。

---

## 36. V1 非目标

本 Spec 不要求 V1 实现：

- Polygon / Custom Area 绘制；
- 大型 GIS Layer Manager；
- 路线规划；
- Heatmap 动画；
- 社交地图；
- 位置分享；
- 多人协作；
- AI 推荐地点；
- 自动生成旅游路线；
- 地图顶部常驻复杂搜索框；
- Bottom Sheet 内复杂统计 Dashboard。

---

## 37. 核心验收场景

### 场景 A：世界地图漫游

1. 用户打开 App；
2. 看到 Country Interest Layer；
3. Point 默认不显示；
4. 点击 France；
5. France 出现清晰 Selection Outline；
6. 地图平滑小幅 zoom；
7. Bottom Sheet 以中等高度出现；
8. Sheet 显示 France 下去重后的 Entry；
9. 用户仍能看到地图上下文。

### 场景 B：下钻到 City

1. 用户进入某国家视角；
2. 有内容的 City / Region 逐渐出现 dot / halo；
3. 用户点击 Suzhou；
4. City selected state 出现；
5. 地图适度居中 / zoom；
6. Bottom Sheet 更新为 Suzhou 相关 Entry。

### 场景 C：Point

1. 用户主动开启 Point Layer；
2. 地图在合适 zoom 下显示 Point Marker；
3. 点击某 Point；
4. Marker 进入 selected state；
5. Bottom Sheet 只展示直接绑定该 Point 的 Entry。

### 场景 D：层级继承

1. Entry A 显式绑定 Paris 的 Point；
2. 用户点击 France；
3. Entry A 应出现在 France Sheet；
4. 用户点击 Paris；
5. Entry A 应出现在 Paris Sheet；
6. 用户点击该 Point；
7. Entry A 应出现在 Point Sheet。

### 场景 E：聚合去重

1. Entry A 同时显式绑定 Point in Paris 与 Paris；
2. 用户查看 Paris；
3. Entry A 只能出现一次；
4. Paris Entry Count 中只计数一次。

### 场景 F：Tag Filter

1. 用户打开 Filter Sheet；
2. 选择 `#韩国文学`；
3. 应用；
4. Country Interest Layer 重算；
5. City / Region 提示重算；
6. Bottom Sheet 只显示匹配 Entry；
7. 地图顶部显示 `#韩国文学 ×`；
8. 清除后恢复 All Entries。

### 场景 G：多 Filter + All

1. 用户选择：
   - `#韩国文学`
   - `#女性作家`
2. Match Mode = 全部匹配；
3. 地图只统计同时符合两个 Tag 的 Entry；
4. 聚合按 Entry ID 去重。

### 场景 H：返回地图上下文

1. 用户在 France Sheet 中点击某 Entry；
2. 进入 Entry Detail；
3. 返回；
4. 地图仍处于 France 原 zoom / center；
5. France 仍是 selected；
6. Sheet 恢复；
7. Filter 状态不丢失。

---

## 38. 最终核心规则总结

Map Browse 必须始终遵循：

> **Interest Layer 表达“哪里有我的内容”。**

> **Selection Outline 表达“我现在正在看哪里”。**

> **Country 用 Area Fill，City / Region 用 Dot / Halo，Point 用 Marker。**

> **Location 向上继承，不向下推断。**

> **所有空间聚合必须按 Entry ID 去重。**

> **Tag / Topic Filter 改变数据集，不改变地图基本视觉语言。**

> **地图的核心是漫游与重新发现，而不是地点搜索。**
