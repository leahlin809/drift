# MAP_DESIGN.md

# 地图设计规范

> 版本：v0.3｜平台校准：iPhone-first

## 1. 文档目的
本文件定义心愿地图的地图视觉、信息层级、交互规则和 Mapbox 使用边界。

地图是本产品最核心的视觉与交互界面。核心目标是：

> 地图应当简洁、安静、可漫游，并让用户自己的文化内容成为真正的视觉主角。

## 2. 地图在产品中的角色
地图承担三个作用：
- 空间浏览：通过国家、城市、地区进入自己的内容。
- 兴趣可视化：通过 Interest Layer、Tag、Topic 观察文化兴趣分布。
- 漫游体验：没有明确任务时，也可以随意浏览世界并重新发现过去保存的内容。

设计优先级：
> 视觉层级 > 留白 > 可读性 > 信息完整性

## 3. Basemap 基准
当前 Basemap 以 iPhone / iOS 为主要使用端，统一使用 Mapbox Studio Style：
- iOS / iPhone：`mapbox://styles/leahlinmap/cmtelajtw004t01sa2uhw35i8`
- Future Web：如后续开发，可继续复用同一 Basemap Style 或对应主题版本。

### 3.1 Mapbox Studio 负责
- 陆地、水域、海岸线
- 国家边界、一级行政区边界
- 国家名称、城市名称
- 道路
- 地图字体
- Basemap 的 Zoom Level 层级
- Basemap 整体视觉

### 3.2 App / Codex 负责
- Entry
- Spatial Sheet / Panel
- Location 选择
- Interest Layer
- Tag / Topic 空间分布
- Point Marker
- Custom Area / Polygon
- 地图点击事件
- 添加模式
- 业务数据筛选

### 3.3 核心技术原则
> 业务数据必须与 Mapbox 解耦。

以下数据必须保存在自己的数据层中：
- Entry
- Entry ↔ Location 关系
- Tag
- Topic
- Note
- Source
- 用户创建的 Point
- 用户创建的 Custom Area

## 4. Basemap 视觉原则
整体追求：
- minimal
- calm
- spacious
- editorial
- modern
- geographic clarity

### 陆地
- 低饱和浅色
- 不使用高对比、大面积强色

### 水域
- 与陆地区分清楚
- 使用低饱和蓝色或蓝灰色
- 避免鲜艳蓝色

### 国家边界
- 清晰但克制
- 线条细
- 强于一级行政区边界
- 避免粗黑边界

### 一级行政区边界
- 更细、更浅
- 只作为空间辅助
- 不成为主要视觉元素

### 文字
- 现代无衬线字体
- 不使用纯黑
- 不过度加粗
- 国家名称 > 主要城市 > 普通城市
- 宁可隐藏低优先级标签，也不要挤压间距

## 5. Label Density
核心规则：
> More zoom does not mean show everything.

Zoom 增加时，信息应该渐进释放，而不是突然出现大量行政区、道路和地名。

如果标签发生竞争：
1. 保留更重要的标签
2. 隐藏低优先级标签
3. 不允许文字重叠
4. 不通过极端缩小字体来塞入更多信息

建议：
- `text-allow-overlap: false`
- `text-ignore-placement: false`

## 6. Zoom Hierarchy

### Zoom 0–3：全球 / 大洲尺度
显示：
- 大陆
- 海洋
- 国家边界
- 主要国家名称

尽量不显示：
- 普通城市
- 一级行政区名称
- 道路
- POI
- Entry marker

### Zoom 4–5：国家尺度
显示：
- 国家名称
- 国家边界
- 主要水域
- 首都
- 极少量国家级核心城市

不显示：
- 大量普通城市
- 一级行政区名称
- 次级行政边界文字
- 普通道路
- Entry marker

### Zoom 6–7：区域尺度
显示：
- 国家名称
- 主要城市
- 区域中心城市
- 非常浅的一级行政区边界

默认仍不显示：
- 一级行政区名称
- 大量普通城市
- 次级行政边界
- 大量道路

### Zoom 8–9：城市群 / 地区尺度
逐步显示：
- 更多次级城市
- 区域城市
- 部分主要道路
- 更明确的城市空间关系

### Zoom 10+
逐步显示：
- 更多普通城市
- 主要道路
- 城市级地理信息
- 精确地点相关内容

## 7. 城市层级
建议：
- Rank 1：首都、全球城市、国家级核心城市
- Rank 2：区域中心城市、大型城市、重要省会 / 州级中心
- Rank 3：普通中大型城市
- Rank 4：小城市 / 城镇

建议显示：
- Zoom 4–5：Rank 1
- Zoom 6–7：Rank 1 + Rank 2
- Zoom 8–9：Rank 1 + Rank 2 + 部分 Rank 3
- Zoom 10+：逐步增加 Rank 4

## 8. 行政区标签规则
默认不鼓励显示大量一级行政区名称，例如：
- Province
- State
- Oblast
- Krai
- Republic
- Autonomous Region

行政区可以保留边界线，但不默认以强文字层级出现。

原则：
> Country label > Major city label > Administrative label

## 9. 特殊 Label 规则
当前 Mapbox Style 已处理：
- 隐藏台湾的 country-level label
- 隐藏香港的 country-level label
- 澳门保持当前显示逻辑
- 不修改相应 geometry
- 不修改普通城市与国家的整体 label hierarchy

相关规则优先使用稳定字段，例如 `iso_3166_1`，而不是依赖显示语言的 `name`。

## 10. Pure Map
Pure Map 是默认状态。

显示：
- 国家
- 主要城市
- 水域
- 必要行政边界

不默认显示：
- 大量 Entry marker
- 书籍图标
- 电影图标
- Topic 图标
- 密集用户标签

目标：
> 用户可以在没有任务时单纯漫游地图。

## 11. Spatial Selection
默认地图点击行为：
> 点击 = 查看

不是：
> 点击 = 添加

点击国家 / 城市 / 地区后：
1. 当前空间轻微高亮
2. 打开 Spatial Sheet / Panel
3. 展示该空间下关联的 Entry
4. 可继续进入 Entry Detail

高亮方式：
- 轻微增加填充强度
- 增加边界可见性
- 使用低饱和状态色

避免强烈霓虹色和高饱和填充。

## 12. Spatial Sheet / Panel
Spatial Sheet / Panel 是地图与内容之间的主要连接方式。

### iPhone
优先使用 Bottom Sheet：
- 点击国家 / 城市 / 地区后从底部自然上浮
- 地图保持在背景中并维持空间上下文
- 支持合理的展开层级，例如 peek / 半屏 / 更高展开
- 用户可以向下拖动关闭或收起
- 点击 Entry 后可继续进入 Entry Detail，但不应让地图上下文无意义地消失

### Future iPad / Web
如果未来提供更大屏客户端，可以根据可用空间使用 Side Panel。

原则：
> Spatial Sheet 是产品概念；Bottom Sheet / Side Panel 是不同屏幕上的具体呈现。

## 13. 添加模式
全局提供明确的 `+ 添加`。

### 默认浏览状态
地图点击：
> 查看空间

### 添加 Location 状态
用户主动选择“在地图上选择 Location”后，才进入选择模式。

状态反馈可包括：
- 顶部提示“请选择关联位置”
- 显示取消按钮
- 通过按钮状态、提示文字或轻量视觉反馈明确当前选择模式
- 不依赖 hover 或鼠标指针才能理解状态

此时点击地图：
> 选择 Location

选择完成后退出该状态。

## 14. iPhone 地图交互原则

地图交互优先围绕触摸设备设计：

- Tap：选择空间或触发明确操作
- Pan：拖动地图
- Pinch：缩放地图
- Drag：控制 Bottom Sheet
- 长按仅在确有必要时使用，不作为高频核心动作
- 不依赖 hover、右键或鼠标精细操作
- 重要控件必须避开 Safe Area，并考虑单手操作和拇指可达性
- 地图、Sheet、键盘同时出现时，应优先保证用户仍能理解当前上下文

---

## 15. Location 的地图呈现
Location 支持：
- country
- city
- region
- point
- custom_area

### Country / City / Region
作为空间容器使用，通常不额外增加业务 marker。

### Point
Point 可以保存精确经纬度。
建议：
- 全球尺度：隐藏
- 国家尺度：隐藏
- 区域尺度：通常隐藏
- 城市尺度：逐渐显示
- 街区尺度：完整显示

### Custom Area
由用户自己圈选的 Polygon / MultiPolygon。
推荐：
- 半透明低饱和填充
- 很淡的边缘线
- 必要时使用虚线
- 不模仿官方行政边界

表达的是：
> 我的空间理解

## 16. Point Marker
只用于确实有精确坐标的地点 / 空间 Entry。

原则：
- 样式简洁
- 数量多时避免全部同时显示
- 不使用过多不同图标
- 不让 marker 成为低 zoom 地图的视觉噪音

## 17. Interest Layer
Interest Layer 用于呈现整体兴趣分布。

优先使用 tonal shading：
- 无内容：正常底图
- 少量 Entry：极浅
- 中等：浅
- 较多：稍明显

原则：
- 同一低饱和色系
- 不做传统红黄绿高强度 heatmap
- 保持底图可读性

它回答：
> 我的兴趣主要集中在哪里？

## 18. Tag 空间分布
当用户选择某个 Tag，例如 `#博物馆`：
- 地图显示与该 Tag 相关的空间分布
- 可使用国家 / 城市 tonal shading
- 高 zoom 下显示 point marker
- 可显示数量摘要

## 19. Topic 空间分布
Topic 进入产品后，可以查看其关联 Location 的空间分布。

Topic 高亮应保持克制，不默认连接复杂网络线。

## 20. Entry 的地图显示原则
单条 Entry 默认不负责“点亮世界地图”。

原则：
> Entry 更适合阅读；Tag / Topic 更适合观察空间分布。

Entry 只有在以下情况下可以直接在地图上出现：
1. Entry 类型是地点 / 空间
2. 存在精确 Point
3. 当前 zoom 足够高

## 21. 地图 Mode 与 Mapbox Style 的区别

### Mapbox Style
表示底图视觉，例如未来可能有：
- Light
- Dark

当前已有一个主要 Basemap Style。

产品 UI 的 Appearance 以 Follow System 为默认目标：
- iOS Light → Light UI
- iOS Dark → Dark UI

地图的 Dark Basemap 在对应 Style 完成后再接入；不要通过运行时随意篡改既定 Studio 样式来伪造暗色模式。

### Product Mode
表示产品数据如何叠加，例如：
- Pure Map
- Interest Layer
- Tag Filter
- Topic Filter

这些 Mode 应使用：
> 同一个 Basemap + 不同业务图层

而不是为每个 Mode 创建新的 Mapbox Style。

## 22. 多 Style 支持
Mapbox 支持未来使用多个 Style URL，并通过 `setStyle()` 切换。

V1 不扩展 Retro / Satellite 等非必要主题。Light / Dark 只作为系统 Appearance 适配需求存在，并保持与 iOS 系统状态一致。

如果未来增加多 Style，业务图层必须在 `style.load` 后重新挂载。

## 23. Mapbox 与业务图层边界

```text
Mapbox Studio
↓
Basemap

App
↓
Product Layers
├── Selection Layer
├── Interest Layer
├── Tag Layer
├── Topic Layer
├── Point Marker Layer
└── Custom Area Layer
```

业务图层必须集中管理，不要散落在多个组件中重复实现。

## 24. Codex 地图开发约束
所有地图相关开发必须遵循：

1. 使用既定 Mapbox Style URL。
2. 不重新生成 Basemap。
3. 不擅自修改 Studio 已确认的视觉规则。
4. 地图业务数据与 Mapbox 解耦。
5. 修改地图前先识别相关 source / layer / event。
6. 不在一个任务里同时大规模修改 Basemap、业务数据和 UI。
7. 新增 Layer 时明确其 source、minzoom、maxzoom、visibility、priority。
8. 地图点击默认用于查看。
9. 添加操作必须有显式状态。
10. 不允许大量 Entry 默认覆盖地图。
11. 所有新地图功能都必须检查 label density、collision、zoom behavior、iPhone 真机体验，以及未来大屏客户端的一致性。
12. 如果需要改变现有 Mapbox Style，先提出方案，不自动修改。

## 25. 地图设计验收标准
地图设计达到要求时，应满足：

- 世界尺度保持简洁。
- 放大后不会突然出现大量行政区名称。
- 国家、城市、行政边界层级清楚。
- 地图文字不拥挤、不重叠。
- Pure Map 本身具有足够漫游感。
- 点击空间后能自然进入内容。
- 用户数据不会淹没 basemap。
- Point marker 只在合适 zoom level 出现。
- Interest Layer 保持低饱和、低干扰。
- Tag / Topic 能形成空间分布，但不会破坏地图美感。
- 用户可以清楚感受到：
  > 这是属于我的世界地图。
