import { defineChain } from "viem";

/**
 * Monad Testnet — 部署前请对照 https://docs.monad.xyz 核实最新的
 * chainId / RPC / explorer,测试网参数可能会随官方升级而变化。
 */
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
});
