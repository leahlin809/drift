# SPEC_LOCATION_PICKER.md

> 版本：v0.2  
> 平台：iPhone-first  
> 状态：V1 功能规格  
> 关联文档：
> - `PRODUCT.md`
> - `DATA_MODEL.md`
> - `DESIGN.md`
> - `MAP_DESIGN.md`
> - `ARCHITECTURE.md`
> - `SPEC_ADD_ENTRY.md`
> - `SPEC_MAP_BROWSE.md`

---

## 1. 功能目的

`Location Picker` 用于帮助用户为 Entry 选择一个或多个空间关联位置。

Location 是本产品的核心结构之一。

它不是简单的“地址字段”，而是决定：

> 这条 Entry 将来可以在地图的哪些空间层级被重新发现。

V1 的核心目标是：

- 支持快速选择 Country / Region / City / Point；
- 支持一个 Entry 绑定多个 Location；
- 支持任意 Point；
- 支持 Location 向上继承；
- 保持 Search 轻量；
- 不把 Location Picker 做成复杂 GIS 工具。

---

## 2. 入口

Location Picker 从 Add Entry 中进入。

例如：

```text
位置
Paris ×
Vienna ×
+ 添加位置
```

点击：

`+ 添加位置`

进入 Location Picker。

未来其他场景也可复用该 Picker，例如：

- 编辑 Entry
- Topic 绑定 Location
- 自定义空间组织

但 V1 主要服务于 Add Entry / Edit Entry。

---

## 3. 页面结构

推荐结构：

```text
取消              选择位置              完成

[ 搜索国家、城市或地点…… ]

────────────────────────

              MAP

────────────────────────

已选择
Paris ×
Vienna ×
```

主要区域：

1. Navigation Header
2. 轻量 Search
3. Map
4. 当前选择反馈
5. 已选择 Location 列表

---

## 4. 核心原则

### 4.1 Browse / Map-first

Location Picker 的主要能力是：

> 地图浏览 + 点击选择

Search 只是辅助。

用户应该可以完全不使用 Search，仅通过：

- drag
- zoom
- tap

完成 Location 选择。

### 4.2 Search 不做重

V1 不需要像 Google Maps 一样建立强地点搜索体验。

Search 只解决：

> “我知道大概去哪，帮我快速移动到那个地方。”

---

## 5. 支持的 Location 类型

V1 支持：

- Country
- Region
- City
- Point

数据模型保留：

- Custom Area / Polygon

但 V1 不实现 Polygon 绘制。

---

## 6. Location 不是并列结构

Country / Region / City / Point 存在层级关系。

典型情况：

```text
Point
→ City
→ Region
→ Country
```

但并非所有国家都拥有完全一致的行政层级。

系统应使用：

> 可解析的空间 ancestry

而不是假设所有地点都严格拥有四级结构。

---

## 7. Explicit Location 与 Ancestors

用户真正选中的 Location：

> Explicit Location

系统自动解析出的上级空间：

> Derived Ancestors

例如用户选择：

```text
Montparnasse Cemetery · Point
```

系统可能解析：

```text
Point:
Montparnasse Cemetery

City:
Paris

Region:
Île-de-France

Country:
France
```

用户无需重复勾选所有上级 Location。

---

## 8. 向上继承

选择较低层级 Location 后：

> 自动继承所有可解析上级空间。

例如：

```text
Point
→ City
→ Region
→ Country
```

用于后续：

- Map Browse
- Interest Layer
- Entry count
- Spatial Sheet
- Tag / Topic spatial distribution

---

## 9. 不向下推断

如果用户选择：

```text
France · Country
```

系统不能推断：

- Paris
- Île-de-France
- 某个 Point

即：

```text
Country
↛ Region
↛ City
↛ Point
```

---

## 10. 地图点选

用户可以在地图任意位置点击。

点击后：

1. 系统读取坐标；
2. 尝试解析附近 POI；
3. 尝试解析 City；
4. 尝试解析 Region；
5. 尝试解析 Country；
6. 弹出轻量确认 Sheet / Card。

地图点击不能立即直接保存。

---

## 11. 点击后的候选卡片

示例：

```text
你选择了这里

[ Point ]
Montparnasse Cemetery
Paris, France

[ City ]
Paris
France

[ Region ]
Île-de-France
France

[ Country ]
France
```

用户自己选择：

> 想把 Entry 绑定到多精确的空间层级。

---

## 12. Point 可以是任意位置

Point 不要求必须对应已有 POI。

用户可以在地图任意位置创建 Point，例如：

- 电影取景街角
- 一段街道
- 山坡
- 历史事件发生的大致位置
- 用户自己的文化记忆点
- 不存在正式地点名称的位置

这是 V1 明确支持的能力。

---

## 13. Point 名称

Point 内部保存：

- latitude
- longitude

但用户默认不需要看到经纬度。

UI 主要展示：

> Point Display Name

### 13.1 命名优先级

如果存在可用 POI：

> 使用 POI 名作为建议名称。

如果没有：

> 使用附近地名作为建议名称。

如果仍无法识别：

> 使用临时通用名称，并允许用户编辑。

例如：

```text
自定义地点
```

或：

```text
Paris 附近
```

坐标只作为内部数据。

---

## 14. Point 名称可编辑

用户选择 Point 后，可以编辑显示名称。

例如：

系统建议：

```text
Rue X
```

用户改成：

```text
《花样年华》取景街角
```

名称修改不会改变经纬度。

---

## 15. Search

顶部提供轻量 Search。

可以搜索：

- Country
- Region
- City
- 已知 POI / Place

示例：

```text
France
Paris
Hokkaido
Suzhou
Montparnasse Cemetery
```

Search 的主要作用：

> 快速移动地图到目标区域。

---

## 16. Search Results

结果应尽量显示：

- Name
- Type
- Parent Location

例如：

```text
Paris
City · France

Île-de-France
Region · France

Montparnasse Cemetery
Point · Paris, France
```

用户需要知道自己选的是：

- Country
- Region
- City
- Point

而不是只有一个同名字符串。

---

## 17. Search 结果选择

点击搜索结果后：

- 地图移动到对应位置；
- 可直接进入确认；
- 或显示该 Location 详情后再选择。

最终实现可根据技术可行性微调。

但不能让用户搜索 `Paris` 后，在不知道类型的情况下直接绑定错误空间。

---

## 18. Search 与 Map Tap 的关系

两者都是 Location Picker 的入口。

```text
Search
      ↘
       Location Candidate
      ↗
Map Tap
```

最终都应进入统一的：

> Location Confirmation

避免建立两套不同数据逻辑。

---

## 19. 多 Location

一个 Entry 支持：

> 1 个或多个 Explicit Location。

选完一个 Location 后：

- Picker 不自动关闭；
- 用户可以继续 Search；
- 用户可以继续 Map Tap；
- 用户可以继续添加第二个、第三个 Location。

例如：

```text
已选择 2 个

Paris ×
Vienna ×
```

最后点击：

`完成`

返回 Add Entry。

---

## 20. Location 删除

已选择 Location 可直接删除。

推荐：

```text
Paris ×
```

或：

```text
Paris                         ×
City · France
```

点击 `×`：

> 移除该 Explicit Location。

V1 不需要为这个操作增加：

- Swipe delete
- Context menu
- 长按菜单

---

## 21. 重复 Location

完全相同的 Explicit Location：

> 不允许重复添加。

例如：

已经选择：

```text
Paris · City
```

再次选择同一个 Paris：

- 不新增第二条；
- 给轻量提示即可。

---

## 22. 不同层级可以同时显式绑定

以下情况允许：

```text
Montparnasse Cemetery · Point
Paris · City
```

因为用户可能确实想表达：

- 与这个具体 Point 有关；
- 同时又与 Paris 整体有关。

系统应保留两个 Explicit Location。

---

## 23. 聚合时必须去重

虽然 Explicit Location 可以重叠，但后续聚合必须：

> 按 Entry ID 去重。

例如：

```text
Entry A
Explicit:
- Point in Paris
- Paris · City
```

Point 已经向上继承到 Paris。

那么 Paris 统计：

```text
Entry A = 1
```

不能算两次。

该规则由 `SPEC_MAP_BROWSE.md` 统一执行。

---

## 24. 已选 Location 的展示

在 Picker 底部显示：

> 已选择

展示方式优先：

- compact rows
- 或 chips

如果 Location 名较长，推荐 row。

例如：

```text
Montparnasse Cemetery     ×
Point · Paris, France

Paris                     ×
City · France
```

---

## 25. 已选 Location 排序

V1 默认：

> 按选择顺序。

暂不自动按：

- Country → Region → City → Point
- 经纬度
- 字母排序

原因：

> 用户选择顺序本身可能代表记录时的思考顺序。

未来如有需要可再增加整理能力。

---

## 26. 完成按钮

右上角：

> 完成

如果已经选择至少一个 Location：

- enabled

如果当前是从一个“必须有 Location”的 Add Entry 流程进入，但用户一个都没有选择：

- 可以允许返回原表单；
- 但 Add Entry 最终 Save 仍 disabled。

Location Picker 本身不必强迫完成选择。

---

## 27. Cancel

点击：

> 取消

如果本次没有新增 / 删除 / 修改：

- 直接返回。

如果本次有未确认变更：

- 可询问是否放弃；
- 或在 Picker 内部使用临时 selection state，只有点“完成”才提交回 Add Entry。

V1 推荐：

> 临时 state + Done commit

这样 Cancel 可以自然撤销本轮 Location Picker 变更。

---

## 28. Location Picker 与键盘

Search 激活键盘时：

- 用户开始 drag map → 键盘可以自然关闭；
- 点击地图 → 键盘关闭；
- 进入 candidate card 时不应让键盘持续遮挡地图；
- Search 内容保留即可。

---

## 29. 地图视觉

Location Picker 使用与主 Map 相同的 Basemap。

但进入选择模式时，可以加入轻量选择状态提示。

例如：

```text
选择位置
```

或：

```text
点击地图选择空间
```

避免用户混淆：

> 当前是在 Browse Map，还是在选 Location。

---

## 30. Point Tap 反馈

用户点击地图后：

- 当前 tap coordinate 可显示一个临时 pin；
- 该 pin 仅代表候选点；
- 未确认前不是正式 Location；
- 重新 tap 可以移动候选点；
- 确认后才写入 selected locations。

---

## 31. 候选层级顺序

点击地图后，候选可以按：

1. Point
2. City
3. Region
4. Country

从具体到宏观排列。

原因：

> 用户刚刚做的是一个精确 tap，先展示最具体选择更自然。

但所有可解析层级都应清晰显示。

---

## 32. 候选层级缺失

某些地点可能没有：

- Region
- City
- POI

系统只显示可解析出的层级。

例如：

```text
Point
Country
```

也可以正常选择。

不要为了填满四级结构而伪造不存在的空间层级。

---

## 33. POI 与 Point 的关系

POI 只是：

> Point 命名和识别的一种辅助来源。

Point 本身仍是产品自己的 Location 类型。

不要让数据结构依赖某个第三方 POI ID 作为唯一身份。

---

## 34. 数据存储

Point 至少需要保存：

- id
- type = point
- display_name
- latitude
- longitude
- ancestor references / stable geography identifiers
- created_at
- updated_at

Country / Region / City 应尽量保存：

- stable identifier
- display name
- locale-aware names（如果后续需要）
- parent / ancestry references

具体 schema 以 `DATA_MODEL.md` 与 `ARCHITECTURE.md` 为准。

---

## 35. 本地化

Location 的 UI 文案：

- zh-CN
- en

跟随系统。

Location Display Name 的语言策略应尽量与 Map locale 一致。

但 Location 的稳定 ID：

> 不能依赖当前语言字符串。

例如不要把：

```text
"France"
```

本身作为唯一主键。

---

## 36. Polygon / Custom Area

数据模型保留：

> custom_area

但 V1 Location Picker：

> 不提供 Polygon 绘制。

原因：

- 绘制模式复杂；
- 需要 vertex editing；
- 需要完成 / 撤销 / 删除节点；
- 会明显增加开发和测试成本。

后续可以单独设计：

`SPEC_CUSTOM_AREA.md`

---

## 37. V1 非目标

不做：

- Polygon drawing
- GIS measurement
- route drawing
- bulk geocoding
- 复杂地址编辑器
- 地理坐标手动输入
- 经纬度专业 UI
- 大型 POI 搜索系统
- Google Maps 式地点详情页
- 导航 / 路线规划

---

## 38. 核心验收场景

### 场景 A：选择 City

1. Add Entry → 添加位置；
2. 打开 Location Picker；
3. Search `Suzhou`；
4. 结果显示：
   - Suzhou
   - City · China
5. 选择；
6. 已选择列表出现 Suzhou；
7. Done；
8. 返回 Add Entry。

### 场景 B：任意 Point

1. 用户拖动地图到 Paris；
2. 点击一处没有正式 POI 的街角；
3. 地图显示临时候选 pin；
4. 系统尝试解析：
   - Point
   - Paris
   - Île-de-France
   - France
5. 用户选择 Point；
6. 用户将名称改为：
   `某电影取景街角`
7. Point 保存经纬度；
8. City / Region / Country 作为 ancestors 记录。

### 场景 C：选择 Country

1. 用户 Search `France`；
2. 选择 France · Country；
3. 系统只建立 France Explicit Location；
4. 不推断 Paris 或任何下级空间。

### 场景 D：多 Location

1. 用户已选择 Paris；
2. 继续 Search Vienna；
3. 再加入 Vienna；
4. 已选择列表显示两项；
5. Done；
6. Add Entry 中显示两个 Location。

### 场景 E：重复 Location

1. 已经选择 Paris · City；
2. 再次选择同一个 Paris；
3. 系统不新增重复项；
4. 给轻量提示。

### 场景 F：Point + City 显式重叠

1. 用户选择一个 Paris Point；
2. 再显式选择 Paris · City；
3. 两条 Explicit Location 都允许保留；
4. 后续 Map 聚合时，该 Entry 在 Paris 只计一次。

### 场景 G：Cancel

1. 用户进入 Picker；
2. 添加 Vienna；
3. 点击 Cancel；
4. 本轮临时变更不提交；
5. 返回 Add Entry 后保持进入 Picker 前的 Location 状态。

---

## 39. 核心规则总结

> **Location Picker 的核心是地图点选，不是地点搜索。**

> **Search 只作为辅助定位能力存在。**

> **Country / Region / City / Point 是空间层级，不是互不相关的并列枚举。**

> **低层级 Location 自动向上继承，上级 Location 不向下推断。**

> **Point 可以是地图上的任意位置，不要求已有 POI。**

> **用户不需要手动输入经纬度。**

> **一个 Entry 可以拥有多个 Explicit Location。**

> **显式 Location 可以存在空间重叠，但后续聚合必须按 Entry ID 去重。**

> **V1 不做 Polygon，以保证核心 Location 体验先稳定。**
