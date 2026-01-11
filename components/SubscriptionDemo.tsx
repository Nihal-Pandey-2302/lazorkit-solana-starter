'use client';

import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';
import { Sparkles, Calendar, Check } from 'lucide-react';

export function SubscriptionDemo() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    // Simulation of a recurring gasless transaction approval
    // In a real Paymaster scenario, this would sign a session key or predefined schedule
    setTimeout(() => {
        setIsLoading(false);
        setIsSubscribed(true);
    }, 2000);
  };

  return (
    <div className="relative group w-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative p-6 bg-neutral-900 rounded-xl border border-neutral-800 w-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Nuclear Premium</h3>
                    <p className="text-xs text-neutral-400">$5 USDC / Month</p>
                </div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-neutral-300">
                <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" />
                    Unlimited Gasless Transactions
                </li>
                <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" />
                    Priority Support
                </li>
                <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" />
                    Early Access Features
                </li>
            </ul>

            <button
                onClick={handleSubscribe}
                disabled={isLoading || isSubscribed}
                className={`w-full py-3 rounded-lg font-bold transition-all transform active:scale-95 ${
                    isSubscribed
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
            >
                {isLoading ? (
                    ' Approving...'
                ) : isSubscribed ? (
                    <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Active
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" /> Subscribe (Gasless)
                    </span>
                )}
            </button>
            <p className="text-[10px] text-neutral-500 text-center mt-3">
                Powered by LazorKit Recurring Paymaster
            </p>
        </div>
    </div>
  );
}
