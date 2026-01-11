'use client';

import { useWallet } from '@lazorkit/wallet';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';

type ConfirmedSignatureInfo = {
    signature: string;
    slot: number;
    err: any;
    memo: string | null;
    blockTime?: number | null;
};

export function TransactionHistory() {
  const { wallet, isConnected } = useWallet();
  const [txns, setTxns] = useState<ConfirmedSignatureInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && wallet?.smartWallet) {
        fetchHistory();
    }
  }, [isConnected, wallet]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
        const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com');
        if (!wallet?.smartWallet) return;
        const pubkey = new PublicKey(wallet.smartWallet);
        const sigs = await connection.getSignaturesForAddress(pubkey, { limit: 10 });
        setTxns(sigs);
    } catch (e) {
        console.error("Failed to fetch history", e);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-neutral-200">Recent Activity</h3>
        <button onClick={fetchHistory} className="text-xs text-neutral-400 hover:text-white transition-colors">
            Refresh
        </button>
      </div>
      
      {isLoading ? (
          <div className="space-y-3">
              {[1,2,3].map(i => (
                  <div key={i} className="h-12 bg-neutral-800/50 animate-pulse rounded-lg" />
              ))}
          </div>
      ) : (
        <div className="space-y-2">
            {txns.length === 0 && (
                <div className="text-center text-neutral-500 py-8 text-sm">No transactions yet</div>
            )}
            {txns.map(tx => (
                <div key={tx.signature} className="flex items-center justify-between p-3 bg-neutral-800/30 hover:bg-neutral-800/50 border border-neutral-700/30 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                    {tx.err ? (
                        <XCircle className="w-5 h-5 text-red-500/80" />
                    ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-500/80" />
                    )}
                    <div className="flex flex-col">
                        <span className="font-mono text-sm text-neutral-300">
                            {tx.signature.slice(0, 4)}...{tx.signature.slice(-4)}
                        </span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleDateString() : 'Unknown'}
                        </span>
                    </div>
                </div>
                <a 
                    href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-500/10"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
