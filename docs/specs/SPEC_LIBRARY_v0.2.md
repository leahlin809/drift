# SPEC_LIBRARY.md

> 版本：v0.2  
> 平台：iPhone-first  
> 状态：V1 功能规格  
> 关联文档：
> - `PRODUCT.md`
> - `DATA_MODEL.md`
> - `DESIGN.md`
> - `ARCHITECTURE.md`
> - `SPEC_MAP_BROWSE.md`
> - `SPEC_ADD_ENTRY.md`

---

## 1. 功能目的

`Library` 是产品的辅助内容视图。

产品的主视图仍然是 Map；Library 的作用是让用户从“内容”而不是“空间”出发，快速浏览、搜索、筛选和重新打开已经保存的 Entry。

核心关系：

> **Map = 从空间看内容**

> **Library = 从内容看空间**

Library 不应发展成复杂后台、媒体数据库或重型知识管理系统。

---

## 2. 进入方式

App 底部导航保留两个一级入口：

```text
地图        收藏
Map         Library
```

默认启动 App 时：

> 进入 Map。

点击右侧 `Library / 收藏` Tab：

> 进入 Library。

`Add Entry` 不作为第三个底部 Tab，而继续作为全局操作存在。

---

## 3. Library 的产品定位

Library 是辅助功能，因此设计原则是：

- 简单
- 快速
- 文字优先
- 易扫描
- 易筛选
- 不抢 Map 的主产品地位

V1 不做：

- 大型媒体封面墙
- 瀑布流
- 多列复杂内容视图
- Dashboard
- 复杂知识图谱
- 大量统计卡片

---

## 4. 默认页面结构

推荐结构：

```text
收藏

[ 搜索 ]

[ 全部 ] [ Book ] [ Movie ] [ Music ] [ Place ] ...

────────────────

[书图标]  小王子
          圣埃克苏佩里 · 1943 · 法国
          #文学  #想象力

[地点图标]  蒙帕纳斯公墓
            Paris
            #墓地  #萨特  +1

[电影图标]  ...
```

页面主要组成：

1. 页面标题
2. Search
3. 常驻 Type Filter
4. Entry List
5. 高级 Filter 入口
6. Add Entry 全局入口

---

## 5. 页面标题

中文界面：

> 收藏

英文界面：

> Library

中文暂时使用“收藏”作为用户可见名称。

底层产品概念仍可继续使用 `Library`。

---

## 6. Search

Search 位于 Library 顶部。

作用：

> 搜索用户自己已经保存的内容。

Search 不搜索互联网，也不承担地点发现功能。

### 6.1 Search 范围

V1 搜索：

- Entry Title
- Creator / Author / Director / Artist
- Tag
- Topic
- Location display name
- Note

### 6.2 Search 行为

用户输入后：

- Entry List 实时或近实时过滤；
- 结果保持当前排序逻辑；
- 不需要复杂 relevance scoring；
- 不需要外部搜索引擎。

### 6.3 Note Search

Note 可参与基础全文匹配。

V1 不要求：

- 语义搜索
- Embedding
- AI Search
- 模糊意图理解

---

## 7. 常驻 Type Filter

Search 下方保留轻量 Type Filter。

默认：

> 全部

其他 Type：

- Book
- Movie
- Music
- Person
- History / Event
- Place / Space
- Article / Podcast
- Other

### 7.1 视觉

Type Filter 可使用：

> 小图标 + 文字

与 Add Entry 中的 Type Selector 保持一致。

避免：

- 强烈分类色
- 大卡片
- 多行复杂导航

### 7.2 交互

V1 常驻 Type Filter 默认：

> 单选。

例如：

```text
全部
Book
Movie
Place
```

选择 `Book`：

> Library List 只显示 Book Entry。

再次选择 `全部`：

> 恢复所有类型。

---

## 8. 高级 Filter 入口

Library 提供一个轻量 Filter icon。

点击后：

> 打开 Filter Sheet。

高级 Filter 用于组合：

- Type
- Tags
- Topics
- Location
- Sort

---

## 9. Filter Sheet

推荐结构：

```text
筛选收藏

Type
[ Book ]

Tags
[ #韩国文学 ]
[ #女性作家 ]

Topics
[ 法国文学想象 ]

Location
[ South Korea ]

匹配方式
● 任一匹配
○ 全部匹配

排序
最近更新

[应用]
```

Filter Sheet 不做复杂 Query Builder。

---

## 10. Type Filter 与高级 Type Filter

页面常驻 Type Filter 与 Filter Sheet 中的 Type：

> 应反映同一个 Library Type 状态。

例如：

用户在顶部选择：

`Book`

再打开 Filter Sheet：

> Type 应显示 Book。

反之亦然。

避免产生两个互相冲突的 Type Filter。

---

## 11. Tag / Topic 多选

Library 高级筛选支持：

- 多个 Tag
- 多个 Topic
- Tag + Topic 混合选择

V1 总数量限制：

> 最多 5 个。

这一规则与 Map Filter 保持一致。

---

## 12. Match Mode

Tag / Topic 多选支持：

### 任一匹配

```text
Any
```

底层：

```text
Tag A OR Tag B OR Topic C
```

### 全部匹配

```text
All
```

底层：

```text
Tag A AND Tag B AND Topic C
```

用户界面不直接使用：

- AND
- OR
- Boolean

中文显示：

```text
匹配方式

● 任一匹配
○ 全部匹配
```

---

## 13. Location Filter

Library 支持按 Location 筛选。

例如：

```text
France
Paris
Suzhou
Hokkaido
```

### 13.1 Location 层级规则

Location Filter 遵循 `DATA_MODEL.md` 和 `SPEC_MAP_BROWSE.md` 的层级继承规则。

例如选择：

```text
France
```

应匹配：

- 显式绑定 France 的 Entry
- 绑定 France 内 Region 的 Entry
- 绑定 France 内 City 的 Entry
- 绑定 France 内 Point 的 Entry

聚合必须按 Entry ID 去重。

### 13.2 Point Filter

选择具体 Point：

> 只匹配显式绑定该 Point 的 Entry。

不因为 Point 位于 Paris，就返回所有 Paris Entry。

---

## 14. Library Filter 与 Map Filter 独立

Library Filter 和 Map Filter：

- 使用相同的数据对象；
- 使用相似的 Tag / Topic / Match Mode 逻辑；

但：

> **两者状态独立。**

例如：

用户在 Library 选择：

```text
Book
#韩国文学
```

切回 Map：

> 不应自动改变 Map Interest Layer。

原因：

> Library 的筛选是内容管理行为，Map 的筛选是空间浏览行为。

避免用户产生隐式状态变化。

---

## 15. Filter 状态展示

如果启用了高级筛选，可以在 Library 顶部显示轻量状态。

例如：

```text
Book   #韩国文学   +2
```

或通过 Filter icon 的 active state 表示存在筛选。

不要长期占用大量垂直空间。

---

## 16. 清除筛选

用户应可以：

> 一键清除全部 Filter。

清除后：

- Type → 全部
- Tags → none
- Topics → none
- Location → none
- Match Mode → 默认 Any
- Sort 保持用户当前选择或恢复默认，具体可在实现时统一

V1 推荐：

> Sort 不随 Clear Filters 重置。

因为排序和筛选属于两个不同概念。

---

## 17. 默认排序

默认：

> 最近更新

底层：

1. `updated_at` descending
2. `created_at` descending 作为兜底

即：

> 最近创建或最近修改的 Entry 优先。

---

## 18. V1 排序方式

V1 提供三种：

### 18.1 最近更新

```text
updated_at DESC
created_at DESC
```

默认。

### 18.2 最近创建

```text
created_at DESC
```

### 18.3 标题排序

按 Title 升序。

中文、英文混合排序的最终 locale-aware 实现由技术层决定。

UI 可以显示：

> 标题

英文：

> Title

V1 不需要提供：

- 最近最少查看
- 最常查看
- 自定义拖动排序
- 作者排序
- 年份排序
- Location 距离排序

---

## 19. Entry List

Library 主体为纵向 Entry List。

复用 `SPEC_MAP_BROWSE.md` 中定义的统一 `Entry Row`。

结构：

```text
[Type Icon]  Title
             Metadata
             Tag Chips
```

---

## 20. Entry Type 的视觉表达

列表中不直接显示：

- Book
- Movie
- Place

文字 Type。

使用：

> 单色、线性、小尺寸 Icon。

系统内部继续保存明确 Type enum，用于：

- Filter
- Search
- Accessibility
- Data logic

---

## 21. Entry Row 标题

Title：

- 单行；
- 不换行；
- 超长使用 `…`；
- 不横向滚动；
- 不跑马灯。

例如：

```text
百年孤独：关于拉丁美洲历史与……
```

---

## 22. Metadata

Metadata：

- 单行；
- 不换行；
- 超长省略。

内容根据 Entry Type 变化。

示例：

```text
圣埃克苏佩里 · 1943 · 法国
```

或：

```text
Wong Kar-wai · 2000 · Hong Kong
```

Metadata 的目标是：

> 快速识别，而不是完整展示。

---

## 23. Tags

Tags：

- 单行；
- 低饱和有色 Chip；
- 不换行；
- 不横向滚动。

如果太多：

```text
#文学  #想象力
```

完整 Tags 在 Entry Detail 查看。

---

## 24. Note

V1 默认：

> Library Row 不展示 Note。

原因：

- Note 长度不可预测；
- 容易让列表高度失控；
- Library 主要用于扫描。

Note 仍然参与 Search。

---

## 25. Entry Row 高度

Entry Row 尽量保持稳定。

不同 Entry 不应因为：

- Title 太长
- Tag 太多
- Note 太多

产生巨大高度差。

核心目的是：

> 即使未来有数百 / 上千 Entry，Library 仍然容易浏览。

---

## 26. 点击 Entry

点击 Entry Row：

```text
Library
↓
Entry Detail
```

Entry Detail 负责完整阅读。

---

## 27. 从 Entry Detail 返回

返回 Library 后必须尽可能恢复：

- 原 Search Query
- 原 Type Filter
- 原高级 Filter
- 原 Sort
- 原 List scroll position

禁止：

> 每次返回都跳回 Library 顶部并清空筛选。

这是重要的上下文保持规则。

---

## 28. Library 与 Add Entry

Library 页面保留全局 `+ Add`。

点击：

```text
Library
↓
+ Add
↓
Add Entry
```

保存成功：

> 返回 Library。

新 Entry 应根据当前 Sort / Filter 决定是否立即可见。

### 28.1 新 Entry 被当前 Filter 排除

例如当前 Library Filter：

```text
Movie
```

用户新增：

```text
Book
```

保存后返回 Library：

> Book 不应为了“让用户看到刚添加的东西”而绕过当前 Filter。

可以：

- 保持 Filter；
- 给轻量保存成功反馈。

---

## 29. Empty State

### 29.1 完全没有 Entry

例如：

```text
还没有收藏

把一本书、一部电影，
或一个与你有关的地方放进地图。

[添加第一条 Entry]
```

保持：

- 简洁
- 无大型插画
- 无营销语言

### 29.2 Filter 无结果

例如：

```text
没有符合当前筛选的内容

[清除筛选]
```

不要显示成：

> 你的 Library 是空的

因为用户其实有数据，只是筛选后无结果。

### 29.3 Search 无结果

例如：

```text
没有找到“韩江”

可以尝试其他关键词。
```

---

## 30. Loading

本地 SQLite 查询通常应非常快。

如果需要 loading：

- 使用轻量 native activity indicator；
- 不阻塞整个 App；
- 尽量保留已有列表。

V1 不需要大量 Skeleton。

---

## 31. 大数据量

Library 应为未来大量 Entry 做基础准备。

需要避免：

- 一次渲染所有 Row；
- Row 高度无限增长；
- 图片阻塞滚动；
- 每个 Row 做复杂计算。

优先使用适合 React Native 的虚拟列表实现。

具体技术由 `ARCHITECTURE.md` 和实现阶段决定。

---

## 32. Search + Filter 组合

Search 和 Filter 可以同时生效。

例如：

```text
Search:
韩江

Type:
Book

Tag:
#韩国文学
```

最终结果：

> 必须同时满足 Search 和当前 Filter。

Filter 内部的 Tag / Topic 再根据 Any / All 处理。

---

## 33. Sort 与 Search / Filter

Sort 应作用于：

> 当前已经被 Search / Filter 筛出的结果集。

顺序：

```text
All Entries
↓
Search
↓
Filters
↓
Deduplicate
↓
Sort
↓
Render
```

---

## 34. 去重

Library 正常情况下一个 Entry 只显示一次。

Location 多重继承、多 Tag、多 Topic 不得导致：

> 一个 Entry 在列表中出现多次。

去重依据：

> Entry ID

---

## 35. Accessibility

要求：

- Type Icon 有 accessibility label；
- Filter chip 可被 VoiceOver 理解；
- Search 有明确 label；
- active filter 不只依赖颜色；
- Entry Row 整体具有合理 touch target；
- 截断文本在 Entry Detail 中可完整访问。

---

## 36. V1 非目标

Library V1 不做：

- Gallery / Cover Grid
- 多列瀑布流
- 批量编辑
- 批量删除
- Folder
- Collection hierarchy
- 拖拽排序
- Smart Collection
- AI Search
- Recommendation
- Reading progress
- Rating system
- Social sharing feed
- 复杂统计面板

---

## 37. 核心验收场景

### 场景 A：进入 Library

1. App 默认在 Map；
2. 用户点击底部 `收藏 / Library`；
3. Library 打开；
4. Search、Type Filter、Entry List 正常显示。

### 场景 B：Type Filter

1. 默认 `全部`；
2. 用户点击 Book；
3. 列表只显示 Book；
4. Entry Row 仍使用图标，不直接显示 Book 文字；
5. 点击全部恢复。

### 场景 C：Tag 多选 Any

1. Filter Sheet；
2. 选择：
   - #韩国文学
   - #女性作家
3. Match = 任一匹配；
4. 返回所有命中任一 Tag 的 Entry；
5. 同一 Entry 只显示一次。

### 场景 D：Tag 多选 All

1. 使用同样两个 Tag；
2. Match = 全部匹配；
3. 只显示同时具有两个 Tag 的 Entry。

### 场景 E：Location Filter

1. 用户选择 France；
2. Library 显示：
   - France 显式 Entry
   - France 内 Region Entry
   - France 内 City Entry
   - France 内 Point Entry
3. 同一 Entry 去重。

### 场景 F：Search + Filter

1. Search `韩江`；
2. Type = Book；
3. Tag = #韩国文学；
4. 列表只显示同时符合这些条件的 Entry。

### 场景 G：返回状态

1. 用户已经滚动较远；
2. 当前 Filter = Book + #韩国文学；
3. 点击 Entry；
4. 查看 Detail；
5. 返回；
6. Search / Filter / Sort / scroll position 保持。

### 场景 H：新增 Entry

1. 从 Library 点击 `+`；
2. 新增 Entry；
3. Save；
4. 返回 Library；
5. 当前 Filter / Sort 不被自动重置；
6. 如果新 Entry 符合当前条件，则正常出现；
7. 如果不符合，不强制插入列表。

---

## 38. 核心规则总结

> **Library 是辅助内容视图，Map 才是产品主视图。**

> **Library 默认使用紧凑、文字主体 + Type Icon 的纵向列表。**

> **Type Filter 常驻，高级 Filter 放入独立 Sheet。**

> **Tag / Topic 支持多选，最多 5 个，并支持任一匹配 / 全部匹配。**

> **Library Filter 与 Map Filter 状态独立。**

> **Search 搜用户自己的内容，不承担互联网搜索。**

> **Row 中 Title、Metadata、Tags 均保持单行与稳定高度；完整内容进入 Entry Detail。**

> **所有筛选和 Location 层级聚合必须按 Entry ID 去重。**
