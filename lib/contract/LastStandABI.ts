export const LAST_STAND_ABI = [
  {
    type: "function",
    name: "MAX_ROUNDS",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8", name: "" }],
  },
  {
    type: "function",
    name: "recordRun",
    stateMutability: "nonpayable",
    inputs: [
      { type: "uint8", name: "score" },
      { type: "uint8", name: "roundsCompleted" },
    ],
    outputs: [{ type: "uint256", name: "runId" }],
  },
  {
    type: "function",
    name: "getTotalRuns",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256", name: "" }],
  },
  {
    type: "function",
    name: "getRun",
    stateMutability: "view",
    inputs: [{ type: "uint256", name: "runId" }],
    outputs: [
      {
        type: "tuple",
        name: "",
        components: [
          { type: "uint256", name: "runId" },
          { type: "address", name: "player" },
          { type: "uint8", name: "score" },
          { type: "uint8", name: "roundsCompleted" },
          { type: "uint256", name: "timestamp" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getPlayerRunCount",
    stateMutability: "view",
    inputs: [{ type: "address", name: "playerAddress" }],
    outputs: [{ type: "uint256", name: "" }],
  },
  {
    type: "function",
    name: "getPlayerRun",
    stateMutability: "view",
    inputs: [
      { type: "address", name: "playerAddress" },
      { type: "uint256", name: "index" },
    ],
    outputs: [
      {
        type: "tuple",
        name: "",
        components: [
          { type: "uint256", name: "runId" },
          { type: "address", name: "player" },
          { type: "uint8", name: "score" },
          { type: "uint8", name: "roundsCompleted" },
          { type: "uint256", name: "timestamp" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "RunRecorded",
    inputs: [
      { type: "uint256", name: "runId", indexed: true },
      { type: "address", name: "player", indexed: true },
      { type: "uint8", name: "score", indexed: false },
      { type: "uint8", name: "roundsCompleted", indexed: false },
      { type: "uint256", name: "timestamp", indexed: false },
    ],
  },
  {
    type: "error",
    name: "InvalidScore",
    inputs: [
      { type: "uint8", name: "score" },
      { type: "uint8", name: "maxAllowed" },
    ],
  },
  {
    type: "error",
    name: "InvalidRounds",
    inputs: [
      { type: "uint8", name: "rounds" },
      { type: "uint8", name: "maxAllowed" },
    ],
  },
  {
    type: "error",
    name: "ScoreExceedsRounds",
    inputs: [
      { type: "uint8", name: "score" },
      { type: "uint8", name: "roundsCompleted" },
    ],
  },
  {
    type: "error",
    name: "RunNotFound",
    inputs: [{ type: "uint256", name: "runId" }],
  },
  {
    type: "error",
    name: "IndexOutOfBounds",
    inputs: [
      { type: "uint256", name: "index" },
      { type: "uint256", name: "total" },
    ],
  },
] as const;
