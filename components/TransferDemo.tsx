'use client';

import { useWallet } from '@lazorkit/wallet';
import { TransactionInstruction, PublicKey } from '@solana/web3.js';
import { useState } from 'react';

export function TransferDemo() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSignature(null);

      if (!smartWalletPubkey) {
        throw new Error("Wallet not connected");
      }

      // 1. Create Instruction - Send a Memo (Costs 0 SOL, only gas which is sponsored)
      const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb");
      const instruction = new TransactionInstruction({
        keys: [{ pubkey: smartWalletPubkey, isSigner: true, isWritable: true }],
        programId: memoProgramId,
        data: Buffer.from("Hello LazorKit! Gasless w/ 0 SOL", "utf-8"),
      });

      // 2. Sign and Send with Paymaster (Gasless)
      const sig = await signAndSendTransaction({
        instructions: [instruction],
      });

      console.log('Transaction confirmed:', sig);
      setSignature(sig);
    } catch (err: any) {
      console.error('Transfer failed:', err);
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 w-full">
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Gasless Transaction Demo
      </h3>
      <p className="text-neutral-400 mb-6 text-sm">
        This transaction is sponsored by the LazorKit Paymaster. You don't need SOL to pay for gas!
        We will send a Memo on-chain.
      </p>
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={handleTransfer}
          disabled={isLoading || !smartWalletPubkey}
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            'Send Gasless Memo'
          )}
        </button>

        {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                Error: {error}
            </div>
        )}

        {signature && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm break-all">
                <div className="font-semibold mb-1">Success!</div>
                Signature: 
                <a 
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-emerald-300 ml-1 break-all"
                >
                    {signature}
                </a>
            </div>
        )}
      </div>
    </div>
  );
}
