import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { monadTestnet } from "./chains";

// Deliberately curated wallet list (no Coinbase / Base Account): RainbowKit's
// default kitchen-sink config pulls in @coinbase/cdp-sdk, which references an
// unreleased @x402 package and breaks `next build` in production. MetaMask +
// WalletConnect + injected covers everything we need for the demo.
const connectors = connectorsForWallets(
  [
    {
      groupName: "推荐",
      wallets: [metaMaskWallet, walletConnectWallet, rainbowWallet, injectedWallet],
    },
  ],
  {
    appName: "DeSci Contributor Path",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  },
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
