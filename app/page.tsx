"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ActiveGame } from "@/components/ActiveGame";
import { GameOver } from "@/components/GameOver";
import { PersonalBest } from "@/components/PersonalBest";
import { RecentRuns } from "@/components/RecentRuns";
import { ContractBanner } from "@/components/ContractBanner";
import {
  generateChallenge,
  evaluateChallengeSurvival,
} from "@/lib/game/challenges";
import { Challenge, GameStatus, RunHistoryItem } from "@/lib/game/types";
import { LAST_STAND_ABI } from "@/lib/contract/LastStandABI";
import { LAST_STAND_CONTRACT_ADDRESS } from "@/lib/contract/config";
import { botchain } from "@/lib/botchain";
import { ExternalLink, Globe, Compass, Cpu } from "lucide-react";
import {
  useAccount,
  useConnect,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";

export default function LastStandPage() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const publicClient = usePublicClient({ chainId: botchain.id });

  // Custom contract address state (defaults to compiled/env address)
  const [contractAddress, setContractAddress] = useState<string>(
    LAST_STAND_CONTRACT_ADDRESS || ""
  );

  // Gameplay State
  const [gameStatus, setGameStatus] = useState<GameStatus>("IDLE");
  const [voluntarilyEnded, setVoluntarilyEnded] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [survivalScore, setSurvivalScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);

  // On-Chain Save State
  const [isSuccessSaved, setIsSuccessSaved] = useState(false);
  const [savedTxHash, setSavedTxHash] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Wagmi Contract Write
  const {
    data: writeTxHash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
    reset: resetWriteContract,
  } = useWriteContract();

  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({
      hash: writeTxHash,
      chainId: botchain.id,
    });

  // On-Chain History & Personal Best State
  const [recentRuns, setRecentRuns] = useState<RunHistoryItem[]>([]);
  const [personalBestScore, setPersonalBestScore] = useState<number | null>(null);
  const [totalPlayerRuns, setTotalPlayerRuns] = useState(0);
  const [totalGlobalRuns, setTotalGlobalRuns] = useState<number | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isHistoryError, setIsHistoryError] = useState(false);
  const [historyErrorMessage, setHistoryErrorMessage] = useState<string>("");

  // Connect helper
  const handleConnectWallet = () => {
    const injected = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injected) connect({ connector: injected });
  };

  // 1. Fetch On-Chain History from Botchain Smart Contract
  const fetchOnChainData = useCallback(async () => {
    if (!publicClient || !contractAddress || !contractAddress.startsWith("0x")) {
      return;
    }

    try {
      setIsHistoryLoading(true);
      setIsHistoryError(false);
      setHistoryErrorMessage("");

      const targetAddress = contractAddress as `0x${string}`;

      // Fetch Global Total Runs
      try {
        const total = await publicClient.readContract({
          address: targetAddress,
          abi: LAST_STAND_ABI,
          functionName: "getTotalRuns",
        });
        setTotalGlobalRuns(Number(total));
      } catch {
        // contract might not be deployed yet
      }

      // If wallet is connected, fetch personal runs
      if (address) {
        const count = await publicClient.readContract({
          address: targetAddress,
          abi: LAST_STAND_ABI,
          functionName: "getPlayerRunCount",
          args: [address],
        });

        const numCount = Number(count);
        setTotalPlayerRuns(numCount);

        if (numCount === 0) {
          setRecentRuns([]);
          setPersonalBestScore(null);
          setIsHistoryLoading(false);
          return;
        }

        // Fetch runs in reverse order (most recent first)
        const runPromises = [];
        const maxToFetch = Math.min(numCount, 15);
        for (let i = numCount - 1; i >= numCount - maxToFetch; i--) {
          runPromises.push(
            publicClient.readContract({
              address: targetAddress,
              abi: LAST_STAND_ABI,
              functionName: "getPlayerRun",
              args: [address, BigInt(i)],
            })
          );
        }

        const rawRuns = await Promise.all(runPromises);

        let highestScore = 0;
        const formatted: RunHistoryItem[] = rawRuns.map((r) => {
          const runItem = r as {
            runId: bigint;
            player: string;
            score: number;
            roundsCompleted: number;
            timestamp: bigint;
          };
          if (runItem.score > highestScore) {
            highestScore = runItem.score;
          }
          return {
            runId: runItem.runId,
            player: runItem.player,
            score: runItem.score,
            roundsCompleted: runItem.roundsCompleted,
            timestamp: runItem.timestamp,
          };
        });

        setRecentRuns(formatted);
        setPersonalBestScore(highestScore);
      } else {
        setRecentRuns([]);
        setPersonalBestScore(null);
        setTotalPlayerRuns(0);
      }
    } catch (err: unknown) {
      console.warn("Failed to fetch on-chain history:", err);
      setIsHistoryError(true);
      const errObj = err as Error;
      setHistoryErrorMessage(
        errObj?.message || "Could not read records from Botchain Mainnet."
      );
    } finally {
      setIsHistoryLoading(false);
    }
  }, [publicClient, contractAddress, address]);

  // Initial fetch on mount & when wallet / contract changes
  useEffect(() => {
    fetchOnChainData();
  }, [fetchOnChainData]);

  // Watch for transaction confirmation
  useEffect(() => {
    if (isTxConfirmed && writeTxHash) {
      setIsSuccessSaved(true);
      setSavedTxHash(writeTxHash);
      // Automatically refresh history to display new run
      fetchOnChainData();
    }
  }, [isTxConfirmed, writeTxHash, fetchOnChainData]);

  // Watch for write errors
  useEffect(() => {
    if (writeError) {
      const msg = writeError.message || "User rejected or contract reverted.";
      if (msg.includes("User rejected")) {
        setSaveErrorMessage("Transaction was cancelled in your wallet.");
      } else {
        setSaveErrorMessage(msg.slice(0, 160));
      }
    }
  }, [writeError]);

  // 2. Start Survival Game
  const handleStartSurvival = () => {
    setCurrentRound(1);
    setSurvivalScore(0);
    setVoluntarilyEnded(false);
    setIsSuccessSaved(false);
    setSavedTxHash(null);
    setSaveErrorMessage(null);
    resetWriteContract();

    // Generate Round 1 challenge using crypto.getRandomValues()
    const firstChallenge = generateChallenge(1);
    setCurrentChallenge(firstChallenge);
    setGameStatus("PLAYING");
  };

  // 3. Continue to Next Challenge (Risk Death)
  const handleContinue = () => {
    if (!currentChallenge) return;

    // Evaluate survival against the challenge's fatalChance using crypto.getRandomValues()
    const { survived } = evaluateChallengeSurvival(currentChallenge.fatalChance);

    if (!survived) {
      // Player died in this round! Run terminates.
      setGameStatus("FATAL");
      setVoluntarilyEnded(false);
      return;
    }

    // Player survived this round!
    const newScore = survivalScore + 1;
    setSurvivalScore(newScore);

    // If completed round 10, victory!
    if (currentRound >= 10) {
      setGameStatus("SURVIVED_ALL");
      setVoluntarilyEnded(false);
      return;
    }

    // Proceed to next round
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    const nextChallenge = generateChallenge(nextRound);
    setCurrentChallenge(nextChallenge);
  };

  // 4. End Run Voluntarily
  const handleEndRun = () => {
    setVoluntarilyEnded(true);
    // Mark as ended run, player keeps current score and completed rounds
    setGameStatus("FATAL"); // Uses GameOver screen with voluntarilyEnded flag
  };

  // 5. Save Run On-Chain
  const handleSaveRun = () => {
    if (!isConnected) {
      handleConnectWallet();
      return;
    }

    if (!contractAddress || !contractAddress.startsWith("0x")) {
      setSaveErrorMessage(
        "Contract address is not configured. Please deploy or set contract address above."
      );
      return;
    }

    setSaveErrorMessage(null);

    try {
      // If player perishes during round X, completed rounds survived is currentRound - 1
      // If voluntarily ended or survived all 10, rounds completed is currentRound
      const finalRoundsCompleted =
        gameStatus === "SURVIVED_ALL" || voluntarilyEnded
          ? currentRound
          : Math.max(survivalScore, currentRound - 1);

      writeContract({
        address: contractAddress as `0x${string}`,
        abi: LAST_STAND_ABI,
        functionName: "recordRun",
        args: [survivalScore, finalRoundsCompleted],
      });
    } catch (err: unknown) {
      const errObj = err as Error;
      setSaveErrorMessage(errObj?.message || "Failed to trigger transaction.");
    }
  };

  const isSaving = isWritePending || isTxConfirming;

  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      <div>
        {/* Header */}
        <Header />

        {/* Contract Address Transparency & Settings */}
        <ContractBanner
          contractAddress={contractAddress}
          onUpdateAddress={(newAddr) => {
            setContractAddress(newAddr);
          }}
        />

        {/* Dynamic Main Stage */}
        {gameStatus === "IDLE" ? (
          <Hero
            onStartSurvival={handleStartSurvival}
            isConnected={isConnected}
            onConnectWallet={handleConnectWallet}
          />
        ) : gameStatus === "PLAYING" && currentChallenge ? (
          <ActiveGame
            currentRound={currentRound}
            survivalScore={survivalScore}
            maxRounds={10}
            currentChallenge={currentChallenge}
            onContinue={handleContinue}
            onEndRun={handleEndRun}
          />
        ) : (
          <GameOver
            status={gameStatus}
            voluntarilyEnded={voluntarilyEnded}
            score={survivalScore}
            roundsCompleted={
              gameStatus === "SURVIVED_ALL" || voluntarilyEnded
                ? currentRound
                : Math.max(survivalScore, currentRound - 1)
            }
            onPlayAgain={handleStartSurvival}
            onSaveRun={handleSaveRun}
            isSaving={isSaving}
            isSuccessSaved={isSuccessSaved}
            savedTxHash={savedTxHash}
            errorMessage={saveErrorMessage}
            isConnected={isConnected}
            onConnectWallet={handleConnectWallet}
            contractConfigured={Boolean(contractAddress)}
          />
        )}

        {/* Personal Best & Global Stats */}
        <PersonalBest
          personalBestScore={personalBestScore}
          totalPlayerRuns={totalPlayerRuns}
          totalGlobalRuns={totalGlobalRuns}
          isLoading={isHistoryLoading}
          isConnected={isConnected}
        />

        {/* Recent Runs History (Connected Wallet from Contract) */}
        <RecentRuns
          runs={recentRuns}
          isLoading={isHistoryLoading}
          isError={isHistoryError}
          errorMessage={historyErrorMessage}
          isConnected={isConnected}
          onRefresh={fetchOnChainData}
          isRefreshing={isHistoryLoading}
        />
      </div>

      {/* BOT Chain Ecosystem Section & Footer */}
      <footer className="w-full border-t border-white/10 pt-12 pb-8 px-4 mt-20 bg-[#060709]/90">
        <div className="max-w-4xl mx-auto">
          {/* Ecosystem Showcase Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface/70 border border-white/10 shadow-xl backdrop-blur-sm mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* BOT Chain Brand & Logo */}
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-black border border-emerald-500/30 shadow-lg shadow-emerald-950/40 overflow-hidden">
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain Logo"
                    className="w-full h-full object-contain p-1"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-wider text-white">
                      BOT <span className="text-emerald-400">CHAIN</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                      Mainnet
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    High-speed EVM blockchain • Chain ID: <span className="font-mono text-gray-300">677</span> • Native Token: <span className="font-mono text-gray-300">BOT</span>
                  </p>
                </div>
              </div>

              {/* Required BOT Chain Ecosystem Links */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all transform active:scale-95 shadow-sm"
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                  <span>BOT Chain Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>

                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-purple-600/20 hover:from-emerald-600/30 hover:to-purple-600/30 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-all transform active:scale-95 shadow-sm"
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                  <span>BOT Chain Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400/70" />
                </a>
              </div>
            </div>
          </div>

          {/* Sub-Footer Links & Legal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono pt-4 border-t border-white/5">
            <div>
              LastStand &copy; {new Date().getFullYear()} • Built natively on BOT Chain Mainnet
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://scan.botchain.ai/address/${contractAddress || LAST_STAND_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Contract Explorer</span>
                <ExternalLink className="w-3 h-3 text-gray-600" />
              </a>
              <span>•</span>
              <a
                href="https://rpc.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                RPC: rpc.botchain.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
