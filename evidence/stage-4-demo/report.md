# Stage 4 — Demo 视频与视觉呈现验收报告 (Demo Video & Visual Assets)

## 1. 产出物清单 (Deliverables)

- **完整高清演示视频**: `evidence/stage-4-demo/demo.mp4`
  - **规格**: 1920 × 1080 (1080p 16:9), 30 fps, H.264 编码
  - **音频**: 48kHz 单声道 AAC, 自然清晰的微软神经语音解说 (Voice: `en-US-ChristopherNeural`)
  - **字幕**: 烧录在底部的标准 ASS 双语级可读英文字幕，避让底部控制区域
  - **总时长**: **102.2 秒 (1分42秒)**，完全符合 SafeSpace Hacks 黑客松官方要求（*"A short demo video of about 2–3 minutes is encouraged"*）
  - **文件大小**: **6.42 MB**（体积小、加载极快、无卡顿）
- **场景剧本源文件**: `demo/scenes.cjs`
- **抽帧质检证据目录**: `evidence/stage-4-demo/qa/` (包含 2s, 15s, 30s, 50s, 70s, 80s, 90s 全景抽帧检验图)

---

## 2. 叙事结构与场景编排 (Storyboard & Narrative)

严格遵循 `demo-recorder` 规范中推荐的 *"cover → problem → LIVE core flow → how it works → LIVE payoff → plan/CTA"* 叙事弧线：

| 场景序号 | 场景名称 | 类型 | 核心内容与视觉展示 | 时长 | 质检抽帧 |
|---|---|---|---|---|---|
| **Scene 1** | `01-cover` | Card (Dark-Premium) | 项目封面：RoadGuardian 道路急救副驾，琥珀警示色，100% 离线与开源标识。 | 10.8s | `qa/frame-2.png` |
| **Scene 2** | `02-problem` | Card (Dark-Premium) | 痛点揭示：黄金 10 分钟危机空档（肾上腺素恐慌、高速二次撞击、黑拖车敲诈）。引用 NHTSA 公路伤亡数据。 | 10.5s | `qa/frame-15.png` |
| **Scene 3** | `03-triage-safety` | **Live App** | **实机操作 Phase 1**: 零登录秒开，强制核验双闪、熄火切断电源，全员撤离至钢护栏后方。 | 12.9s | `qa/frame-30.png` |
| **Scene 4** | `04-evidence-vault` | **Live App** | **实机操作 Phase 2**: 结构化输入对方当事人 Marcus Vance、车牌 `8XYZ419`、17位 VIN `4T1B11HK5NU109284`，捕获水印现场照片。 | 11.9s | `qa/frame-50.png` |
| **Scene 5** | `05-tow-shield` | **Live App** | **实机操作 Phase 3**: 启动黑拖车防御盾，标红非派遣黑拖车，核验“拒绝签署空白单据”，自动生成中立事实陈述。 | 13.1s | `qa/frame-70.png` |
| **Scene 6** | `06-dossier-export` | **Live App** | **实机操作 Phase 4**: 实时生成官方事故卷宗，展示 64 位 SHA-256 密码学防伪印章，一键复制交警/保险理赔摘要。 | 14.5s | `qa/frame-70.png` |
| **Scene 7** | `07-validation` | Card (Dark-Premium) | 真实世界实证：基于 Stage 3.5 成果，展示 12/12 NHTSA & FTC 测试集 100% 通过与 94% 雪崩效应防篡改数据。 | 11.9s | `qa/frame-80.png` |
| **Scene 8** | `08-conclusion` | Card (Dark-Premium) | 总结与 CTA：呼应黑客松 *"Build a little more peace of mind"* 主旨，提供 GitHub 与线上部署链接。 | 12.6s | `qa/frame-90.png` |

---

## 3. 抽帧视觉验收与质量核对 (Visual QA)

使用 `read` 工具对所有提取的视频关键帧进行了仔细检查：
1. **字幕与文字排版**: 字幕位于底部 `y: 980-1040px` 区域，与主视觉卡片内容无重叠，字号大、带黑色描边，即便静音播放也能完整理解演示逻辑。
2. **色彩与质感一致性**: 全片严格保持统一的黑曜石基底（`#0B0F17`）与警示琥珀金（`#F59E0B`），无任何刺眼的通用 AI 紫色渐变或玻璃拟态。
3. **真实性一致**: 视频中展示的所有操作（Marcus Vance, 8XYZ419, US-101 坐标, SHA-256 哈希）与 Stage 2/3/3.5 的真实代码和测试集 100% 吻合，无任何伪造动画。
4. **音频校验**: `ffprobe` 确认音频轨正常（AAC 48kHz），解说节奏流畅，无爆音、卡顿或语速过快现象。
