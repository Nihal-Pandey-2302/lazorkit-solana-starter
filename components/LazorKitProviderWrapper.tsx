"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode } from "react";

const CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  PORTAL_URL: process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl:
      process.env.NEXT_PUBLIC_PAYMASTER_URL ||
      "https://kora.devnet.lazorkit.com",
  },
};

export function LazorKitProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      {children}
    </LazorkitProvider>
  );
}
