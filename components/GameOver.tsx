"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { GameStatus } from "@/lib/game/types";
import {
  Trophy,
  Skull,
  ShieldCheck,
  RotateCcw,
  Save,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  Wallet,
} from "lucide-react";

interface GameOverProps {
  status: GameStatus; // "FATAL" | "SURVIVED_ALL" | "IDLE" (if voluntarily ended)
  voluntarilyEnded?: boolean;
  score: number;
  roundsCompleted: number;
  onPlayAgain: () => void;
  onSaveRun: () => void;
  isSaving: boolean;
  isSuccessSaved: boolean;
  savedTxHash: string | null;
  errorMessage: string | null;
  isConnected: boolean;
  onConnectWallet: () => void;
  contractConfigured: boolean;
}

export function GameOver({
  status,
  voluntarilyEnded = false,
  score,
  roundsCompleted,
  onPlayAgain,
  onSaveRun,
  isSaving,
  isSuccessSaved,
  savedTxHash,
  errorMessage,
  isConnected,
  onConnectWallet,
  contractConfigured,
}: GameOverProps) {
  const isVictory = status === "SURVIVED_ALL";

  useEffect(() => {
    if (isVictory) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10B981", "#8B5CF6", "#F59E0B", "#FFFFFF"],
        });
      } catch {
        // ignore if canvas-confetti is not loaded
      }
    }
  }, [isVictory]);

  const getPerformanceMessage = () => {
    if (isVictory) {
      return "Apex Survivor — You conquered all 10 encounters and claimed ultimate survival glory!";
    }
    if (voluntarilyEnded) {
      return `Wise Tactician — You voluntarily evacuated after round ${roundsCompleted} with a solid ${score} points banked.`;
    }
    if (score >= 7) {
      return "Veteran Survivor — Outstanding resilience in the face of brutal hazards.";
    }
    if (score >= 4) {
      return "Tenacious Fighter — You held your ground through mid-tier horrors.";
    }
    return "Fallen Recruit — The wasteland showed no mercy. Regroup and fight again.";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl survival-panel p-6 sm:p-10 text-center">
        {/* Glow ambient background */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 blur-3xl rounded-full opacity-35 pointer-events-none ${
            isVictory
              ? "bg-emerald-500"
              : voluntarilyEnded
              ? "bg-purple-500"
              : "bg-rose-600"
          }`}
        />

        {/* Icon & Title Banner */}
        <div className="relative mb-6">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl border flex items-center justify-center mb-4 shadow-xl ${
              isVictory
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-400 shadow-emerald-950/60"
                : voluntarilyEnded
                ? "bg-purple-950/70 border-purple-500/40 text-purple-400 shadow-purple-950/60"
                : "bg-rose-950/70 border-rose-500/40 text-rose-400 shadow-rose-950/60"
            }`}
          >
            {isVictory ? (
              <Trophy className="w-10 h-10 animate-bounce" />
            ) : voluntarilyEnded ? (
              <ShieldCheck className="w-10 h-10" />
            ) : (
              <Skull className="w-10 h-10" />
            )}
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-1">
            RUN TERMINATION REPORT
          </span>

          <h2
            className={`text-3xl sm:text-4xl font-black uppercase tracking-tight ${
              isVictory
                ? "text-emerald-400"
                : voluntarilyEnded
                ? "text-purple-300"
                : "text-rose-400"
            }`}
          >
            {isVictory
              ? "SURVIVED ALL ROUNDS"
              : voluntarilyEnded
              ? "RUN RETIRED & BANKED"
              : "GAME OVER — YOU PERISHED"}
          </h2>
        </div>

        {/* Score & Rounds Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-xs uppercase font-mono text-gray-400 mb-1">
              Final Survival Score
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              {score}{" "}
              <span className="text-sm font-normal text-emerald-400">/ 10</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-xs uppercase font-mono text-gray-400 mb-1">
              Rounds Completed
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              {roundsCompleted}{" "}
              <span className="text-sm font-normal text-purple-400">/ 10</span>
            </div>
          </div>
        </div>

        {/* Performance Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-8 max-w-lg mx-auto bg-white/[0.02] p-3 rounded-xl border border-white/5">
          {getPerformanceMessage()}
        </p>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-1">
              <strong className="block font-semibold">Transaction Error</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success notification if saved */}
        {isSuccessSaved && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block font-semibold">Run Recorded On-Chain!</strong>
                <span className="text-gray-300">
                  Your score has been permanently stamped to Botchain Testnet.
                </span>
              </div>
            </div>
            {savedTxHash && (
              <a
                href={`https://scan.bohr.life/tx/${savedTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs transition-colors shrink-0"
              >
                <span>View Tx</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* SAVE RUN button */}
          {!isSuccessSaved ? (
            !isConnected ? (
              <button
                onClick={onConnectWallet}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-950/40 transition-all flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet to Save Run</span>
              </button>
            ) : (
              <button
                onClick={onSaveRun}
                disabled={isSaving || !contractConfigured}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming on Botchain...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>SAVE RUN ON-CHAIN</span>
                  </>
                )}
              </button>
            )
          ) : (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 py-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Saved Successfully</span>
            </div>
          )}

          {/* PLAY AGAIN button */}
          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface hover:bg-panel border border-white/10 hover:border-white/20 text-gray-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
