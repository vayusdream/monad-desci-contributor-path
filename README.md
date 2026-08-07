# DeSci Contributor Path

在 Monad 链上,把"选方向 → 学习 → 完成真实小任务 → 提交贡献证明 → 铸造 Contributor Credential"这条路径跑通的黑客松 Demo。

- 前端:Next.js 14 + TypeScript + Tailwind,视觉参考 [DeSci 自學手冊](https://desci-onboarding-hub.pages.dev/)(暖色调、衬线标题、卡片化统计感)
- 链上:Foundry + Solidity,`ContributorCredential` 是一个 ERC-721,**metadata 与 SVG 图片完全生成在链上**,不依赖 IPFS,mint 之后立刻可用、demo 现场不怕图裂

> Demo 版本说明:为了 2 天内可演示,mint 目前是公开的(任何人都可以 mint,每个方向每个地址限一次)。生产版本应加入审核后端 + EIP-712 签名门槛,详见文末「生产化 TODO」。

---

## 目录结构

```
.
├── src/                    # Next.js 前端
│   ├── app/                # 路由 + providers
│   ├── components/         # UI 组件 + 5 步流程组件
│   └── lib/                # tracks 数据、wagmi/链配置、合约 ABI、zustand store
└── contracts/               # Foundry 项目
    ├── src/ContributorCredential.sol
    ├── script/Deploy.s.sol
    └── test/ContributorCredential.t.sol
```

---

## 一、跑起来(本地开发)

```bash
npm install
cp .env.local.example .env.local   # 先不填也能跑,WalletConnect 扫码连接除外
npm run dev
```

打开 http://localhost:3000,即可走完整个 5 步流程 UI(mint 需要先部署合约、填好合约地址)。

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

编辑 `contracts/.env`:
- `PRIVATE_KEY`:一个测试网小号的私钥(**不要用主钱包**),记得先去水龙头领一点 MON 测试币
- `MONAD_TESTNET_RPC_URL`:部署前对照 [Monad 官方文档](https://docs.monad.xyz) 核实最新 RPC 地址(测试网参数可能随官方升级变化)

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

终端会打印出合约地址,例如:

```
ContributorCredential deployed at: 0xABCD...
```

把这个地址填进项目根目录的 `.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xABCD...
```

（如果 Monad 区块浏览器支持 Etherscan 风格验证,可以在部署命令后加 `--verify`,并在 `.env` 里填好 `MONAD_EXPLORER_API_KEY` / `MONAD_EXPLORER_VERIFY_URL`。）

---

## 三、部署前端

推荐 Vercel,几分钟内可上线:

```bash
npm install -g vercel
vercel login
vercel --prod
```

部署时在 Vercel 项目设置里配置环境变量(与 `.env.local` 一致):
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`(去 https://cloud.walletconnect.com 免费申请一个,几十秒)

也可以用 Cloudflare Pages(`npx wrangler pages deploy`),流程类似。

---

## 四、Demo 演示脚本建议

1. 打开首页 → 选择一个方向(如 Builder)
2. 展示推荐的学习内容 + 项目卡片
3. 展示任务详情与验收标准
4. 提交一个 proof 链接(可以现场用一个真实的 GitHub Issue 链接)
5. 连接钱包 → 一键切换到 Monad Testnet(如果钱包当前不在这条链)→ 点击铸造
6. 交易确认后展示徽章 + 区块浏览器链接,证明这是一个真实的链上 NFT

---

## 五、已知依赖坑

`package.json` 里有一条 `overrides: { "@wagmi/connectors": "6.1.0" }`,**请不要随手删掉**。

原因:RainbowKit 默认钱包列表会引入 Coinbase 的 Base Account 连接器,它依赖 `@coinbase/cdp-sdk`,而该 SDK 较新版本引用了尚未完整发布的 `@x402/*` 子包。`next dev` 下懒加载不会触发,但 `next build` 会把所有动态 import 静态打包,直接报 `Module not found`。锁定 `@wagmi/connectors@6.1.0`(对应更早版本的 `@base-org/account`,不依赖 cdp-sdk)可以绕开这条链路。如果未来要升级 wagmi/RainbowKit,记得先跑一次 `npm run build` 确认没有复现这个问题。

---

## 六、生产化 TODO(评委 Q&A 可以主动提)

当前为了 2 天内交付可运行 demo,做了以下简化,生产环境需要补上:

- **审核门槛**:mint 前应由后端校验 proof 是否被人工/自动审核通过,并用 EIP-712 签名授权 mint,防止绕过前端直接调用合约
- **内容管理**:`src/lib/tracks.ts` 目前是写死的 mock 数据,生产环境应接入 CMS 或数据库,便于持续运营
- **Soulbound**:Contributor Credential 作为身份类凭证,更适合做成不可转让(重写 `_update` 拦截非 mint/burn 的转账)
- **多链 / 主网切换**:合约与前端均为链无关设计,后续切 Monad 主网只需替换 `src/lib/chains.ts` 与重新部署合约
