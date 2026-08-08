# DeSci Contributor Path（DeSci 贡献者之路）

在 Monad 链上，把「选方向 → 学习 → 完成真实小任务 → 提交贡献证明 → 铸造 Contributor Credential」这条路径完整跑通的黑客松 Demo。

> Demo 版本说明：为了在 2 天内可演示，mint 目前是公开的（任何人都可以 mint，每个方向每个地址限一次）。生产版本应加入审核后端 + EIP-712 签名门槛，详见文末「生产化 TODO」。

---

## 项目概述

### 定位

DeSci（去中心化科学）生态最大的门槛不是技术，而是「不知道第一步该做什么」。**DeSci Contributor Path** 把新人引导做成一条五步向导流程：选择一个身份方向（Researcher / Translator / Builder / Founder）→ 阅读该方向的精选学习资料 → 领取一个真实可完成的小任务 → 提交任务成果链接作为贡献证明 → 连接钱包在 Monad 上铸造一枚 **Contributor Credential**（ERC-721 徽章），作为这次贡献的链上存证。

### 主要亮点

- **五步向导式引导**：把「如何参与 DeSci」拆解为选方向、学资料、做任务、交证明、铸徽章五个清晰步骤，降低新人参与门槛。
- **四条身份赛道**：Researcher（科研笔记与评议）、Translator（硬核内容翻译）、Builder（代码及生态建设）、Founder（项目发起与募资），每条赛道配套学习资源、参考项目和验收标准。
- **完全链上生成的 NFT**：`ContributorCredential` 合约的 metadata 与 SVG 图片全部在链上生成，不依赖 IPFS，mint 后立刻可用，不怕图裂。
- **面向 Monad 的合约与前端**：合约与前端均为链无关设计，切换到 Monad 主网只需替换链配置并重新部署。

### 使用场景

面向刚接触 DeSci 的开发者、研究者、内容创作者和社区运营者：不确定「自己适合做什么」的新人，可以通过一次 1～4 小时的真实小任务，产出第一份可验证的链上贡献记录，作为后续参与相关 DAO / 资助计划时的可信履历。

---

## 主要功能

1. **方向选择（Step 1）**：四条赛道卡片展示 tagline、参与人数、预计耗时，供用户选择。
2. **学习推荐（Step 2）**：按所选方向展示精选学习资源与相关项目案例。
3. **任务领取（Step 3）**：展示该方向的具体任务、验收标准与预计耗时。
4. **提交贡献证明（Step 4）**：用户粘贴任务成果链接（Notion / GitHub / 文章链接等）作为 proof。
5. **铸造徽章（Step 5）**：连接钱包（RainbowKit：MetaMask / WalletConnect / 注入式钱包），一键切换到 Monad Testnet，调用合约铸造 Contributor Credential NFT，并展示徽章预览与区块浏览器链接。

## 技术栈

- **前端**：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **链上交互**：wagmi + viem + RainbowKit + @tanstack/react-query
- **状态管理**：zustand（五步向导的全局状态）
- **智能合约**：Foundry + Solidity（`^0.8.24`）+ OpenZeppelin（ERC-721、Base64、Strings）
- **目标链**：Monad Testnet

---

## 目录结构

```
.
├── src/                     # Next.js 前端
│   ├── app/                 # 路由 + providers
│   ├── components/          # UI 组件 + 5 步流程组件
│   └── lib/                 # tracks 数据、wagmi/链配置、合约 ABI、zustand store
└── contracts/                # Foundry 项目
    ├── src/ContributorCredential.sol
    ├── script/Deploy.s.sol
    └── test/ContributorCredential.t.sol
```

---

## 一、跑起来（本地开发）

```bash
npm install
cp .env.local.example .env.local   # 先不填也能跑，WalletConnect 扫码连接除外
npm run dev
```

打开 http://localhost:3000，即可走完整个 5 步流程 UI（铸造徽章需要先部署合约、填好合约地址，见下一节）。

**演示账号说明**：本项目不使用账号密码登录，全部通过钱包连接（MetaMask / WalletConnect / 浏览器注入式钱包）完成身份识别与铸造操作，因此没有预置的演示账号。评审时只需准备一个已连接 Monad Testnet、并领取少量测试币 MON 的钱包地址即可。

---

## 二、部署合约到 Monad Testnet

### 1. 环境准备

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup

cd contracts
npm install                          # 装 OpenZeppelin
forge install foundry-rs/forge-std   # 装测试框架
```

### 2. 配置部署账号

```bash
cp .env.example .env
```

编辑 `contracts/.env`：
- `PRIVATE_KEY`：一个测试网小号的私钥（**不要用主钱包**），记得先去水龙头领一点 MON 测试币
- `MONAD_TESTNET_RPC_URL`：部署前对照 [Monad 官方文档](https://docs.monad.xyz) 核实最新 RPC 地址（测试网参数可能随官方升级变化）

### 3. 编译 + 测试

```bash
forge build
forge test -vv
```

### 4. 部署

```bash
source .env
forge script script/Deploy.s.sol \
  --rpc-url "$MONAD_TESTNET_RPC_URL" \
  --broadcast
```

终端会打印出合约地址，例如：

```
ContributorCredential deployed at: 0xABCD...
```

把这个地址填进项目根目录的 `.env.local`：

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xABCD...
```

（如果 Monad 区块浏览器支持 Etherscan 风格验证，可以在部署命令后加 `--verify`，并在 `.env` 里填好 `MONAD_EXPLORER_API_KEY` / `MONAD_EXPLORER_VERIFY_URL`。）

---

## 三、部署前端

推荐 Vercel，几分钟内可上线：

```bash
npm install -g vercel
vercel login
vercel --prod
```

部署时在 Vercel 项目设置里配置环境变量（与 `.env.local` 一致）：
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`（去 https://cloud.walletconnect.com 免费申请一个，几十秒）

也可以用 Cloudflare Pages（`npx wrangler pages deploy`），流程类似。

---

## 四、Demo 演示脚本建议

1. 打开首页 → 选择一个方向（如 Builder）
2. 展示推荐的学习内容 + 项目卡片
3. 展示任务详情与验收标准
4. 提交一个 proof 链接（可以现场用一个真实的 GitHub Issue 链接）
5. 连接钱包 → 一键切换到 Monad Testnet（如果钱包当前不在这条链）→ 点击铸造
6. 交易确认后展示徽章 + 区块浏览器链接，证明这是一个真实的链上 NFT

---

## 五、已知依赖坑

`package.json` 里有一条 `overrides: { "@wagmi/connectors": "6.1.0" }`，**请不要随手删掉**。

原因：RainbowKit 默认钱包列表会引入 Coinbase 的 Base Account 连接器，它依赖 `@coinbase/cdp-sdk`，而该 SDK 较新版本引用了尚未完整发布的 `@x402/*` 子包。`next dev` 下懒加载不会触发，但 `next build` 会把所有动态 import 静态打包，直接报 `Module not found`。锁定 `@wagmi/connectors@6.1.0`（对应更早版本的 `@base-org/account`，不依赖 cdp-sdk）可以绕开这条链路。如果未来要升级 wagmi/RainbowKit，记得先跑一次 `npm run build` 确认没有复现这个问题。

---

## 六、生产化 TODO（评委 Q&A 可以主动提）

当前为了 2 天内交付可运行 demo，做了以下简化，生产环境需要补上：

- **审核门槛**：mint 前应由后端校验 proof 是否被人工/自动审核通过，并用 EIP-712 签名授权 mint，防止绕过前端直接调用合约
- **内容管理**：`src/lib/tracks.ts` 目前是写死的 mock 数据，生产环境应接入 CMS 或数据库，便于持续运营
- **Soulbound**：Contributor Credential 作为身份类凭证，更适合做成不可转让（重写 `_update` 拦截非 mint/burn 的转账）
- **多链 / 主网切换**：合约与前端均为链无关设计，后续切 Monad 主网只需替换 `src/lib/chains.ts` 与重新部署合约

---

## 七、许可证

本项目采用 [MIT License](LICENSE) 开源，与 `contracts/src/ContributorCredential.sol` 中声明的 SPDX 许可证一致。
