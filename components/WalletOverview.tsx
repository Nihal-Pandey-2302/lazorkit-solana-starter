'use client';

import { useWallet } from '@lazorkit/wallet';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { useEffect, useState } from 'react';
import { Copy, Check, LogOut, Wallet } from 'lucide-react';

const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

export function WalletOverview() {
  const { wallet, disconnect } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (wallet?.smartWallet) {
        fetchBalances();
        const interval = setInterval(fetchBalances, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }
  }, [wallet]);

  const fetchBalances = async () => {
    try {
        const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com');
        const pubkey = new PublicKey(wallet!.smartWallet);

        // Fetch SOL
        const sol = await connection.getBalance(pubkey);
        setSolBalance(sol / LAMPORTS_PER_SOL);

        // Fetch USDC
        try {
            const usdcATA = await getAssociatedTokenAddress(USDC_MINT, pubkey, true);
            const account = await getAccount(connection, usdcATA);
            setUsdcBalance(Number(account.amount) / 1_000_000);
        } catch {
            setUsdcBalance(0); // ATA likely doesn't exist
        }

    } catch (e) {
        console.error("Failed to fetch balances", e);
    }
  };

  const copyAddress = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.smartWallet.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!wallet) return null;

  return (
    <div className="space-y-6">
        {/* Address and Copy */}
        <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800 flex items-center justify-between group">
            <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Smart Account</span>
                <span className="text-xs font-mono text-neutral-300 truncate w-full" title={wallet.smartWallet}>
                    {wallet.smartWallet.slice(0, 8)}...{wallet.smartWallet.slice(-8)}
                </span>
            </div>
            <button 
                onClick={copyAddress}
                className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                title="Copy Address"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>

        {/* Balances */}
        <div className="space-y-3">
             <div className="flex items-center justify-between p-4 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl border border-neutral-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#9945FF]/20 flex items-center justify-center">
                        <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="SOL" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-white">Solana</span>
                        <span className="text-xs text-neutral-400">SOL</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-mono font-bold text-white">
                        {solBalance !== null ? solBalance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '...'}
                    </div>
                    <div className="text-xs text-neutral-500">
                        {solBalance !== null ? `$${(solBalance * 150).toFixed(2)}` : '...'}
                    </div>
                </div>
             </div>

             <div className="flex items-center justify-between p-4 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl border border-neutral-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2775CA]/20 flex items-center justify-center">
                        <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png" alt="USDC" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-white">USDC</span>
                        <span className="text-xs text-neutral-400">USDC</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-mono font-bold text-white">
                        {usdcBalance !== null ? usdcBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '...'}
                    </div>
                    <div className="text-xs text-neutral-500">
                        {usdcBalance !== null ? `$${usdcBalance.toFixed(2)}` : '...'}
                    </div>
                </div>
             </div>
        </div>

        {/* Actions */}
        <button 
            onClick={() => disconnect()}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
        >
            <LogOut className="w-4 h-4" />
            Disconnect Wallet
        </button>
    </div>
  );
}
