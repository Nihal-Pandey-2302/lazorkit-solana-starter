'use client';

import { useWallet } from '@lazorkit/wallet';
import { getAssociatedTokenAddress, createTransferInstruction, getAccount, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from '@solana/spl-token';
import { PublicKey, Connection } from '@solana/web3.js';
import { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';

// Devnet USDC Mint
const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); 

export function TokenTransfer() {
  const { wallet, signAndSendTransaction, smartWalletPubkey } = useWallet();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const sendUSDC = async () => {
    if (!smartWalletPubkey) return;
    
    setIsLoading(true);
    setError(null);
    setSignature(null);

    try {
        const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com');
        
        // Basic validation
        if (!recipient || !amount) throw new Error("Please enter amount and recipient");
        let recipientPubkey: PublicKey;
        try {
            recipientPubkey = new PublicKey(recipient);
        } catch {
            throw new Error("Invalid recipient address");
        }

        // Get ATAs
        const sourceATA = await getAssociatedTokenAddress(USDC_MINT, smartWalletPubkey, true);
        const destATA = await getAssociatedTokenAddress(USDC_MINT, recipientPubkey, true);

        // Check if user has USDC account (optional but good UX)
        // For standard wallets we'd check balance, but for smart wallets logic might differ. 
        // We'll proceed with instruction creation.

        // Note: In a real app, you might need to create the destination ATA if it doesn't exist.
        // For simplicity in this demo, we assume it exists or fail.
        
        const ix = createTransferInstruction(
            sourceATA,
            destATA,
            smartWalletPubkey,
            parseFloat(amount) * 1_000_000 // USDC has 6 decimals
        );
        
        const sig = await signAndSendTransaction({ instructions: [ix] });
        setSignature(sig);
    } catch (err: any) {
        console.error("USDC Send Failed", err);
        setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 w-full">
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
        Send USDC
      </h3>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300">
            Ensure you have Devnet USDC. You can get some from the <a href="https://faucet.circle.com/" target="_blank" className="underline hover:text-white">Circle Faucet</a>.
        </p>
      </div>

      <div className="space-y-3">
        <div>
            <label className="text-xs text-neutral-400 ml-1 mb-1 block">Recipient Address</label>
            <input 
                type="text" 
                placeholder="Solana Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
        
        <div>
            <label className="text-xs text-neutral-400 ml-1 mb-1 block">Amount (USDC)</label>
            <input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>

        <button 
            onClick={sendUSDC}
            disabled={isLoading || !amount || !recipient}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <Send className="w-4 h-4" />
                    Send USDC
                </>
            )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
        </div>
      )}

      {signature && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs break-all">
            <span className="font-bold block mb-1">Sent!</span>
            <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" className="underline hover:text-emerald-300">
                View Transaction
            </a>
        </div>
      )}
    </div>
  );
}
