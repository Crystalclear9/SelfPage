# 素材来源

## 当前展示的图片

首页主视觉与头像来自[剧场版《冴えない彼女の育てかた Fine》官方网站](https://saenai-movie.com/)。主视觉与头像使用以下官方原图。

| 文件 | 原始分辨率 | 原地址 |
| --- | --- | --- |
| `public/images/keyvisual-1.jpg` | 1200 × 1232 | https://saenai-movie.com/shared/img/top/visual_main_v1.jpg |
| `public/images/keyvisual-3.jpg` | 1200 × 1232 | https://saenai-movie.com/shared/img/top/visual_main_v3.jpg |

原图保留原有像素。页面使用 CSS 裁切与缩放进行构图，未进行 AI 放大。角色与插画版权属于原作者及各权利方，插画仅作为个人主页的视觉点缀，与作品官方无关联。

## 字体与图标

- Outfit：`@fontsource/outfit`，随包字体许可（SIL Open Font License），本地托管。
- 中文字体：设备系统字体。
- Phosphor：`@phosphor-icons/react`，MIT 许可，图标与 favicon 均来自该库。

头像使用 `keyvisual-3.jpg`，通过 CSS 居中裁切。

## 角色鼠标光标

`public/images/megumi-cursor.svg` 内嵌由内置 imagegen 生成的透明 PNG，SVG 仅定义 64 × 68 的光标显示尺寸，保留原始透明度。属于加藤惠同人角色素材，并非官方插画。原生 CSS cursor 的热点为 `(8, 12)`，对应伸出的指尖；移动端不启用。

生成提示词：

> Create a single transparent-background mouse cursor sprite: Megumi Kato from Saekano, recognizable short chestnut bob haircut, white beret, red cardigan over white dress. Cute compact chibi full body, crisp pixel-art-like clean anime silhouette legible at 48x64 pixels. She leans diagonally and extends her left arm toward upper left with ONE index fingertip at the extreme upper left of the silhouette as the precise cursor click hotspot. Entire character visible, shoes included. Tight crop, transparent margins minimal. No arrow, no conventional mouse cursor, no circle, no badge, no background, no text, no shadow backdrop, no other characters. Clean defined outlines, restrained shading, white clothing opaque, genuine transparent alpha outside silhouette. Output single isolated character asset for UI use.

## 文章与论文附件

正文图片与 PDF 统一放在 `public/files/`。文件名应稳定，并在文章中记录必要的来源信息；已发布链接依赖该路径。此目录当前不包含附件。
