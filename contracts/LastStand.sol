// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LastStand
 * @notice Survival mini-game run recorder for Botchain Testnet.
 * Tagline: One Life. One Chance. How Long Can You Survive?
 */
contract LastStand {
    uint8 public constant MAX_ROUNDS = 10;

    struct Run {
        uint256 runId;
        address player;
        uint8 score;
        uint8 roundsCompleted;
        uint256 timestamp;
    }

    // Global run counter
    uint256 private _totalRuns;

    // Run storage: runId => Run
    mapping(uint256 => Run) private _runs;

    // Player run index list: player => array of runIds
    mapping(address => uint256[]) private _playerRunIds;

    // Events
    event RunRecorded(
        uint256 indexed runId,
        address indexed player,
        uint8 score,
        uint8 roundsCompleted,
        uint256 timestamp
    );

    // Errors
    error InvalidScore(uint8 score, uint8 maxAllowed);
    error InvalidRounds(uint8 rounds, uint8 maxAllowed);
    error ScoreExceedsRounds(uint8 score, uint8 roundsCompleted);
    error RunNotFound(uint256 runId);
    error IndexOutOfBounds(uint256 index, uint256 total);

    /**
     * @notice Record a completed survival run for msg.sender.
     * @param score Final survival points earned (0 - 10).
     * @param roundsCompleted Total rounds completed/faced (0 - 10).
     * @return runId The unique identifier of the recorded run.
     */
    function recordRun(uint8 score, uint8 roundsCompleted) external returns (uint256 runId) {
        if (score > MAX_ROUNDS) {
            revert InvalidScore(score, MAX_ROUNDS);
        }
        if (roundsCompleted > MAX_ROUNDS) {
            revert InvalidRounds(roundsCompleted, MAX_ROUNDS);
        }
        if (score > roundsCompleted) {
            revert ScoreExceedsRounds(score, roundsCompleted);
        }

        _totalRuns++;
        runId = _totalRuns;

        Run memory newRun = Run({
            runId: runId,
            player: msg.sender,
            score: score,
            roundsCompleted: roundsCompleted,
            timestamp: block.timestamp
        });

        _runs[runId] = newRun;
        _playerRunIds[msg.sender].push(runId);

        emit RunRecorded(runId, msg.sender, score, roundsCompleted, block.timestamp);
    }

    /**
     * @notice Total runs recorded globally across all players.
     */
    function getTotalRuns() external view returns (uint256) {
        return _totalRuns;
    }

    /**
     * @notice Retrieve details of a run by its unique ID.
     * @param runId The unique run ID (1-indexed).
     */
    function getRun(uint256 runId) external view returns (Run memory) {
        if (runId == 0 || runId > _totalRuns) {
            revert RunNotFound(runId);
        }
        return _runs[runId];
    }

    /**
     * @notice Number of runs recorded by a specific player address.
     * @param playerAddress The player wallet address.
     */
    function getPlayerRunCount(address playerAddress) external view returns (uint256) {
        return _playerRunIds[playerAddress].length;
    }

    /**
     * @notice Retrieve a player's run by index in their personal history.
     * @param playerAddress The player wallet address.
     * @param index Index from 0 to getPlayerRunCount(playerAddress) - 1.
     */
    function getPlayerRun(address playerAddress, uint256 index) external view returns (Run memory) {
        uint256 count = _playerRunIds[playerAddress].length;
        if (index >= count) {
            revert IndexOutOfBounds(index, count);
        }
        uint256 runId = _playerRunIds[playerAddress][index];
        return _runs[runId];
    }
}
