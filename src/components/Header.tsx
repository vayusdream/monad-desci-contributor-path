"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-cjk text-lg font-bold text-ink">
            DeSci
          </span>
          <span className="font-serif-cjk text-lg font-bold text-terracotta">
            Contributor Path
          </span>
        </div>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
    </header>
  );
}
