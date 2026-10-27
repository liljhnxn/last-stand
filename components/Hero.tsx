"use client";

import React, { useState } from "react";
import { Skull, ShieldCheck, Flame, AlertOctagon, HelpCircle, ArrowRight, Info, ShieldAlert } from "lucide-react";

interface HeroProps {
  onStartSurvival: () => void;
  isConnected: boolean;
  onConnectWallet: () => void;
}

export function Hero({ onStartSurvival, isConnected, onConnectWallet }: HeroProps) {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="relative py-12 md:py-16 text-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-purple-900/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[350px] h-[250px] bg-emerald-950/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4">
        {/* Survival Status Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300 font-mono mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SURVIVAL PROTOCOL ACTIVE • 10 ROUNDS MAXIMUM</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
          HOW LONG WILL <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">
            YOU LAST?
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Every round brings a new danger. Your next decision could be your last.
          Survive all 10 rounds or voluntarily cash out your survival score.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={onStartSurvival}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-purple-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-emerald-950/40 hover:shadow-emerald-900/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
          >
            <Flame className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">START SURVIVAL</span>
            <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setShowRules(!showRules)}
            className="w-full sm:w-auto px-5 py-4 rounded-xl bg-surface hover:bg-panel border border-white/10 text-gray-300 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>{showRules ? "Hide Survival Guide" : "Survival Guide & Rules"}</span>
          </button>
        </div>

        {/* Wallet Prompt Notice if Not Connected */}
        {!isConnected && (
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-panel/60 border border-white/5 px-4 py-2 rounded-lg">
            <Info className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              You can play offline immediately.{" "}
              <button
                onClick={onConnectWallet}
                className="text-purple-300 hover:text-purple-200 underline underline-offset-2 ml-1"
              >
                Connect wallet
              </button>{" "}
              whenever you wish to permanently record runs on Botchain.
            </span>
          </div>
        )}

        {/* Expanded Survival Rules & Probability Guide */}
        {showRules && (
          <div className="mt-8 text-left bg-surface/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Survival Mechanics & Probability Matrix
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20">
                    SAFE
                  </span>
                  <span className="text-xs font-mono text-emerald-300">5% Fatal</span>
                </div>
                <p className="text-xs text-gray-300">
                  Hidden shelters, fresh springs, or fortified bunkers. 95% survival probability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono uppercase text-amber-400 px-2 py-0.5 rounded bg-amber-500/20">
                    DANGER
                  </span>
                  <span className="text-xs font-mono text-amber-300">25% Fatal</span>
                </div>
                <p className="text-xs text-gray-300">
                  Collapsing bridges, rogue drones, or toxic gas. 75% survival probability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono uppercase text-rose-400 px-2 py-0.5 rounded bg-rose-500/20">
                    CRITICAL
                  </span>
                  <span className="text-xs font-mono text-rose-300">50% Fatal</span>
                </div>
                <p className="text-xs text-gray-300">
                  Apex predators or reactor ruptures. A true coin-flip. High tension.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-300 mb-6">
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>10 Rounds Maximum:</strong> Earn 1 survival point for every round survived. Survive all 10 to claim Ultimate Victory.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Decide Every Round:</strong> Choose <strong>CONTINUE</strong> to risk the next encounter or <strong>END RUN</strong> to lock in your score and save it on-chain.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cryptographic Fairness:</strong> Challenges are generated using Web Crypto API (<code className="font-mono text-purple-300">crypto.getRandomValues()</code>), never standard Math.random().
                </span>
              </p>
            </div>

            {/* Required Security Disclaimer */}
            <div className="p-3.5 rounded-xl bg-panel border border-white/10 text-gray-400 text-[11px] leading-relaxed">
              <strong className="text-gray-200">Security Note:</strong> This first version is a testnet game. The browser controls the challenges and game results, so the game is not cheat-proof or provably fair.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
