"use client";

import React, { useState } from "react";
import { BOTCHAIN_EXPLORER_URL } from "@/lib/contract/config";
import { Terminal, ExternalLink, Settings, Check, Copy } from "lucide-react";

interface ContractBannerProps {
  contractAddress: string;
  onUpdateAddress: (address: string) => void;
}

export function ContractBanner({
  contractAddress,
  onUpdateAddress,
}: ContractBannerProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [inputVal, setInputVal] = useState(contractAddress);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAddress(inputVal.trim());
    setShowConfig(false);
  };

  const isConfigured = Boolean(
    contractAddress && contractAddress.startsWith("0x") && contractAddress.length === 42
  );

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      <div className="p-3.5 rounded-2xl bg-surface/80 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="font-mono text-gray-400 uppercase tracking-wider text-[11px]">
            Contract:
          </span>
          {isConfigured ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-200 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
              </span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy Address"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={`${BOTCHAIN_EXPLORER_URL}/address/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 font-mono"
              >
                <span>Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <span className="font-mono text-amber-400">
              Contract Address Pending Deployment / Configuration
            </span>
          )}
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-gray-400 hover:text-white flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-gray-400" />
          <span>{showConfig ? "Close Settings" : "Configure Contract"}</span>
        </button>
      </div>

      {showConfig && (
        <form
          onSubmit={handleSave}
          className="mt-3 p-4 rounded-2xl bg-panel border border-white/10 text-xs animate-fadeIn"
        >
          <label className="block text-gray-300 font-semibold mb-1">
            LastStand Smart Contract Address (Botchain Testnet)
          </label>
          <p className="text-gray-400 text-[11px] mb-3">
            Paste your deployed contract address here, or run{" "}
            <code className="text-purple-300 font-mono">npm run deploy:botchain</code>.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="0x..."
              className="flex-1 bg-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
            >
              Update Contract
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
