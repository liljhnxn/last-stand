"use client";

import React, { useState } from "react";
import { Challenge, DangerLevel } from "@/lib/game/types";
import { DANGER_CONFIG } from "@/lib/game/challenges";
import {
  ShieldAlert,
  Flame,
  ArrowRight,
  LogOut,
  AlertTriangle,
  Compass,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";

interface ActiveGameProps {
  currentRound: number;
  survivalScore: number;
  maxRounds?: number;
  currentChallenge: Challenge;
  onContinue: () => void;
  onEndRun: () => void;
  isProcessing?: boolean;
}

export function ActiveGame({
  currentRound,
  survivalScore,
  maxRounds = 10,
  currentChallenge,
  onContinue,
  onEndRun,
  isProcessing = false,
}: ActiveGameProps) {
  const [animatingCard, setAnimatingCard] = useState(false);
  const danger = DANGER_CONFIG[currentChallenge.dangerLevel];

  const handleContinueClick = () => {
    if (isProcessing) return;
    setAnimatingCard(true);
    setTimeout(() => {
      onContinue();
      setAnimatingCard(false);
    }, 150);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Top Status Bar: Round & Survival Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-surface border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold font-mono">
            {currentRound}
          </div>
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-gray-400">
              Current Encounter
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Round {currentRound} of {maxRounds}</span>
              {currentRound === maxRounds && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  FINAL ROUND
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Survival Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-400">
              Survival Score
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {survivalScore} PTS
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 10-Round Segmented Progress Bar */}
      <div className="mb-8 p-3 rounded-xl bg-surface/80 border border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2 px-1">
          <span>PROGRESSION</span>
          <span>{Math.round(((currentRound - 1) / maxRounds) * 100)}% COMPLETE</span>
        </div>
        <div className="grid grid-cols-10 gap-1.5 h-3">
          {Array.from({ length: maxRounds }).map((_, index) => {
            const roundIndex = index + 1;
            const isCompleted = roundIndex < currentRound;
            const isCurrent = roundIndex === currentRound;

            return (
              <div
                key={index}
                className={`relative rounded-md transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                    : isCurrent
                    ? "bg-purple-500 animate-pulse ring-2 ring-purple-400/40"
                    : "bg-white/[0.06]"
                }`}
                title={`Round ${roundIndex}`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Challenge Card */}
      <div
        className={`relative overflow-hidden rounded-3xl survival-panel p-6 sm:p-8 transition-all duration-300 ${
          animatingCard ? "scale-98 opacity-80" : "scale-100 opacity-100"
        } ${danger.glowClass}`}
      >
        {/* Ambient Top Glow corresponding to danger level */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 blur-3xl rounded-full opacity-30 pointer-events-none ${
            currentChallenge.dangerLevel === "SAFE"
              ? "bg-emerald-500"
              : currentChallenge.dangerLevel === "DANGER"
              ? "bg-amber-500"
              : "bg-rose-500"
          }`}
        />

        {/* Card Header: Environment & Danger Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Compass className="w-4 h-4 text-purple-400" />
            <span className="uppercase tracking-wider">{currentChallenge.environment}</span>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono border ${danger.badgeClass}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{danger.label}</span>
            <span className="text-gray-400 font-normal">({danger.fatalChance}% Fatal)</span>
          </div>
        </div>

        {/* Challenge Body */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {currentChallenge.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6 font-normal">
            &ldquo;{currentChallenge.description}&rdquo;
          </p>

          {/* Tactical Advice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-400">
            <Radio className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-300 font-mono uppercase mr-2">
                Scanner Feed:
              </span>
              <span>{currentChallenge.advice}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: CONTINUE vs END RUN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* CONTINUE Button */}
          <button
            onClick={handleContinueClick}
            disabled={isProcessing}
            className={`relative group overflow-hidden py-4 px-6 rounded-2xl font-bold text-base transition-all transform active:scale-98 shadow-xl flex items-center justify-center gap-3 ${
              currentChallenge.dangerLevel === "CRITICAL"
                ? "bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-500 hover:to-purple-600 text-white shadow-rose-950/50"
                : currentChallenge.dangerLevel === "DANGER"
                ? "bg-gradient-to-r from-amber-600 to-purple-700 hover:from-amber-500 hover:to-purple-600 text-white shadow-amber-950/50"
                : "bg-gradient-to-r from-emerald-600 to-purple-700 hover:from-emerald-500 hover:to-purple-600 text-white shadow-emerald-950/50"
            }`}
          >
            <Zap className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="leading-tight">CONTINUE</div>
              <div className="text-[11px] font-normal opacity-80 font-mono">
                Risk fatal encounter • +1 Pt if survived
              </div>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
          </button>

          {/* END RUN Button */}
          <button
            onClick={onEndRun}
            disabled={isProcessing}
            className="py-4 px-6 rounded-2xl bg-surface hover:bg-panel border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-bold text-base transition-all flex items-center justify-center gap-3 active:scale-98"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="leading-tight">END RUN</div>
              <div className="text-[11px] font-normal text-gray-400 font-mono">
                Bank {survivalScore} pts & save on-chain
              </div>
            </div>
          </button>
        </div>

        {/* Informative Subtext */}
        <p className="text-center text-xs text-gray-500 font-mono mt-4">
          Actions execute locally in real-time. Gas fee only applies when saving your final run.
        </p>
      </div>
    </div>
  );
}
