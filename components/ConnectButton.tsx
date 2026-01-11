'use client';

import { useWallet } from '@lazorkit/wallet';
import React from 'react';

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();
  const [error, setError] = React.useState<string | null>(null);

  const handleConnect = async () => {
    try {
        setError(null);
        await connect();
    } catch (err: any) {
        console.error("Connect failed:", err);
        setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (isConnected && wallet) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
      >
        Disconnect ({wallet.smartWallet.slice(0, 6)}...{wallet.smartWallet.slice(-4)})
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
        <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
        >
        {isConnecting ? 'Connecting...' : 'Connect Passkey Wallet'}
        </button>
        {error && (
            <p className="text-xs text-red-400 max-w-[200px] text-center bg-red-900/20 p-2 rounded border border-red-500/20">
                {error}
            </p>
        )}
    </div>
  );
}
