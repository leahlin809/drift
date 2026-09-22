# SPEC_ENTRY_DETAIL.md

> 版本：v0.1  
> 平台：iPhone-first  
> 状态：V1 功能规格  
> 关联文档：
> - `PRODUCT.md`
> - `DATA_MODEL.md`
> - `DESIGN.md`
> - `ARCHITECTURE.md`
> - `SPEC_ADD_ENTRY.md`
> - `SPEC_LOCATION_PICKER.md`
> - `SPEC_MAP_BROWSE.md`
> - `SPEC_LIBRARY.md`

---

## 1. 功能目的

`Entry Detail` 用于完整查看一条 Entry，并作为用户从“内容”重新进入“空间漫游”的入口。

它应该更像：

> **一页个人文化笔记**

而不是：

> 数据库记录详情页。

核心目标：

- 完整阅读 Entry；
- 查看与该 Entry 相关的 Location、Tag、Topic；
- 从 Location / Tag / Topic 继续进入地图；
- 编辑或删除 Entry；
- 返回时保留原来的 Map / Library 上下文。

---

## 2. 进入方式

Entry Detail 可以从至少两个地方进入：

### 2.1 从 Map 进入

```text
Map
↓
Spatial Bottom Sheet
↓
Entry Row
↓
Entry Detail
```

### 2.2 从 Library 进入

```text
Library
↓
Entry Row
↓
Entry Detail
```

未来也可以从：

- Search result
- Topic
- Tag
- 其他 Entry relation

进入，但 V1 主要覆盖 Map / Library。

---

## 3. 默认页面结构

推荐结构：

```text
< 返回                         编辑

[Type Icon]

Title

Creator · Year

Locations
Paris
Vienna

Tags
#存在主义   #巴黎

Topics
法国文学想象

Note
完整显示用户笔记……

Source
小红书

Link
打开原页面 ↗
```

---

## 4. 信息层级

视觉优先级：

1. Title
2. 核心 Metadata
3. Locations
4. Tags / Topics
5. Note
6. Source / Link
7. 次要操作

其中：

> Title 是绝对主信息。

Type 只作为辅助识别，不抢 Title。

---

## 5. Type

Entry Detail 中继续使用：

> 单色、线性、小尺寸 Type Icon。

默认不需要大字显示：

- Book
- Movie
- Place
- Music

但系统内部仍保留明确 type enum，用于：

- filter
- search
- accessibility
- data logic

Type Icon 必须具有 accessibility label。

---

## 6. Title

Title 完整展示。

与 Library / Bottom Sheet 不同：

> Detail 中不截断 Title。

允许多行。

标题应保持较强视觉层级。

---

## 7. 核心 Metadata

Title 下方显示与 Type 对应的关键 Metadata。

例如：

### Book

```text
韩江 · 2014
```

### Movie

```text
Wong Kar-wai · 2000
```

### Music

```text
Artist · 2024
```

### Person

```text
Role · Period
```

### History / Event

```text
Date / Period
```

Metadata 应保持次级视觉，不做成数据库字段表格。

---

## 8. Locations

Location 是本产品最重要的信息之一，因此单独成组展示。

例如：

```text
Locations

Paris
Vienna
```

如果有 Point：

```text
Montparnasse Cemetery
Paris, France
```

### 8.1 显示 Explicit Location

Detail 主要展示：

> 用户显式绑定的 Location。

Derived Ancestors 不需要全部展开成重复列表。

例如：

```text
Explicit:
Montparnasse Cemetery · Point
```

系统虽然知道：

```text
Paris
Île-de-France
France
```

但 Detail 默认不需要把四级都重复展示。

---

## 9. 点击 Location

Location 可点击。

### 9.1 Country / Region / City

例如点击：

`Paris`

行为：

```text
Entry Detail
↓
Map
↓
定位到 Paris
↓
Paris Selection Outline
↓
适度 contextual zoom
↓
打开 Paris Bottom Sheet
```

### 9.2 Point

点击 Point：

```text
Entry Detail
↓
Map
↓
必要时开启 Point Layer
↓
定位到该 Point
↓
Point selected
↓
打开 Point Sheet
```

如果 Point Layer 原本关闭，为了完成此次明确导航意图，可以临时开启必要的 Point 显示。

---

## 10. Tags

Tags 单独成组。

Detail 中：

- 不受列表 `+N` 限制；
- 可以完整展示；
- 允许多行排列；
- 使用低饱和有色 Chip。

例如：

```text
#文学
#想象力
```

---

## 11. 点击 Tag

Tag 可点击。

例如：

```text
#存在主义
```

行为：

```text
Entry Detail
↓
Map
↓
建立新的 Map Filter
↓
selectedTags = [#存在主义]
↓
matchMode = Any
↓
重算 Interest Layer / City / Region / Point / Bottom Sheet
```

### 11.1 与旧 Map Filter 的关系

从 Entry Detail 主动点击 Tag：

> 视为一次新的地图浏览意图。

V1 默认用当前点击的 Tag 建立新的 Filter，不自动把之前隐藏在地图中的复杂 Filter 条件叠加进去。

这样行为更可预测。

---

## 12. Topics

如果 Entry 关联 Topic，则单独展示。

Topic 与 Tag 不完全相同。

Tag 是轻量标签。

Topic 是更完整的内容组织对象。

例如：

```text
Topics

法国文学想象
```

Topic 的视觉可以比 Tag 更正式，但保持克制。

---

## 13. 点击 Topic

Topic 可点击。

行为：

```text
Entry Detail
↓
Map
↓
Filter = selected Topic
↓
重新计算空间分布
```

V1 同样默认建立新的 Map Filter，而不是自动叠加旧条件。

---

## 14. Note

V1 只保留一个自由文本字段：

> **Note**

不再单独设置 `Remark`。

Note 可以用于：

- 个人感受
- 联想
- 为什么记录
- 阅读 / 观看心得
- Metadata 补充
- 版本说明
- 临时碎碎念
- 任何不适合结构化的信息

### 14.1 Detail 中的 Note

Detail 中完整展示 Note：

- 不截断；
- 允许多段；
- 允许自然换行；
- 给予舒适阅读空间。

Note 不使用数据库表格式展示。

---

## 15. Source

`Source` 为可选文本。

用于表达：

> 用户在哪里发现这条内容。

例如：

- 小红书
- 豆瓣
- 某本书
- 朋友推荐
- 课堂
- Podcast
- 旅行现场

显示方式：

```text
来源
小红书
```

Source 不等同于 Link。

---

## 16. Link

`Link` 为可选 URL。

Detail 中不直接暴露很长 URL。

推荐：

```text
链接
打开原页面 ↗
```

点击后：

- 调用系统浏览器；
- 或系统可识别的对应 App。

如果 URL 无效：

- 不崩溃；
- 给轻量错误提示。

---

## 17. 不再使用 Remark

V1 不存在独立 `Remark` 字段。

所有自由补充信息统一进入：

> Note

因此 Detail 中不展示 Remark Section。

---

## 18. Edit

右上角提供：

> 编辑

点击后进入 Entry Edit。

Edit 尽量复用 Add Entry 的表单结构：

- Title
- Type
- Location
- Note
- Tags
- Type-specific Metadata
- Source
- Link

---

## 19. Edit 保存

点击 Save：

1. 验证必填字段；
2. 更新本地 SQLite；
3. 更新关联表；
4. 更新 `updated_at`；
5. 成功后返回 Entry Detail；
6. Detail 立即显示最新内容。

未来云同步：

> 后台处理，不阻塞本地编辑成功。

---

## 20. Edit 取消

如果没有修改：

> 直接返回 Detail。

如果存在未保存修改：

```text
放弃这次编辑？

[继续编辑]
[放弃]
```

V1 不需要复杂 edit draft。

---

## 21. Delete 入口

Delete 不应长期占据主视觉。

推荐：

- Edit 页面底部；
- 或右上角 `…` 菜单。

不要将红色 Delete Button 放在 Entry Detail 最显眼的位置。

---

## 22. Delete 确认

删除必须二次确认。

示例：

```text
删除这条 Entry？

这会删除该 Entry 及其关联关系，
不会删除已有的 Tag、Topic 或 Location。

[取消] [删除]
```

---

## 23. Delete 数据规则

删除 Entry 时：

删除：

- Entry
- EntryLocation relation
- EntryTag relation
- EntryTopic relation

不删除：

- Location
- Tag
- Topic

除非这些对象未来有独立的清理机制。

删除规则遵循 `DATA_MODEL.md`。

---

## 24. Delete 后返回

如果从 Library 进入：

```text
Delete
↓
Library
```

被删除 Entry 从列表消失。

如果从 Map 进入：

```text
Delete
↓
Map
```

当前 Spatial Sheet：

- Entry Count 更新；
- 被删除 Entry 消失；
- 若该空间不再有内容，Interest Layer / dot / halo 应在数据刷新后正确更新。

---

## 25. 普通返回行为

如果用户只点击系统 Back：

### 从 Map 进入

恢复：

- map viewport
- zoom
- selected spatial location
- Bottom Sheet state
- active filters
- Point Layer state

### 从 Library 进入

恢复：

- Search Query
- Type Filter
- advanced filters
- Sort
- scroll position

---

## 26. 主动跳转与普通返回的区别

如果用户点击：

- Location
- Tag
- Topic

进入 Map：

> 这是一次新的用户导航意图。

因此新地图状态可以覆盖之前的浏览上下文。

但如果用户只是点击 Back：

> 应恢复原上下文。

这是两个不同语义。

---

## 27. Entry Detail 与 Map 的关系

Entry Detail 不只是终点。

它应该是：

> 从一条内容重新进入空间漫游的入口。

主要跳转：

```text
Entry
→ Location
→ Map spatial selection
```

```text
Entry
→ Tag
→ Map filtered distribution
```

```text
Entry
→ Topic
→ Map filtered distribution
```

---

## 28. 页面滚动

Detail 页面允许正常纵向滚动。

长 Note 时：

- Header / Back 保持符合 iOS 常见导航行为；
- 内容自然滚动；
- 不将 Note 放入小型内部 scroll view；
- 避免嵌套滚动。

---

## 29. 空字段处理

如果某字段为空：

> 不显示空 Section。

例如没有 Source：

不要显示：

```text
来源
—
```

直接省略该部分。

没有 Topic：

> 不显示 Topics Section。

没有 Note：

> 不显示空白 Note Section。

保持页面干净。

---

## 30. Accessibility

至少保证：

- Type Icon 有 accessibility label；
- Location / Tag / Topic 明确可点击；
- Link 有正确 role；
- Delete 是 destructive action；
- Title / Note 可被 VoiceOver 正确读取；
- 不只通过颜色表示可点击状态。

---

## 31. V1 非目标

Entry Detail V1 不做：

- 评论
- 点赞
- 分享 Feed
- Rating
- 阅读进度
- AI Summary
- AI 自动补充 Metadata
- 图片 Gallery
- 版本历史
- Related Entries 推荐算法
- 协作编辑

---

## 32. 核心验收场景

### 场景 A：从 Library 进入

1. 用户在 Library 点击一条 Entry；
2. 打开 Detail；
3. Title 完整显示；
4. Type Icon 正确；
5. Metadata、Locations、Tags、Topics、Note、Source / Link 按存在情况展示；
6. 返回后 Library 滚动位置和筛选状态恢复。

### 场景 B：从 Map 进入

1. 用户在 France Bottom Sheet 点击 Entry；
2. 打开 Detail；
3. 返回；
4. France 仍 selected；
5. 原 zoom / viewport 恢复；
6. Bottom Sheet 状态恢复。

### 场景 C：点击 Location

1. Detail 中点击 Paris；
2. 跳到 Map；
3. Map 定位 Paris；
4. Paris selected；
5. Selection Outline 显示；
6. 地图适度 zoom；
7. Paris Bottom Sheet 打开。

### 场景 D：点击 Point

1. Detail 中点击一个 Point；
2. Map 打开；
3. 必要时 Point Layer 开启；
4. 定位并选中 Point；
5. Point Sheet 显示该 Point 直接绑定的 Entry。

### 场景 E：点击 Tag

1. 点击 `#韩国文学`；
2. Map 打开；
3. Filter = #韩国文学；
4. Interest Layer 重算；
5. City / Region / Point / Bottom Sheet 都只使用匹配数据。

### 场景 F：编辑

1. 点击编辑；
2. 修改 Note；
3. Save；
4. SQLite 更新成功；
5. `updated_at` 更新；
6. 返回 Detail；
7. 新 Note 立即显示。

### 场景 G：删除

1. 点击 Delete；
2. 出现二次确认；
3. 确认；
4. Entry 与 join relations 删除；
5. Tag / Topic / Location 保留；
6. 返回来源页面；
7. UI 和聚合数量更新。

---

## 33. 核心规则总结

> **Entry Detail 是个人笔记页，不是数据库详情页。**

> **Title 是主信息，Type 只用简洁 Icon 辅助。**

> **Location 是核心内容，并且可以直接带用户回到地图。**

> **Tag / Topic 可以直接进入对应的 Map Filter。**

> **V1 只保留一个自由文本字段 Note，不再使用 Remark。**

> **Source 是来源名称，Link 是外部 URL，两者分开。**

> **普通返回恢复原上下文；点击 Location / Tag / Topic 属于新的地图导航意图。**

> **Delete 只删除 Entry 及关联关系，不删除 Tag / Topic / Location。**
