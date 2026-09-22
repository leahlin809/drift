# SPEC_ADD_ENTRY.md

> 版本：v0.2  
> 平台：iPhone-first  
> 状态：V1 功能规格  
> 关联文档：
> - `PRODUCT.md`
> - `DATA_MODEL.md`
> - `DESIGN.md`
> - `ARCHITECTURE.md`
> - `SPEC_LOCATION_PICKER.md`

---

## 1. 功能目的

`Add Entry` 是用户将文化内容放入私人地图的主要入口。

核心目标：

> **Capture First, Organize Later.**

用户应该能够在很短时间内完成记录，不需要填写完整的媒体数据库信息，也不应因为缺少次要 Metadata 而无法保存。

---

## 2. 添加入口

V1 的主要页面右上角提供全局 `+ Add` 入口。

至少在以下主页面可访问：

- Map
- Library

Entry Detail 是否保留 Add 入口，可在实现时根据导航空间进一步确认。

点击 `+` 后进入 Add Entry。

---

## 3. 页面形态

Add Entry 使用：

> **全屏 Modal Page / Full-screen Modal**

不使用半屏 Bottom Sheet 作为主要录入界面。

原因：

- 需要输入标题、Note、Tag、Metadata；
- 会频繁调用系统键盘；
- Location Picker 可能进一步打开地图；
- 全屏更适合连续编辑，也更符合 iPhone 输入场景。

---

## 4. 页面头部

建议结构：

```text
取消              添加 Entry              保存
```

### 左侧

`取消`

### 中间

页面标题：

`添加 Entry`

### 右侧

`保存`

Save 状态随必填项完成情况变化。

---

## 5. 核心字段顺序

默认从上到下：

1. Title
2. Type
3. Location
4. Note
5. Tags
6. 更多信息 / Metadata

核心思想：

> 先完成“这是什么 + 和哪里有关”，再补充个人理解和结构化信息。

---

## 6. 必填字段

V1 必填：

- Title
- Type
- 至少一个 Location

只有这三项完成后，Save 才可用。

---

## 7. 选填字段

V1 选填：

- Note
- Tags
- Creator / Author / Director / Artist 等类型相关 Metadata
- Year / Date / Period
- Source
- Link

任何选填项缺失都不能阻止保存。

---

## 8. Title

Title 为单行文本输入。

要求：

- 必填；
- 去除首尾无意义空格；
- 允许中文、英文及混合语言；
- 不强制唯一；
- 不因疑似重复而阻止保存。

V1 不做强制查重。

---

## 9. Type

Type 为必填。

V1 类型：

- Book
- Movie
- Music
- Person
- History / Event
- Place / Space
- Article / Podcast
- Other

底层枚举遵循 `DATA_MODEL.md`。

### 9.1 Type 视觉

Add Entry 中：

> **图标 + 文字同时显示。**

原因：

- 用户正在做选择；
- 仅靠图标容易产生歧义；
- 类型数量较多，需要清晰命名。

示例：

```text
[书图标] Book
[电影图标] Movie
[地点图标] Place
```

图标要求：

- 单色
- 线性
- 小尺寸
- 与 iOS / SF Symbols 风格协调
- 不使用 Emoji
- 不使用强烈分类色

### 9.2 Type 选择控件

可以使用：

- 紧凑横向选择器
- 简洁 Grid
- Bottom Sheet selector

最终实现应优先保证：

- 一眼可扫；
- 不占过多纵向空间；
- 不做彩色大卡片。

---

## 10. Type 与 Metadata

不同 Type 只增加少量必要 Metadata。

所有 Metadata 默认选填。

### 10.1 Book

- Author
- Year
- Source
- Link

### 10.2 Movie

- Director
- Year
- Source
- Link

### 10.3 Music

- Artist
- Year
- Source
- Link

### 10.4 Person

- Role
- Period
- Source
- Link

### 10.5 History / Event

- Date / Period
- Source
- Link

### 10.6 Place / Space

- Source
- Link

不提供固定 `Place Type / Place Subtype`。

博物馆、墓地、街道、建筑等分类统一通过 Tags 表达。

### 10.7 Article / Podcast

- Creator / Author
- Year
- Source
- Link

### 10.8 Other

- Source
- Link

---

## 11. Note

Note 是所有 Entry 共有的重要个人字段。

特点：

- 选填；
- 多行文本；
- 直接显示在主表单；
- 不隐藏进“更多信息”。

Note 用于：

- 感受
- 联想
- 为什么记录
- 阅读 / 观看后的想法
- 与地点之间的个人理解

V1 不再单独设置 `Remark`。所有自由补充、Metadata 补充、版本说明与临时说明统一写入 `Note`。

---

## 12. Tags

Tags 为选填。

用户可以：

- 选择已有 Tag；
- 创建新 Tag；
- 删除已选 Tag。

Tag 不预置复杂 taxonomy。

Place / Space 的更细分类也由 Tag 表达。

示例：

```text
#文学
#想象力
#博物馆
```

---

## 13. Location

Location 为必填。

至少需要一个 Location。

支持：

- 单 Location
- 多 Location

V1 Location 类型：

- Country
- Region
- City
- Point

`Custom Area / Polygon` 保留在数据模型中，但 V1 不提供绘制入口。

详细选择逻辑由 `SPEC_LOCATION_PICKER.md` 定义。

---

## 14. 多 Location

一个 Entry 可以绑定多个 Location。

示例：

```text
Paris ×
Vienna ×
+ 添加位置
```

用户可以：

- 添加第二个、第三个 Location；
- 删除已选 Location；
- 重新进入 Picker 继续选择。

Location 聚合与层级继承遵循 `DATA_MODEL.md` 和 `SPEC_MAP_BROWSE.md`。

---

## 15. Metadata 展开方式

核心页面默认只展示：

- Title
- Type
- Location
- Note
- Tags

其余 Metadata 放入：

> `更多信息`

默认折叠。

点击后展开当前 Type 对应字段。

原因：

- 保持录入轻量；
- 不让用户一打开就面对长表单；
- 次要信息不阻塞 Capture。

---

## 16. Source

`Source` 表示：

> 用户在哪里发现这条内容，或这条记录的来源名称。

示例：

- 豆瓣
- 小红书
- 某本书
- 某篇文章
- 朋友推荐
- Podcast
- 课堂
- 旅行现场

Source 是文本字段，不等同于 URL。

---

## 17. Link

`Link` 为可选 URL。

用于保存：

- 原文链接
- 豆瓣页面
- 官方网站
- Podcast 页面
- 视频页面
- 其他外部来源

Source 和 Link 分开保存。

---


## 18. Save 状态

### 18.1 Disabled

当以下任一条件未满足时：

- Title 为空
- Type 未选择
- Location 数量 = 0

Save disabled。

### 18.2 Enabled

当：

```text
Title
+
Type
+
至少一个 Location
```

全部存在时：

Save enabled。

---

## 19. Save 行为

用户点击 Save 后：

1. 验证必填字段；
2. 将 Entry 写入本地 SQLite；
3. 写入关联表：
   - EntryLocation
   - EntryTag
   - 其他已选择关系
4. 本地事务成功；
5. UI 立即显示保存成功；
6. 关闭 Add Entry；
7. 返回进入 Add 之前的页面。

未来云同步存在时：

8. 后台进入同步队列。

核心原则：

> **本地保存成功 = 用户保存成功。**

网络或云同步失败不能阻止本地 Capture。

---

## 20. 保存后的返回行为

### 从 Map 进入

保存后：

> 返回 Map。

尽量保持之前的：

- viewport
- zoom
- selected spatial state
- filter state

新 Entry 应可以根据其 Location 在后续地图聚合中被发现。

### 从 Library 进入

保存后：

> 返回 Library。

新 Entry 应出现在列表中，并遵循当前默认排序。

---

## 21. 保存成功反馈

反馈保持轻量。

可以使用：

- brief visual confirmation
- subtle haptic feedback

不需要：

- 大型成功页
- 长动画
- 强制进入 Entry Detail

---

## 22. 取消

### 22.1 未输入内容

如果表单没有有效修改：

点击 `取消`

→ 直接关闭。

### 22.2 已输入内容

如果已经输入或修改过内容：

点击 `取消`

→ 弹出确认。

示例：

```text
放弃这次编辑？

[继续编辑]
[放弃]
```

V1 不做完整 Draft 系统。

---

## 23. Draft

V1：

> 不实现复杂草稿管理。

不提供：

- Draft list
- 自动保存草稿中心
- 多草稿管理

未来如果真实使用中频繁发生中断，再考虑加入自动草稿。

---

## 24. 重复 Entry

V1 不做强制查重。

允许：

- 相同 Title
- 相同 Type
- 相同 Location

原因：

- 可能是不同版本；
- 可能是不同语境；
- 可能用户希望重复记录；
- Capture 不应被查重逻辑阻塞。

未来可以提供：

> 疑似重复提醒

但不能强制禁止。

---

## 25. 键盘行为

要求：

- 当前输入框不被系统键盘遮挡；
- Save 始终可合理触达；
- 多行 Note 输入舒适；
- 点击非输入区域时可自然关闭键盘；
- 进入 Location Picker 前应正确处理键盘状态。

---

## 26. Error Handling

### 26.1 Validation Error

例如：

- Title 为空
- 没有 Location

优先通过 Save disabled 避免提交。

### 26.2 Database Error

如果 SQLite 写入失败：

- 不关闭页面；
- 保留用户当前输入；
- 显示可理解的错误；
- 允许重试。

不能：

> 保存失败后把用户填写内容全部清空。

### 26.3 Future Sync Error

如果本地保存成功、云同步失败：

- Entry 仍视为保存成功；
- 不撤销本地数据；
- 可在后台显示未同步状态。

---

## 27. Accessibility

要求：

- Type icon 有 accessibility label；
- Save disabled 状态可被 VoiceOver 理解；
- Input 有明确 label；
- 不只依靠颜色表达必填 / 错误；
- 点击区域满足合理 touch target。

---

## 28. V1 非目标

本 Spec 不要求：

- AI 自动识别 Entry Type
- 自动抓取完整豆瓣 / IMDb Metadata
- 图片 OCR
- 自动生成 Note
- 自动 Tagging
- Polygon 绘制
- 完整 Draft Center
- 强制查重
- 复杂账号系统
- 云端优先保存

---

## 29. 核心验收场景

### 场景 A：最小保存

1. 用户从 Map 右上角点击 `+`；
2. 进入 Add Entry；
3. 输入 Title；
4. 选择 Type；
5. 添加一个 Location；
6. Save enabled；
7. 点击 Save；
8. SQLite 成功保存；
9. 返回 Map。

### 场景 B：Book 完整录入

用户输入：

```text
Title: 小王子
Type: Book
Location: France
Note: 小时候读的是童话，长大后再看，才发现它也在讨论告别、责任与远方。
Tags:
- #文学
- #想象力

更多信息:
Author: 韩江
Year: 2014
Source: 学校图书馆
Link: optional
```

所有选填字段都可以为空，但填写后应正确保存。

### 场景 C：多 Location

1. 用户添加 Movie；
2. 选择 Paris；
3. 再选择 Vienna；
4. 两个 Location 同时存在；
5. Save；
6. Entry 与两个 Location 建立显式关系。

### 场景 D：取消

1. 用户输入 Title；
2. 点击取消；
3. 系统询问是否放弃；
4. 选择继续编辑；
5. 内容仍保留。

### 场景 E：数据库失败

1. 用户填写完整 Entry；
2. 本地写入失败；
3. 页面不关闭；
4. 用户内容不丢失；
5. 可重试。

---

## 30. 核心规则总结

> **Add Entry 的第一目标是快速记录，不是录入完整数据库。**

> **必填只有 Title、Type、至少一个 Location。**

> **Note 直接展示，Metadata 渐进展开。**

> **Source 与 Link 分开；所有自由补充统一进入 Note。**

> **Place / Space 不使用固定 subtype，细分类交给 Tags。**

> **Save 先保证本地可靠持久化，未来再后台同步。**

> **V1 不让 Draft、查重、AI Metadata 等非核心能力增加 Capture 摩擦。**
