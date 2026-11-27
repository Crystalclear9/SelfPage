# 素材来源

Vite 构建时将 `public/` 中的文件按原路径复制到 `dist/`，包括页面未引用的文件。新增素材时，将正式使用的版本放入对应子目录，并在本页登记来源；用于比选的草稿和临时参考文件可放在发布目录之外。

## 首页插画

首页主视觉与头像来自[剧场版《冴えない彼女の育てかた Fine》官方网站](https://saenai-movie.com/)。两份原图均为 1200 × 1232 像素，首页通过 CSS 裁切构图。「关于我」的圆形头像使用第三版主视觉。头像取景与互动样式集中在 [avatar.css](../src/styles/avatar.css)，调整裁切位置时可直接核对现有原图。

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

三段日语回应使用 MiniMax speech-2.8-hd 合成。角色参考来自 [Xperia Ear Duo 加藤恵角色语音介绍页](https://charactervoice.jp/s/smccv/page/xea20_kato)。点击时创建并播放对应的本地音轨；再次点击头像可停止播放。

| 场景 | 文件 | 时长 | 情绪设置 |
| --- | --- | --- | --- |
| 点击头像 | `public/audio/megumi-response-greeting.flac` | 13.74 秒 | surprised |
| 点赞 | `public/audio/megumi-response-like.flac` | 10.54 秒 | happy |
| 取消点赞 | `public/audio/megumi-response-unlike.flac` | 14.91 秒 | sad |

### 合成与导出参数

语速 1.02，保持原音高，开启日语语言增强。停顿标记以秒计。导出前以 FFmpeg 的 `loudnorm=I=-20:TP=-3:LRA=11` 统一响度，保存为 44.1 kHz、16 bit、单声道 FLAC。

- **greeting**：えっ？<#0.2#>ねえ、さっきから私のほっぺ、つつきすぎじゃない？<#0.3#>ともやくん、いったいどこ見てるのかなぁ。<#0.5#>……まあ、別に、嫌とは言ってないけど。
- **like**：あ、ありがとう。<#0.25#>ともやくんが、いいって思ってくれたんだ。<#0.4#>そっか……。<#0.3#>うん。ちょっとだけ、うれしい、かも。
- **unlike**：あれ？<#0.2#>……取り消しちゃうんだ。<#0.5#>そっか。<#0.3#>気のせいかなぁ。私、また存在感、薄くなってない？<#0.4#>……ちゃんと、ここにいるんだけどな。

### 音轨配置与播放行为

音轨存放在 `public/audio/`。[profile](../src/data/site.js) 中的 `avatarVoice`、`likeVoice`、`unlikeVoice` 分别对应问候、点赞与取消点赞。字段值使用发布根目录下的相对路径，例如 `audio/megumi-response-like.flac`。

[useVoice](../src/lib/useVoice.js) 管理播放状态，点击事件交由 [voice-player.js](../src/lib/voice-player.js) 播放。新音轨接管时，上一段暂停并回到起点；组件卸载或触发 `pagehide` 时停止播放。`node tests/voice.mjs` 检验播放、取消与重试逻辑。更换录音后，依次触发三个入口可试听音量和切换效果。

## 正文附件

[K-GAT 配图](../public/files/k-gat)随论文正文发布，PDF 入口由内容索引提供。[教材配图](LEARNING-IMAGE-SOURCES.md)记录 AILearning 图像的导入路径、验证方法和历史署名。
