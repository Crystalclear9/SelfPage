# 站点素材

## 首页插画

两幅主视觉来自剧场版《路人女主的养成方法 Fine》，原图均为 1200 × 1232 像素。页面用 CSS 选取构图，「关于我」的圆形头像裁自第三版主视觉。

| 站内文件 | 原始素材 |
| --- | --- |
| [keyvisual-1.jpg](../public/images/keyvisual-1.jpg) | [第一版主视觉](https://saenai-movie.com/shared/img/top/visual_main_v1.jpg) |
| [keyvisual-3.jpg](../public/images/keyvisual-3.jpg) | [第三版主视觉](https://saenai-movie.com/shared/img/top/visual_main_v3.jpg) |

## 光标原画

[过膝袜版](../public/images/megumi-cursor.svg)与[短袜版](../public/images/megumi-cursor-short.svg)使用同人角色插画。过膝袜版的袜口参考第一季第三话坡道场景，窄缎带束住白色褶边。[镜头参考](https://www.anime-graffiti.com/wp-content/uploads/img/201501/20150130-s035.jpg)

每份 SVG 内嵌一张 192 × 204 的透明 WebP，以 64 × 68 CSS 像素显示。替换原画时保留透明边距，对齐指尖热点 (8, 12)，再检查眼帘、面颊与姿态旋转原点。两套素材同时用于首屏原生指针与运行时姿态。[光标交互与验证](MOTION.md#角色光标)

## 字体与图标

| 用途 | 来源与交付方式 |
| --- | --- |
| 拉丁字母与数字 | Outfit，由 @fontsource/outfit 本地提供，采用 SIL Open Font License |
| 中文正文 | 使用读者设备的系统字体 |
| 数学公式 | KaTeX 的样式与字体随构建一起发布 |
| 界面图标与 favicon | Phosphor，MIT 许可 |

## 首页语音

三段日语回应使用 MiniMax speech-2.8-hd 合成。角色参考来自 [Xperia Ear Duo 加藤恵角色语音介绍页](https://charactervoice.jp/s/smccv/page/xea20_kato)。首页提前缓冲本地音轨，点击时播放对应文件；再次点击头像可停止播放。

| 场景 | 文件 | 时长 | 情绪设置 |
| --- | --- | --- | --- |
| 点击头像 | `public/audio/megumi-response-greeting.flac` | 13.74 秒 | surprised |
| 点赞 | `public/audio/megumi-response-like.flac` | 10.54 秒 | happy |
| 取消点赞 | `public/audio/megumi-response-unlike.flac` | 14.91 秒 | sad |

### 录制参数与台词

语速 1.02，保持原音高，开启日语语言增强。停顿标记以秒计。导出前以 FFmpeg 的 `loudnorm=I=-20:TP=-3:LRA=11` 统一响度，保存为 44.1 kHz、16 bit、单声道 FLAC。

- **greeting**：えっ？<#0.2#>ねえ、さっきから私のほっぺ、つつきすぎじゃない？<#0.3#>ともやくん、いったいどこ見てるのかなぁ。<#0.5#>……まあ、別に、嫌とは言ってないけど。
- **like**：あ、ありがとう。<#0.25#>ともやくんが、いいって思ってくれたんだ。<#0.4#>そっか……。<#0.3#>うん。ちょっとだけ、うれしい、かも。
- **unlike**：あれ？<#0.2#>……取り消しちゃうんだ。<#0.5#>そっか。<#0.3#>気のせいかなぁ。私、また存在感、薄くなってない？<#0.4#>……ちゃんと、ここにいるんだけどな。

替换音轨时，在 [site.js](../src/data/site.js) 更新对应文件路径，再运行 `node tests/voice.mjs`。试听时依次点击头像、点赞、取消点赞，检查起音、停顿与音轨切换。

### 音轨配置与播放行为

点赞音轨存放在 `public/audio/`，`profile.likeVoice` 记录相对发布根目录的文件路径，例如 `audio/megumi-response-like.flac`。头像问候与取消点赞分别读取 `avatarVoice`、`unlikeVoice`。开发环境与 Pages 共用这组路径。

[useVoice](../src/lib/useVoice.js) 在挂载后安排缓冲，用户点击时由 [voice-player.js](../src/lib/voice-player.js) 调用浏览器的 `play()`。三个入口共享当前播放器，新操作会停止旧音轨并复位播放时间。首页组件卸载、浏览器触发 pagehide 或再次点击正在播放的头像时，播放器会停止。音轨验收覆盖连续操作和跨页停止：依次触发问候、点赞和取消点赞时，只播放当前操作对应的回应；播放期间进入详情页时，首页音轨停止。

## 正文附件

[K-GAT 配图](../public/files/k-gat)随论文正文发布，PDF 入口由内容索引提供。[教材配图](LEARNING-IMAGE-SOURCES.md)记录 AILearning 图像的导入路径、验证方法和历史署名。
