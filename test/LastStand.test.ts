import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { LastStand } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LastStand Smart Contract", function () {
  let lastStand: LastStand;
  let owner: HardhatEthersSigner;
  let player1: HardhatEthersSigner;
  let player2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    const LastStandFactory = await ethers.getContractFactory("LastStand");
    lastStand = (await LastStandFactory.deploy()) as LastStand;
    await lastStand.waitForDeployment();
  });

  describe("Initial State", function () {
    it("should start with 0 total runs", async function () {
      expect(await lastStand.getTotalRuns()).to.equal(0);
    });

    it("should return 0 player run count for a new address", async function () {
      expect(await lastStand.getPlayerRunCount(player1.address)).to.equal(0);
    });
  });

  describe("Record Run - Success & Data Integrity", function () {
    it("should successfully record a run and emit RunRecorded event", async function () {
      const score = 7;
      const roundsCompleted = 8;

      const tx = await lastStand.connect(player1).recordRun(score, roundsCompleted);
      const receipt = await tx.wait();

      expect(await lastStand.getTotalRuns()).to.equal(1);
      expect(await lastStand.getPlayerRunCount(player1.address)).to.equal(1);

      // Verify event emission
      await expect(tx)
        .to.emit(lastStand, "RunRecorded")
        .withArgs(
          1, // runId
          player1.address,
          score,
          roundsCompleted,
          (timestamp: bigint) => timestamp > 0n
        );

      // Retrieve via getRun
      const run = await lastStand.getRun(1);
      expect(run.runId).to.equal(1);
      expect(run.player).to.equal(player1.address);
      expect(run.score).to.equal(score);
      expect(run.roundsCompleted).to.equal(roundsCompleted);
      expect(run.timestamp).to.be.gt(0);

      // Retrieve via getPlayerRun
      const playerRun = await lastStand.getPlayerRun(player1.address, 0);
      expect(playerRun.runId).to.equal(1);
      expect(playerRun.player).to.equal(player1.address);
      expect(playerRun.score).to.equal(score);
      expect(playerRun.roundsCompleted).to.equal(roundsCompleted);
    });

    it("should increment unique run IDs properly for multiple runs", async function () {
      await lastStand.connect(player1).recordRun(3, 4);
      await lastStand.connect(player2).recordRun(10, 10);
      await lastStand.connect(player1).recordRun(5, 6);

      expect(await lastStand.getTotalRuns()).to.equal(3);

      const run1 = await lastStand.getRun(1);
      const run2 = await lastStand.getRun(2);
      const run3 = await lastStand.getRun(3);

      expect(run1.player).to.equal(player1.address);
      expect(run2.player).to.equal(player2.address);
      expect(run3.player).to.equal(player1.address);

      expect(await lastStand.getPlayerRunCount(player1.address)).to.equal(2);
      expect(await lastStand.getPlayerRunCount(player2.address)).to.equal(1);

      const p1FirstRun = await lastStand.getPlayerRun(player1.address, 0);
      const p1SecondRun = await lastStand.getPlayerRun(player1.address, 1);
      expect(p1FirstRun.runId).to.equal(1);
      expect(p1SecondRun.runId).to.equal(3);
    });

    it("should allow a perfect 10 / 10 victory run", async function () {
      await lastStand.connect(player1).recordRun(10, 10);
      const run = await lastStand.getRun(1);
      expect(run.score).to.equal(10);
      expect(run.roundsCompleted).to.equal(10);
    });

    it("should allow a 0 score run if died on round 1", async function () {
      await lastStand.connect(player1).recordRun(0, 1);
      const run = await lastStand.getRun(1);
      expect(run.score).to.equal(0);
      expect(run.roundsCompleted).to.equal(1);
    });
  });

  describe("Validation & Reverts", function () {
    it("should revert if score exceeds MAX_ROUNDS (10)", async function () {
      await expect(
        lastStand.connect(player1).recordRun(11, 10)
      ).to.be.revertedWithCustomError(lastStand, "InvalidScore");
    });

    it("should revert if roundsCompleted exceeds MAX_ROUNDS (10)", async function () {
      await expect(
        lastStand.connect(player1).recordRun(8, 11)
      ).to.be.revertedWithCustomError(lastStand, "InvalidRounds");
    });

    it("should revert if score exceeds roundsCompleted", async function () {
      await expect(
        lastStand.connect(player1).recordRun(6, 5)
      ).to.be.revertedWithCustomError(lastStand, "ScoreExceedsRounds");
    });

    it("should revert when querying non-existent run ID", async function () {
      await expect(lastStand.getRun(0)).to.be.revertedWithCustomError(
        lastStand,
        "RunNotFound"
      );
      await expect(lastStand.getRun(999)).to.be.revertedWithCustomError(
        lastStand,
        "RunNotFound"
      );
    });

    it("should revert when querying out of bounds index for player run", async function () {
      await expect(
        lastStand.getPlayerRun(player1.address, 0)
      ).to.be.revertedWithCustomError(lastStand, "IndexOutOfBounds");

      await lastStand.connect(player1).recordRun(4, 5);

      await expect(
        lastStand.getPlayerRun(player1.address, 1)
      ).to.be.revertedWithCustomError(lastStand, "IndexOutOfBounds");
    });
  });
});
