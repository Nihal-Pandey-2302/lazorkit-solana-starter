'use client';

import { useWallet } from '@lazorkit/wallet';

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();

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
    <button
      onClick={() => connect()}
      disabled={isConnecting}
      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
    >
      {isConnecting ? 'Connecting...' : 'Connect Passkey Wallet'}
    </button>
  );
}
