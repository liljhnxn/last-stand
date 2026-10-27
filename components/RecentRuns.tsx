"use client";

import React from "react";
import { RunHistoryItem } from "@/lib/game/types";
import { BOTCHAIN_EXPLORER_URL } from "@/lib/contract/config";
import {
  History,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Award,
  Layers,
  AlertCircle,
  Loader2,
  Trophy,
} from "lucide-react";

interface RecentRunsProps {
  runs: RunHistoryItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isConnected: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function RecentRuns({
  runs,
  isLoading,
  isError,
  errorMessage,
  isConnected,
  onRefresh,
  isRefreshing = false,
}: RecentRunsProps) {
  const formatTimestamp = (ts: bigint) => {
    try {
      const date = new Date(Number(ts) * 1000);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown Date";
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10 mt-12">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <span>ON-CHAIN SURVIVAL LOG</span>
              {isConnected && runs.length > 0 && (
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  {runs.length} {runs.length === 1 ? "run" : "runs"}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Direct verification from Botchain Testnet contract
            </p>
          </div>
        </div>

        {isConnected && onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing || isLoading}
            className="px-3 py-1.5 rounded-lg bg-surface hover:bg-panel border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Loader2 className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-400" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh Logs"}</span>
          </button>
        )}
      </div>

      {/* Content States */}
      {!isConnected ? (
        <div className="p-8 rounded-2xl bg-surface/60 border border-white/5 text-center">
          <ShieldAlert className="w-10 h-10 text-gray-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-gray-300 mb-1">
            Wallet Disconnected
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Connect your Web3 wallet to read your personal survival records directly from the Botchain smart contract.
          </p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-4 rounded-2xl bg-surface/50 border border-white/5 animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-white/5 rounded" />
                  <div className="w-32 h-3 bg-white/5 rounded" />
                </div>
              </div>
              <div className="w-20 h-6 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold mb-1">Failed to Load Run History</strong>
            <p className="text-rose-400/80">
              {errorMessage || "Unable to query Botchain RPC. Please check your network connection."}
            </p>
          </div>
        </div>
      ) : runs.length === 0 ? (
        <div className="p-10 rounded-2xl bg-surface/60 border border-white/5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-3 text-gray-500">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-300 mb-1">No Runs Recorded Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven&apos;t stamped any survival runs to the blockchain yet. Complete a run above and click &quot;SAVE RUN&quot; to etch your score forever!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((item) => {
            const isPerfect = item.score === 10;
            return (
              <div
                key={item.runId.toString()}
                className="p-4 rounded-2xl bg-surface hover:bg-panel border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Run Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                      isPerfect
                        ? "bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/40"
                        : item.score >= 7
                        ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                        : "bg-purple-950/60 border-purple-500/30 text-purple-300"
                    }`}
                  >
                    {isPerfect ? <Trophy className="w-5 h-5 text-amber-400" /> : `#${item.runId.toString()}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        Run #{item.runId.toString()}
                      </span>
                      {isPerfect && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          PERFECT SURVIVAL
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Rounds Badges */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-mono uppercase text-gray-500">
                      Rounds Faced
                    </div>
                    <div className="text-xs font-mono text-gray-300">
                      {item.roundsCompleted} / 10 Rounds
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-l border-white/10 pl-4">
                    <div className="text-[10px] font-mono uppercase text-gray-500">
                      Final Score
                    </div>
                    <div className="text-sm font-black font-mono text-emerald-400">
                      {item.score} PTS
                    </div>
                  </div>

                  {/* Explorer Link */}
                  <a
                    href={
                      item.txHash
                        ? `${BOTCHAIN_EXPLORER_URL}/tx/${item.txHash}`
                        : `${BOTCHAIN_EXPLORER_URL}/address/${item.player}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="View on Botchain Explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
