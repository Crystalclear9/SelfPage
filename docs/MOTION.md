# 导航与动效

## 首页滚动

[ChapterMotion](../src/components/ChapterMotion.jsx) 使用 IntersectionObserver 控制首页分区入场。观察区从视口顶部向内收 70px、底部向内收 8%。元素进入观察区并达到 12% 可见面积时显示，完全离开后重新记录进入方向。刷新或历史返回时，已经处于阅读位置的元素直接显示；键盘焦点进入隐藏元素时也会触发显示。

| 区域 | 滚动时的表现 | 调整时关注 |
| --- | --- | --- |
| 项目介绍 | 标题、简介和筛选器一起入场。宽屏时停在距顶部 138px 的位置 | sticky 的作用范围是项目区；窄屏使用上下排布 |
| 项目卡片 | 卡片在视口两端反向倾转，中央 38% 至 62% 保持正面 | 宽屏最大倾角 36°、间距 16px；窄屏为 26°、12px |
| 文章与论文入口 | 进入可读区域后保持可见，指针离开后收起局部光晕 | 宽屏从项目列表末尾到文章标题约 320px，距离由链接高度与相邻分区间距共同决定 |
| 页尾联系面板 | 根据指针在面板中的相对位置倾斜，离开后回正 | `.contact-inner` 提供稳定的命中区域，`.contact-panel` 承担视觉变换 |

分区入场由交叉观察器触发，卡片倾角则连续跟随 CSS 滚动时间线。项目筛选替换卡片节点后，MutationObserver 将新增节点加入观察集合，并移除已经卸载的节点。

## 导航与返回

站内链接打开独立 HTML。项目标题通过跨文档 View Transitions 在首页卡片与详情之间移动，教材的前后章链接按章节顺序选择方向。首页在文档 head 中区分收藏直达、从详情返回、刷新和历史遍历：外部收藏进入首屏，详情页链接按分区定位，刷新交给浏览器恢复滚动位置。刷新期间暂时采用即时滚动，正文直接回到阅读位置。[首页入口逻辑](../src/lib/home-entry.js)

## 角色光标

光标由首屏样式、衣装选择和运行时姿态三部分组成。两套衣装的显示尺寸均为 64 × 68 CSS 像素，使用 192 × 204 原画，热点位于指尖 `(8, 12)`。[素材规格与来源](ASSETS.md)

1. [Vite 配置](../vite.config.js)在构建时将两份光标素材嵌入文档 head。浏览器解析首屏样式时即可绘制原生角色指针。
2. [cursor-entry.js](../src/lib/cursor-entry.js) 按站点前缀在 sessionStorage 中记录衣装。首次访问随机选择，刷新时重新随机选定，站内导航沿用当前值。从浏览器历史缓存恢复页面时，`pageshow` 重新读取衣装。
3. [AnimatedCursor](../src/components/AnimatedCursor.jsx)接入指针事件并显示动作。移动坐标平时保存在内存，离开文档才记录时间、来源地址和视口尺寸。返回或刷新时读取 30 秒内、来源与尺寸相符的记录，用于还原静止位置。

| 操作 | 视觉反馈 |
| --- | --- |
| 普通移动、悬停 | 人物跟随指尖，交互目标提供自己的悬停反馈。头像下方的 GitHub 链接以图标和文字回应，背景保持透明。 |
| 上滚、下滚 | 箭头提示方向，人物绕指尖偏转约 5°，停滚约 260ms 回正。 |
| 拖动 | 姿态轻微倾斜，释放后回正，热点保持在指尖。 |
| 全站左键单击 | 光圈以视口中的落点为圆心扩散 650 毫秒。卡片和弹窗共用顶层元素。拖选、触屏和减少动态效果模式跳过光圈。 |
| 点击头像或喜欢 | 入口播放对应语音；角色通过眼帘和面颊的小幅变化回应。 |
| 减少动态效果 | 保留相同衣装的原生高清指针，页面采用静态阅读布局。 |

## 分类切换与返回栏实现

**项目筛选。** [useProjectFilter.js](../src/lib/useProjectFilter.js) 持有分类值和网格引用。切换开始时先淡出旧列表；若网格起点已经滚过视口，就把它移回顶部下方 100px，再同步提交新分类。这样从较长列表切换到短列表时，浏览器能按新内容定位。连续点击不同分类会取消前一次动画，只有最后一次请求提交结果。

**浮动返回栏。** [PageNavigation.jsx](../src/components/PageNavigation.jsx) 为页首和浮层复用一组链接。原栏滚过站点页头后，上滚显示浮层，下滚收起。组件用 4px 的方向阈值过滤触控板细微位移，浮层顶部位于站点页头下沿 10px 处。键盘焦点进入浮层后保持可见，Tab 移出时重新计算。两栏的文案和目标地址均来自组件收到的 section 和 sectionHref。

## 翻页异常恢复

Vite 将 `src/lib/transition-guard.js` 内联到文档 head。过渡准备失败或等待超过 1.8 秒时，脚本调用 `skipTransition()` 释放快照，继续显示已经加载的正文。历史缓存恢复时清理旧的出站过渡。`check:recovery` 覆盖正常过渡、挂起恢复以及阻断应用脚本后的页面显示。

## 修改动效时的定位表

| 要调整的行为 | 主要位置 | 同时检查 |
| --- | --- | --- |
| 首屏插画与章节展开 | `styles/chapters.css`、`styles/motion.css` | 首次打开、短屏、减少动态效果 |
| 项目卡片翻转幅度与间距 | `styles/motion.css` | 上下两个方向、倾转后的卡片边缘、窄屏溢出 |
| 左侧项目介绍停留位置 | `styles/motion.css` 中的宽屏媒体查询 | 页眉遮挡、项目区结束、筛选后列表缩短 |
| 模块和项目标题组浮现 | `components/ChapterMotion.jsx`、`styles/chapters.css` | 多次上下往返、鼠标筛选后重入、区内固定、键盘焦点 |
| 分类切换 | `lib/useProjectFilter.js` | 快速交替选择、重复选择当前项、减少动态效果 |
| 表面光晕与倾转 | `components/PointerSurfaces.jsx`、`styles/pointer.css`、`styles/content.css` | 指针移出、滚动、切换窗口后是否清理 |
| 角色动作和操作提示 | `components/AnimatedCursor.jsx` | 原热点、弹窗上层、实际操作结果和键盘切换 |
| 弹窗进入与焦点恢复 | `components/Modal.jsx`、`styles/motion.css` | Escape、关闭按钮、关闭后页面位置 |
| 悬浮返回与回到顶部 | `components/PageNavigation.jsx`、`components/ScrollToTop.jsx` | 上滑显示、下滑隐藏、焦点可达性和页脚互斥 |
| 翻页方向与快照 | `lib/navigation.js`、`styles/navigation.css` | 前后项目、返回主页、浏览器历史遍历 |

表中路径相对 `src/`。

## 验证入口

在生产预览上运行 `npm run check:chapters` 检查分区重复入场，`npm run check:navigation` 检查翻页与卡片角度，`npm run check:projects` 检查筛选和项目操作。光标的刷新与历史恢复由 `node tests/cursor-refresh.mjs` 覆盖，姿态与减少动态效果由 `npm run check:motion` 覆盖。[预览环境与测试命令](DEVELOPMENT.md)
