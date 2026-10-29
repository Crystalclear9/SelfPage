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
- KaTeX：学习资料中的数学排版与字体，来自 `katex` 包，随包许可，本地托管；公式在构建时生成。
- Phosphor：`@phosphor-icons/react`，MIT 许可，图标与 favicon 均来自该库。

头像使用 `keyvisual-3.jpg`，通过 CSS 居中裁切。

## 角色鼠标光标

`public/images/megumi-cursor.svg` 内嵌由内置 imagegen 生成的透明 PNG，SVG 仅定义 64 × 68 的光标显示尺寸，保留原始透明度。属于加藤惠同人角色素材，并非官方插画。原生 CSS cursor 的热点为 `(8, 12)`，对应伸出的指尖；移动端不启用。

生成提示词：

> Create a single transparent-background mouse cursor sprite: Megumi Kato from Saekano, recognizable short chestnut bob haircut, white beret, red cardigan over white dress. Cute compact chibi full body, crisp pixel-art-like clean anime silhouette legible at 48x64 pixels. She leans diagonally and extends her left arm toward upper left with ONE index fingertip at the extreme upper left of the silhouette as the precise cursor click hotspot. Entire character visible, shoes included. Tight crop, transparent margins minimal. No arrow, no conventional mouse cursor, no circle, no badge, no background, no text, no shadow backdrop, no other characters. Clean defined outlines, restrained shading, white clothing opaque, genuine transparent alpha outside silhouette. Output single isolated character asset for UI use.

## 文章与论文附件

正文图片与 PDF 统一放在 `public/files/`。当前 `k-gat/` 保存论文图示，`ailearning/` 保存教材图解、动画及许可文件；论文 PDF 使用外部阅读链接。文件名应稳定，并在文章中记录必要的来源信息；已发布链接依赖该路径。

## 首页角色语音

当前三段为 MiniMax `speech-2.8-hd` 根据角色参考音频生成的日语合成回应，不是官方台词或声优新录音。参考素材来自 [Xperia Ear Duo 加藤恵角色语音介绍页](https://charactervoice.jp/s/smccv/page/xea20_kato)。角色和参考录音权利属于原权利方。

| 场景 | 文件 | 时长 | 情绪设置 |
| --- | --- | --- | --- |
| 点击头像 | `public/audio/megumi-response-greeting.flac` | 13.74 秒 | surprised |
| 点赞 | `public/audio/megumi-response-like.flac` | 10.54 秒 | happy |
| 取消点赞 | `public/audio/megumi-response-unlike.flac` | 14.91 秒 | sad |

语速 1.02，音高不偏移，日语语言增强。使用 FFmpeg `loudnorm=I=-20:TP=-3:LRA=11` 统一响度，输出 44.1 kHz / 16 bit 单声道 FLAC。以下台词中的停顿标记仅用于生成，不朗读：

- **greeting**：えっ？<#0.2#>ねえ、さっきから私のほっぺ、つつきすぎじゃない？<#0.3#>ともやくん、いったいどこ見てるのかなぁ。<#0.5#>……まあ、別に、嫌とは言ってないけど。
- **like**：あ、ありがとう。<#0.25#>ともやくんが、いいって思ってくれたんだ。<#0.4#>そっか……。<#0.3#>うん。ちょっとだけ、うれしい、かも。
- **unlike**：あれ？<#0.2#>……取り消しちゃうんだ。<#0.5#>そっか。<#0.3#>気のせいかなぁ。私、また存在感、薄くなってない？<#0.4#>……ちゃんと、ここにいるんだけどな。

浏览器只在点击时加载静态音频，各入口互斥播放，再次点击头像可停止。合成服务不接入前端，不保存 API 密钥、上传文件 ID 或复刻音色 ID。旧录音、未采用的试听版本及旧下载处理脚本已移除；重新制作时应先试听，再使用新文件名更新 `profile` 路径，避免缓存旧音频。

## AILearning 配图

`public/files/ailearning/` 保存教材仓库中的图解与动画，未改变图像内容。原作者、外部图的许可及来源见 `docs/LEARNING-IMAGE-SOURCES.md`；对应许可文件随图片发布。导入清单记录来源版本，图片使用本站路径加载，不依赖第三方图床。
