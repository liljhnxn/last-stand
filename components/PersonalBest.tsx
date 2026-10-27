"use client";

import React from "react";
import { Trophy, Award, Flame, History, Globe } from "lucide-react";

interface PersonalBestProps {
  personalBestScore: number | null;
  totalPlayerRuns: number;
  totalGlobalRuns: number | null;
  isLoading: boolean;
  isConnected: boolean;
}

export function PersonalBest({
  personalBestScore,
  totalPlayerRuns,
  totalGlobalRuns,
  isLoading,
  isConnected,
}: PersonalBestProps) {
  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 my-8">
        <div className="p-5 rounded-2xl bg-surface/60 border border-white/5 text-center text-xs text-gray-400">
          Connect your wallet to track your on-chain Personal Best and survival history on Botchain Testnet.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Personal Best Card */}
        <div className="p-5 rounded-2xl bg-surface border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              Personal Best
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {isLoading ? (
              <span className="text-gray-500 animate-pulse">...</span>
            ) : personalBestScore !== null ? (
              <>
                {personalBestScore}{" "}
                <span className="text-xs font-normal text-emerald-400">/ 10 PTS</span>
              </>
            ) : (
              <span className="text-xs font-sans text-gray-500 font-normal">No runs saved</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-mono mt-1">Highest on-chain score</p>
        </div>

        {/* Your Total Runs Recorded */}
        <div className="p-5 rounded-2xl bg-surface border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              Your Saved Runs
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {isLoading ? (
              <span className="text-gray-500 animate-pulse">...</span>
            ) : (
              totalPlayerRuns
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-mono mt-1">Recorded on Botchain</p>
        </div>

        {/* Global Total Runs */}
        <div className="p-5 rounded-2xl bg-surface border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              Global Survivals
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {totalGlobalRuns !== null ? (
              totalGlobalRuns
            ) : (
              <span className="text-gray-500 animate-pulse">...</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-mono mt-1">All players combined</p>
        </div>
      </div>
    </div>
  );
}
