# DeSci Contributor Path

## 一、项目一句话介绍

DeSci Contributor Path 是一个面向 DeSci（去中心化科学）新人的贡献引导与凭证系统。项目采用“**Zealy 社区任务孵化 + Monad 链上凭证结算**”的双层架构：以 Zealy 社区任务池作为低门槛入口，将选方向、学基础、完成真实小任务、提交证明的流程标准化，并在 Monad 链上为每一次真实产出现场铸造公开可验证的 Contributor Credential（ERC-721），作为该用户在 DeSci 生态里的第一份链上可信履历。

## 二、项目定位

DeSci Contributor Path 不是一个交易市场，也不是通用的任务众包平台。

它更接近一个：**新人引导手册 + 贡献任务清单 + 链上履历凭证**

我们试图回答一个真实问题：
* DeSci 是一个专业门槛很高、术语密集的领域，大多数感兴趣的人卡在「不知道第一步该做什么」；
* 但如果只是丢一堆资料链接，新人依然不会真正产出任何东西，也无法证明自己「做过」什么；
* 因此，Contributor Path 把「了解 DeSci」压缩成一次可在几十分钟到几小时内完成的具体任务，并用链上凭证把这次真实产出永久记录下来。

## 三、产品生态与架构 (Product Ecosystem & Architecture)

本项目采用用“**链下社区运营孵化 + 链上凭证结算**”的双层架构的双层架构，构建 DeSci 贡献者的完整成长飞轮：

1. **DeSci Contributor Path (Core DApp / 链上凭证结算中心)**
   - 🔗 **Demo 体验地址**: [DeSci Contributor Path](https://descimod.vercel.app/)
   - **定位**: 部署在 Monad 测试网上的核心 Web3 应用层。
   - **作用**: 提供 5 步标准化引导流程，负责贡献证明 (Proof) 的最终校验提交，并在 Monad 链上现场生成并铸造不可篡改的 Contributor Credential (ERC-721) NFT。

2. **DeSci Onboarding Hub (Zealy / 社区任务孵化池)**
   - 🔗 **社区任务池**: [DeSci Onboarding Hub on Zealy](https://zealy.io/cw/descionboardinghub/)
   - **定位**: 社区日常高频 Quest 分发与生态增长引擎。
   - **作用**: 提供更丰富细分的日常任务（如 Peer Review、项目分析、翻译、Grant 申请等），结合 XP 积分排行榜与周期性 Prize 抽奖，作为 DApp 的流量入口与链下任务源。

**生态协同飞轮：**

> **Zealy 任务池 (流量/低门槛参与)** ➔ 用户在社区完成细分 Quest 积累 XP ➔ 前往 **Core DApp (链上结算)** 提交最终 Proof ➔ 在 **Monad 链上铸造专属 Credential NFT** 沉淀可信履历。

## 四、我们为什么需要这样一个系统

DeSci 生态里，新人的第一次参与通常是这样的：
* 加入了几个 Discord / Telegram，看了很多帖子，但没有产出
* 想找一个开源仓库贡献代码，但不知道从哪个 issue 开始
* 想翻译一篇文章帮助中文用户，但不确定标准该翻多长、翻多准
* 想写一篇研究笔记，但没有人告诉他这算不算「入门贡献」

如果没有一套明确的路径，容易出现三类问题：
1. **门槛不透明**：新人不知道「完成什么」才算迈出了第一步
2. **产出不可见**：即便认真做了一件事，也没有地方证明「我做过」
3. **信任难以积累**：后续想申请 DAO 资助、加入核心团队时，没有可验证的历史记录可以展示

Contributor Path 的目标不是替代 DeSci 各个项目自己的贡献者体系，而是提供一个更低门槛的「第一步」——一次任务、一份证明、一枚链上凭证。

## 五、核心设计理念

### 1. 凭证不能购买，只能通过真实任务获得

Contributor Credential 不是可以直接 mint 出来炫耀的收藏品。合约层面对每个地址、每条赛道限制铸造一次（`hasMinted` 映射），且铸造前需要走完「选方向 → 学习 → 领任务 → 提交成果链接」的完整流程。它是一份贡献记录，而不是一个可交易的资产。

### 2. 任务验收标准由人定义，链只负责记录结果

我们没有让智能合约去判断「这篇研究笔记写得好不好」「这个 PR 是不是灌水」——这类判断更适合交给人（当前 demo 阶段是提交后附带一份人工审核用的申请表格，后续应接入正式审核后端 + EIP-712 签名门槛）。链上合约负责的是更确定的事情：谁、在什么时间、针对哪条赛道，被授权铸造了一枚凭证。

### 3. 赛道即身份路径，不是难度分级

Researcher / Translator / Builder / Founder 四条赛道，代表四种不同背景的人进入 DeSci 的方式，而不是「新手/进阶/高手」的分级。一个纯文科背景的人可以从 Translator 开始，一个工程师可以直接从 Builder 开始——路径由背景决定，而不是由能力门槛决定。

### 4. 凭证完全链上生成，公开可验证

Contributor Credential 的 metadata 与 SVG 图片全部在合约里现场生成（Base64 编码，不依赖 IPFS），任何人都可以直接从链上读出一枚凭证对应的赛道、颜色和铸造时间，不需要信任任何中心化的图床或索引服务。

## 六、当前系统已经在链上实现了什么

在当前 Monad Testnet 版本中，`ContributorCredential` 合约已经支持：
* 基于 OpenZeppelin ERC-721 的凭证合约，四条赛道（Research / Science / Builder / Community）以枚举区分
* `mint(track, deadline, signature)`：按赛道铸造凭证，需要携带审核后端签发的 EIP-712 签名，每个地址每条赛道限铸一次（`hasMinted` 记录）
* 完全链上生成的 `tokenURI`：JSON metadata + 内联 SVG 图片，均以 Base64 编码直接返回，不依赖任何外部存储
* `CredentialMinted` 事件，记录铸造地址、tokenId、赛道，便于链上检索历史
* 配套的 Foundry 部署脚本（`Deploy.s.sol`）与单元测试（`ContributorCredential.t.sol`）

因此它已经不是一个「只有 UI 的外壳」，而是一个有真实链上状态、真实读写流程和真实铸造限制的可运行原型。

## 七、前端应用已经实现什么

当前前端已经实现：
* Monad Testnet 连接与网络配置
* 通过 RainbowKit 接入 MetaMask / WalletConnect / 浏览器注入式钱包
* 完整的五步向导 UI：选择方向 → 学习推荐 → 任务详情 → 提交贡献证明 → 铸造凭证
* 每条赛道的学习资源、相关项目案例、任务验收标准与提交提示
* 贡献证明提交表单：成果链接校验、补充说明，以及一份人工审核用的申请表格勾选确认
* 铸造流程中的完整状态反馈：未连接钱包提示、错误网络下的一键切链、铸造中/确认中的加载态、交易失败错误信息展示
* 已铸造状态检测（`hasMinted` 只读调用）与铸造成功后的区块浏览器交易链接
* 徽章预览组件与「体验另一个方向」的重置入口

整体上，前端已经形成一条完整的：**首页引导 → 钱包连接 → 选方向学习 → 完成任务提交证明 → 链上铸造凭证** 的闭环体验。

## 八、主要亮点

### 1. 更接近真实入门路径，而不是空泛的资料合集

Contributor Path 的核心不是「甩给你一堆链接」，而是：
* 必须完成一次具体、可核验的任务
* 必须提交一个真实存在的成果链接作为证明
* 每条赛道每人只能获得一枚凭证，避免刷量
* 铸造前有人工审核环节兜底，避免空提交蒙混过关

这让系统更接近一个真实的「贡献认证工具」，而不是一份可以随手划走的 onboarding 文档。

### 2. 让「第一次贡献」变得可见、可证明

很多人对 DeSci 的第一次参与，往往就此沉没：
* 写过一段翻译，但没有地方证明「我翻译过」
* 提过一个 issue，但没有和身份关联起来
* 读完一篇论文写了笔记，但笔记散落在自己的笔记软件里

Contributor Path 把这些「第一次」收敛成一枚链上凭证——它比一句「谢谢参与」更持久，也比截图证明更可信。

### 3. 链上负责记录事实，人负责判断质量

我们没有让合约去评判任务完成得好不好。分工是：
* **链上负责**：谁在什么时候、针对哪条赛道，被授权铸造了凭证，以及这枚凭证本身是否可验证
* **人（审核环节）负责**：判断这次提交是否达到验收标准

这是一个诚实的 Web3 用法：链不替代判断，只把判断之后的结果永久保存下来。

### 4. Monad 很适合这类「高频、低价值、需要公开性」的记录场景

Contributor Path 并不需要把每一次学习行为都放上链，只把最关键的事实放上链：赛道选择、任务完成、凭证铸造。对于这种高频小额、但需要公开可验证的场景，Monad 提供了合适的底层环境：兼容 EVM、可直接用标准钱包接入、结算快，适合承载大量新人涌入时的铸造请求。

## 九、使用场景

### 场景 1：完全没接触过 DeSci 的新人

适合：对去中心化科学感兴趣、但不知道从哪开始的开发者、研究者、内容创作者。

例子：
* 打开首页，选择 Translator 方向
* 阅读推荐的术语表和写作原则
* 翻译一段 300–500 字的英文 DeSci 内容
* 提交译文链接，填写人工审核表格
* 通过审核后连接钱包，在 Monad 上铸造第一枚 Contributor Credential

这类场景的价值是：给「感兴趣但不知道怎么动手」的人一条最短路径。

### 场景 2：想为开源 DeSci 项目做第一次贡献的开发者

适合：有一定工程能力、但不熟悉 DeSci 项目生态的开发者。

例子：
* 选择 Builder 方向，浏览推荐的 DeSci 开源仓库（DeSci Labs、Molecule Protocol、OpenAlex 等）
* 提交一个真实、可验证的 Issue 或 PR 链接作为贡献证明
* 铸造凭证后，这枚凭证成为该开发者在 DeSci 生态里「已经真实贡献过」的第一份链上履历

### 场景 3：想系统梳理自己专业理解的研究者

适合：科研、工程、医学、法律等背景，希望留下自己专业视角笔记的人。

例子：
* 选择 Researcher 方向，认领《DeSci 自学手册》中的一个章节或案例
* 写一份 300 字以上、体现自身专业视角的见解笔记（而非复述原文）
* 提交笔记链接并铸造凭证，作为这次专业输出的存证

### 场景 4：作为 DAO / 资助计划的前置筛选参考（未来扩展）

当前版本主要面向单人完成单条赛道任务的场景。未来如果与具体 DAO 或资助计划建立合作，Contributor Credential 也可以作为申请材料的一部分——「已完成过一次真实小任务并被记录在链上」本身就是比自我陈述更可信的信号。这不是当前 MVP 的重点，但说明了这套凭证体系向外扩展的空间。

## 十、技术实现概览

**前端**
* Next.js 16（App Router）
* React 19 + TypeScript
* Tailwind CSS 4
* wagmi + viem
* RainbowKit（MetaMask / WalletConnect / 浏览器注入式钱包）
* @tanstack/react-query
* zustand（五步向导状态管理）
* Vercel / Cloudflare Pages 部署

**链上**
* Monad Testnet
* Solidity ^0.8.24 + Foundry
* 单合约结构 `ContributorCredential`（继承 OpenZeppelin ERC-721）
* 链上赛道枚举与铸造限制（每地址每赛道限一次）
* 完全链上生成的 metadata + SVG（Base64，不依赖 IPFS）
* `CredentialMinted` 事件记录

**审核后端**
* Next.js API Routes（`/api/proofs`、`/api/attest`、`/api/admin/*`）
* viem 签发 EIP-712 铸造授权，仅在服务端持有 attestor 私钥
* Upstash Redis 持久化提交记录，本地未配置时自动降级为进程内内存存储
* 极简 `/admin` 审核后台，共享密钥（`ADMIN_SECRET`）鉴权，可对提交记录做「标记可疑」

**当前架构特点**
* 任务与学习资源当前以代码内常量（`src/lib/tracks.ts`）维护
* 核心可信状态（是否已铸造、凭证内容）来自 Monad 链上合约，而非数据库
* 审核策略是「自动通过 + 事后人工抽查」，尚未接入更严格的自动化内容审核

---

## 十一、本地开发与部署

### 本地跑起来

```bash
npm install
cp .env.local.example .env.local   # 先不填也能跑，WalletConnect 扫码连接除外
npm run dev
```

打开 http://localhost:3000 即可走完整个 5 步流程 UI。完整走完 Step 4 → Step 5（提交证明 → 铸造）还需要在 `.env.local` 里配置 `ATTESTOR_PRIVATE_KEY`（审核后端签发铸造授权用的私钥），否则 `/api/attest` 会报错。

访问 `/admin`，用 `.env.local` 里配置的 `ADMIN_SECRET` 登录后可以看到所有提交记录，并对可疑记录做「标记可疑」处理（不影响已经铸造的凭证，仅用于事后追溯）。

### 部署合约到 Monad Testnet

```bash
cd contracts
npm install                          # 装 OpenZeppelin
forge install foundry-rs/forge-std   # 装测试框架
cp .env.example .env
```

编辑 `contracts/.env`：
* `PRIVATE_KEY`：一个测试网小号的私钥（**不要用主钱包**），先去水龙头领一点 MON 测试币
* `ATTESTOR_ADDRESS`：审核后端签发铸造授权用的地址，会写死进合约（`immutable`，部署后不可更改），必须和后端 `ATTESTOR_PRIVATE_KEY` 是同一个密钥对
* `MONAD_TESTNET_RPC_URL`：部署前对照 [Monad 官方文档](https://docs.monad.xyz) 核实最新 RPC 地址

```bash
forge build && forge test -vv
source .env
forge script script/Deploy.s.sol --rpc-url "$MONAD_TESTNET_RPC_URL" --broadcast
```

终端打印出的合约地址填进项目根目录 `.env.local` 的 `NEXT_PUBLIC_CONTRACT_ADDRESS`。

### 部署前端

Contributor Path 的核心不是「甩给你一堆链接」，而是：
* 必须完成一次具体、可核验的任务
* 必须提交一个真实存在的成果链接作为证明
* 每条赛道每人只能获得一枚凭证，避免刷量
* 铸造前有人工审核环节兜底，避免空提交蒙混过关

这让系统更接近一个真实的「贡献认证工具」，而不是一份可以随手划走的 onboarding 文档。

### 2. 让「第一次贡献」变得可见、可证明

很多人对 DeSci 的第一次参与，往往就此沉没：
* 写过一段翻译，但没有地方证明「我翻译过」
* 提过一个 issue，但没有和身份关联起来
* 读完一篇论文写了笔记，但笔记散落在自己的笔记软件里

Contributor Path 把这些「第一次」收敛成一枚链上凭证——它比一句「谢谢参与」更持久，也比截图证明更可信。

### 3. 链上负责记录事实，人负责判断质量

我们没有让合约去评判任务完成得好不好。分工是：
* **链上负责**：谁在什么时候、针对哪条赛道，被授权铸造了凭证，以及这枚凭证本身是否可验证
* **人（审核环节）负责**：判断这次提交是否达到验收标准

这是一个诚实的 Web3 用法：链不替代判断，只把判断之后的结果永久保存下来。

### 4. Monad 很适合这类「高频、低价值、需要公开性」的记录场景

Contributor Path 并不需要把每一次学习行为都放上链，只把最关键的事实放上链：赛道选择、任务完成、凭证铸造。对于这种高频小额、但需要公开可验证的场景，Monad 提供了合适的底层环境：兼容 EVM、可直接用标准钱包接入、结算快，适合承载大量新人涌入时的铸造请求。

## 九、使用场景

### 场景 1：完全没接触过 DeSci 的新人

适合：对去中心化科学感兴趣、但不知道从哪开始的开发者、研究者、内容创作者。

例子：
* 打开首页，选择 Translator 方向
* 阅读推荐的术语表和写作原则
* 翻译一段 300–500 字的英文 DeSci 内容
* 提交译文链接，填写人工审核表格
* 通过审核后连接钱包，在 Monad 上铸造第一枚 Contributor Credential

这类场景的价值是：给「感兴趣但不知道怎么动手」的人一条最短路径。

### 场景 2：想为开源 DeSci 项目做第一次贡献的开发者

适合：有一定工程能力、但不熟悉 DeSci 项目生态的开发者。

例子：
* 选择 Builder 方向，浏览推荐的 DeSci 开源仓库（DeSci Labs、Molecule Protocol、OpenAlex 等）
* 提交一个真实、可验证的 Issue 或 PR 链接作为贡献证明
* 铸造凭证后，这枚凭证成为该开发者在 DeSci 生态里「已经真实贡献过」的第一份链上履历

部署时在 Vercel 项目设置里配置环境变量（与 `.env.local` 一致）：
* `NEXT_PUBLIC_CONTRACT_ADDRESS`
* `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`（去 https://cloud.walletconnect.com 免费申请一个，几十秒）
* `ATTESTOR_PRIVATE_KEY`：对应部署合约时写入的 `ATTESTOR_ADDRESS`，仅服务端使用，切勿加 `NEXT_PUBLIC_` 前缀
* `ADMIN_SECRET`：保护 `/admin` 和 `/api/admin/*` 的共享密钥，自己生成一串随机字符串即可
* `KV_REST_API_URL` / `KV_REST_API_TOKEN`：Upstash Redis 的连接信息（Vercel Marketplace 装 Redis 集成会自动注入），不配置也能跑，但每次冷启动提交记录都会丢失
### 场景 3：想系统梳理自己专业理解的研究者

适合：科研、工程、医学、法律等背景，希望留下自己专业视角笔记的人。

例子：
* 选择 Researcher 方向，认领《DeSci 自学手册》中的一个章节或案例
* 写一份 300 字以上、体现自身专业视角的见解笔记（而非复述原文）
* 提交笔记链接并铸造凭证，作为这次专业输出的存证

### 场景 4：作为 DAO / 资助计划的前置筛选参考（未来扩展）

当前版本主要面向单人完成单条赛道任务的场景。未来如果与具体 DAO 或资助计划建立合作，Contributor Credential 也可以作为申请材料的一部分——「已完成过一次真实小任务并被记录在链上」本身就是比自我陈述更可信的信号。这不是当前 MVP 的重点，但说明了这套凭证体系向外扩展的空间。

## 十、技术实现概览

**前端**
* Next.js 16（App Router）
* React 19 + TypeScript
* Tailwind CSS 4
* wagmi + viem
* RainbowKit（MetaMask / WalletConnect / 浏览器注入式钱包）
* @tanstack/react-query
* zustand（五步向导状态管理）
* Vercel / Cloudflare Pages 部署

**链上**
* Monad Testnet
* Solidity ^0.8.24 + Foundry
* 单合约结构 `ContributorCredential`（继承 OpenZeppelin ERC-721）
* 链上赛道枚举与铸造限制（每地址每赛道限一次）
* 完全链上生成的 metadata + SVG（Base64，不依赖 IPFS）
* `CredentialMinted` 事件记录

**当前架构特点**


---

## 十、Demo 演示

1. 打开首页 → 选择一个方向（如 Builder）
2. 展示推荐的学习内容 + 项目卡片
3. 展示任务详情与验收标准
4. 提交一个 proof 链接（可以现场用一个真实的 GitHub Issue 链接）
5. 连接钱包 → 一键切换到 Monad Testnet（如果钱包当前不在这条链）→ 点击铸造
6. 交易确认后展示凭证 + 区块浏览器链接，证明这是一个真实的链上 NFT
**演示账号说明**：本项目不使用账号密码登录，全部通过钱包连接（MetaMask / WalletConnect / 浏览器注入式钱包）完成身份识别与铸造操作，因此没有预置的演示账号。评审时只需准备一个已连接 Monad Testnet、并领取少量测试币 MON 的钱包地址即可。

---

## 十一、生产化 TODO

当前为了短周期内交付可运行 demo，做了以下简化，生产环境需要补上：

* **审核门槛**：mint 前应由后端校验 proof 是否被人工/自动审核通过，并用 EIP-712 签名授权 mint，防止绕过前端直接调用合约
* **内容管理**：`src/lib/tracks.ts` 目前是写死的 mock 数据，生产环境应接入 CMS 或数据库，便于持续运营
* **Soulbound**：Contributor Credential 作为身份类凭证，更适合做成不可转让（重写 `_update` 拦截非 mint/burn 的转账）
* **多链 / 主网切换**：合约与前端均为链无关设计，后续切 Monad 主网只需替换 `src/lib/chains.ts` 与重新部署合约

网页交互版本优化共享文档：https://docs.qq.com/sheet/DWW5YeVRIbGJPVm1t?tab=BB08J2

## 十二、许可证

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源，与 `contracts/src/ContributorCredential.sol` 中声明的 SPDX 许可证一致。
