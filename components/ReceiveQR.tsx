'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function ReceiveQR() {
  const { wallet } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!wallet?.smartWallet) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.smartWallet.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-4 w-full">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-neutral-200">Receive Assets</h3>
        <p className="text-xs text-neutral-500">Scan to send SOL or SPL Tokens</p>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-xl shadow-white/5">
        <QRCodeSVG 
          value={wallet.smartWallet.toString()} 
          size={180}
          level="H"
          className="rounded-lg"
        />
      </div>

      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg group hover:border-neutral-700 transition-colors cursor-pointer" onClick={copyAddress}>
            <p className="font-mono text-xs text-neutral-400 break-all flex-1 text-center group-hover:text-neutral-300">
                {wallet.smartWallet.toString()}
            </p>
        </div>
        
        <button 
            onClick={copyAddress} 
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                copied 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied to clipboard
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    Copy Address
                </>
            )}
        </button>
      </div>
    </div>
  );
}
