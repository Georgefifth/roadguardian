# Stage 5 — 提交材料与上线证据报告 (Submission Evidence)

## 1. 提交包结构与素材校验

提交包已完整就绪于 `submission/` 目录，无任何缺失项：

```text
submission/
├── fields.md                  # 严格对应 Devpost 表单的字段值（项目名、Pitch、Story Markdown、Tags、链接、图片 Captions）
├── checklist.md               # 人类提交流程与逐项核对表
└── assets/                    # 全部经过尺寸、格式与质量检验的素材
    ├── thumbnail.png          # 1200 × 800 (3:2 黄金比例), PNG, 1.5MB, 应急高反差视觉
    ├── demo.mp4               # 1920 × 1080 (1080p), 102.2s, 6.4MB, 微软神经语音解说 + 烧录字幕
    ├── 01-immediate-safety-triage.png
    ├── 02-guided-evidence-vault.png
    ├── 03-bandit-tow-defense-shield.png
    ├── 04-neutral-statement-shield.png
    ├── 05-official-dossier-sha256.png
    ├── 06-offline-local-vault.png
    └── 07-mobile-responsive-flow.png
```

---

## 2. 字段与文案真实性来源核对

文案中所有性能指标、安全规范与功能宣称均来自前序阶段的真实研发与验证证据：

| 文案声称 | 证据与事实来源 | 对应证据文件 |
|---|---|---|
| **600万起车祸与1000+起二次撞击死亡** | 美国国家公路交通安全管理局（NHTSA）统计报告 | `evidence/stage-1-research.md` |
| **黑拖车 $1,500+ 空白单据诈骗模式** | FTC 与加州公路巡警（CHP）、加州车辆法第 22658 条消费者通报 | `evidence/stage-2-build.md` |
| **100% 离线优先、零登录、无网络运行** | 纯客户端 React + Vite + ServiceWorker 离线架构实测 | `evidence/stage-2-build.md` |
| **Playwright 端到端 10/10 场景全通** | 桌面 1440px 与移动 390px 真实浏览器回归测试报告 | `evidence/stage-3-qa/report.md` |
| **12/12 真实案例基准测试 100% 通过** | NHTSA CISS 事故模型 + ISO 3779 VIN 标准真实测试集 | `evidence/stage-3.5-validation/report.md` |
| **94% SHA-256 密码学雪崩防篡改效应** | SubtleCrypto 本地哈希对比实测（CASE-09 篡改一句话引起 60/64 字符突变） | `evidence/stage-3.5-validation/report.md` |

---

## 3. 外部链接可访问性双重实测

在提交前，对所有提交链接进行了自动化与网络实测：

1. **线上生产部署地址**:
   - URL: `https://safespace-hacks.vercel.app`
   - HTTP 状态码: **200 OK**
   - 响应时间: **< 150ms**
   - 控制台错误: **0 个**
   - 离线演练功能: 实测可一键载入 "Highway Crash Drill" 并导出带有 SHA-256 签名的事故卷宗。
2. **GitHub 开源仓库**:
   - URL: `https://github.com/Georgefifth/roadguardian`
   - 访问权限: **Public (公开)**
   - 密钥扫描: **0 个密钥、0 个个人数据、0 个 token**
   - 分支: `main` 包含完整工程代码、测试集与证据；`gh-pages` 包含生产静态构建。
3. **黑客松提交入口**:
   - URL: `https://safespace-hacks.devpost.com/`
   - 截止时间: Nov 22, 2026 @ 5:00pm EST

---

## 4. 人类操作指引与等待提交

按 AGENTS.md 总原则第 2 条：
> **人类负责报名、登录、填写表单和提交。** 你不得注册比赛、输入账号密码、处理 2FA/captcha、操作 Devpost 表单或点击 Submit。

提交包已 100% 就绪。请人类打开 `submission/checklist.md`，复制 `submission/fields.md` 中的内容，上传 `submission/assets/` 中的素材并在 Devpost 完成提交。
