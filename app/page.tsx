'use client';

import { ConnectButton } from '@/components/ConnectButton';
import { TransferDemo } from '@/components/TransferDemo';
import { TransactionHistory } from '@/components/TransactionHistory';
import { ReceiveQR } from '@/components/ReceiveQR';
import { TokenTransfer } from '@/components/TokenTransfer';
import { SubscriptionDemo } from '@/components/SubscriptionDemo';
import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';
import { Wallet, History, ArrowRightLeft, QrCode } from 'lucide-react';
import { WalletOverview } from '@/components/WalletOverview';

export default function Home() {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'history'>('send');
  const [sendMode, setSendMode] = useState<'sol' | 'usdc'>('sol');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex flex-col gap-8 items-center text-center w-full max-w-5xl z-10">
        {!isConnected && (
            <div className="space-y-6 mb-8">
                <div className="inline-block px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    LazorKit Integration Starter
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent pb-2">
                Passkey Native<br/>Solana Wallet
                </h1>
                <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Experience the future of Web3. No seed phrases, just biometric security powered by LazorKit and Solana.
                </p>
                <div className="flex justify-center pt-4 scale-125">
                     <ConnectButton />
                </div>
            </div>
        )}

        {isConnected && (
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Left Column: Wallet Actions */}
                <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                    <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-1 shadow-2xl">
                        <div className="flex p-1 gap-1 bg-neutral-900/50 rounded-xl mb-6">
                            <TabButton active={activeTab === 'send'} onClick={() => setActiveTab('send')} icon={<ArrowRightLeft className="w-4 h-4" />}>Send</TabButton>
                            <TabButton active={activeTab === 'receive'} onClick={() => setActiveTab('receive')} icon={<QrCode className="w-4 h-4" />}>Receive</TabButton>
                            <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History className="w-4 h-4" />}>History</TabButton>
                        </div>

                        <div className="px-6 pb-6">
                            {activeTab === 'send' && (
                                <div className="max-w-xl mx-auto space-y-6">
                                    <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-lg flex gap-1">
                                         <button 
                                            onClick={() => setSendMode('sol')}
                                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${sendMode === 'sol' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                                         >
                                            SOL (Gasless)
                                         </button>
                                         <button 
                                            onClick={() => setSendMode('usdc')}
                                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${sendMode === 'usdc' ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/20' : 'text-neutral-500 hover:text-neutral-300'}`}
                                         >
                                            USDC Transfer
                                         </button>
                                    </div>

                                    <div className="min-h-[400px]">
                                        {sendMode === 'sol' && (
                                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                                <TransferDemo />
                                            </div>
                                        )}
                                        {sendMode === 'usdc' && (
                                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                                <TokenTransfer />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'receive' && (
                                <ReceiveQR />
                            )}

                            {activeTab === 'history' && (
                                <TransactionHistory />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-6 order-1 lg:order-2">
                    <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-blue-500"/> 
                                Wallet Status
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <div className="w-full">
                            <WalletOverview />
                        </div>
                    </div>

                    <SubscriptionDemo />
                </div>
            </div>
        )}
        
        {!isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left max-w-5xl">
                <FeatureCard 
                    title="Biometric Security" 
                    description="Log in with FaceID, TouchID, or Windows Hello. Your keys never leave your device's Secure Enclave."
                    icon="🔒"
                />
                <FeatureCard 
                    title="Gasless Transactions" 
                    description="Transactions are automatically sponsored by the Paymaster. Onboard users without requiring SOL."
                    icon="⛽"
                />
                <FeatureCard 
                    title="Smart Accounts" 
                    description="Built on Program Derived Addresses (PDAs). Enable recovery, spending limits, and session keys."
                    icon="⚡"
                />
            </div>
        )}
      </main>
      
      <footer className="mt-24 text-neutral-600 text-sm flex gap-6">
        <a href="https://docs.lazorkit.com" target="_blank" className="hover:text-neutral-400 transition-colors">Documentation</a>
        <a href="https://github.com/lazor-kit" target="_blank" className="hover:text-neutral-400 transition-colors">GitHub</a>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, children, icon }: { active: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode }) {
    return (
        <button 
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active 
                ? 'bg-neutral-800 text-white shadow-lg' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
        >
            {icon}
            {children}
        </button>
    )
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
    return (
        <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-900/50 transition-all duration-300 group">
            <div className="text-4xl mb-6 bg-neutral-800/50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="text-xl font-bold mb-3 text-neutral-200">{title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
        </div>
    )
}
