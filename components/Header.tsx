"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/botchain";
import { ShieldAlert, Wallet, ExternalLink, LogOut, AlertTriangle, CheckCircle2 } from "lucide-react";

export function Header() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: balanceData } = useBalance({
    address,
    chainId: botchainTestnet.id,
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090C]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-900/60 to-emerald-950/60 border border-white/10 shadow-lg shadow-purple-950/30">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white">
                LAST<span className="text-emerald-400">STAND</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-gray-300">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-tight hidden sm:block">
              One Life. One Chance.
            </p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center gap-3">
          {/* Botchain Testnet Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? isWrongNetwork
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-400 shadow-sm shadow-emerald-400"
                  : "bg-gray-500"
              }`}
            />
            <span className="text-gray-300 font-medium">Botchain Testnet</span>
            <span className="text-gray-500 font-mono text-[10px]">(968)</span>
          </div>

          {/* Network Warning Button if on wrong chain */}
          {isWrongNetwork && (
            <button
              onClick={() => switchChain?.({ chainId: botchainTestnet.id })}
              disabled={isSwitching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isSwitching ? "Switching..." : "Switch to Botchain"}</span>
            </button>
          )}

          {/* Wallet Button */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-medium text-sm shadow-lg shadow-purple-900/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-panel border border-white/10 text-sm transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-gray-200">
                  {address ? formatAddress(address) : "Connected"}
                </span>
                {balanceData && (
                  <span className="hidden sm:inline-block text-xs font-mono text-gray-400 border-l border-white/10 pl-2">
                    {parseFloat(balanceData.formatted).toFixed(2)} BOT
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-panel border border-white/10 shadow-2xl p-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 text-xs">
                    <p className="text-gray-400">Connected as</p>
                    <p className="font-mono text-gray-200 truncate">{address}</p>
                    {balanceData && (
                      <p className="text-emerald-400 font-mono mt-1">
                        {parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}
                      </p>
                    )}
                  </div>

                  <a
                    href={`https://scan.bohr.life/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    <span>View on Botchain Explorer</span>
                  </a>

                  <button
                    onClick={() => {
                      disconnect();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
