import { Challenge, DangerLevel } from "./types";

/**
 * Helper to obtain a cryptographically secure random integer in [min, max] inclusive.
 * Uses crypto.getRandomValues() - NEVER Math.random().
 */
export function getSecureRandomInt(min: number, max: number): number {
  if (min > max) throw new Error("min cannot exceed max");
  const range = max - min + 1;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);

  const buffer = new Uint32Array(1);
  let randomVal = 0;

  do {
    crypto.getRandomValues(buffer);
    randomVal = buffer[0];
  } while (randomVal >= limit);

  return min + (randomVal % range);
}

/**
 * Returns a cryptographically secure number between 0 and 99 inclusive.
 */
export function getSecureRoll(): number {
  return getSecureRandomInt(0, 99);
}

export const DANGER_CONFIG = {
  SAFE: {
    fatalChance: 5, // 5% fatal probability
    label: "SAFE",
    badgeClass: "bg-emerald-950/70 text-emerald-400 border-emerald-500/30",
    glowClass: "shadow-emerald-900/20",
    textClass: "text-emerald-400",
  },
  DANGER: {
    fatalChance: 25, // 25% fatal probability
    label: "DANGER",
    badgeClass: "bg-amber-950/70 text-amber-400 border-amber-500/30",
    glowClass: "shadow-amber-900/20",
    textClass: "text-amber-400",
  },
  CRITICAL: {
    fatalChance: 50, // 50% fatal probability
    label: "CRITICAL",
    badgeClass: "bg-rose-950/70 text-rose-400 border-rose-500/30",
    glowClass: "shadow-rose-900/20",
    textClass: "text-rose-400",
  },
} as const;

// Challenge pool curated with atmospheric survival situations
const SAFE_CHALLENGES: Omit<Challenge, "id" | "dangerLevel" | "fatalChance">[] = [
  {
    title: "Hidden Bunker",
    description: "You discover an intact subterranean fallout shelter with purified water reservoirs.",
    environment: "Subterranean Ruins",
    advice: "Low probability of collapse. High ground advantage.",
  },
  {
    title: "Dormant Beacon",
    description: "An abandoned relay beacon emits an encrypted frequency, illuminating a secluded safe corridor.",
    environment: "Relay Outpost",
    advice: "Sensors report zero biological activity in the immediate vicinity.",
  },
  {
    title: "Preserved Rations Cache",
    description: "A locked military supply crate rests inside a reinforced drainage duct.",
    environment: "Underground Canal",
    advice: "Area is tranquil and sheltered from the toxic acid rain.",
  },
  {
    title: "Ancient Filtration Spring",
    description: "Natural geothermal springs trickle through basalt rocks, offering uncontaminated water.",
    environment: "Basalt Cavern",
    advice: "Clean steam shields your thermal silhouette.",
  },
  {
    title: "Fortified Watchtower",
    description: "An old concrete watchtower with intact perimeter fences and clear lines of sight.",
    environment: "Overlook Ridge",
    advice: "Minimal hazard. Excellent vantage point for spotting anomalies.",
  },
];

const DANGER_CHALLENGES: Omit<Challenge, "id" | "dangerLevel" | "fatalChance">[] = [
  {
    title: "Rusting Chasm Suspension",
    description: "You must cross a fractured suspension bridge swaying violently above an abyss.",
    environment: "Shattered Gorge",
    advice: "Cables are frayed and snapping under sudden gust winds.",
  },
  {
    title: "Stalking in the Perimeter",
    description: "Something is stalking your footsteps just outside the perimeter lights.",
    environment: "Dead Forest",
    advice: "Unidentified predatory lifeform. Maintain defensive posture.",
  },
  {
    title: "Electrified Floodwaters",
    description: "Submerged power conduits discharge erratic arcs across the only flooded tunnel forward.",
    environment: "Submerged Metro",
    advice: "Water conductivity poses shock hazards. Timing is crucial.",
  },
  {
    title: "Rogue Sentinel Drone",
    description: "A malfunctioning automated patrol drone sweeps the corridor with targeted infrared lasers.",
    environment: "Industrial Complex",
    advice: "Blind spots exist between laser sweeps, but sensors are hair-trigger.",
  },
  {
    title: "Suffocating Miasma",
    description: "A dense cloud of caustic sulfur gas settles into the low-lying trench ahead.",
    environment: "Sulfur Trench",
    advice: "Respirator filter is degraded. Rapid transit required.",
  },
];

const CRITICAL_CHALLENGES: Omit<Challenge, "id" | "dangerLevel" | "fatalChance">[] = [
  {
    title: "Apex Stalker Ambush",
    description: "A colossal mutated predator corners you at a dead-end corridor with bare concrete walls.",
    environment: "Blast Chamber",
    advice: "50% survival probability. A single hesitation will be fatal.",
  },
  {
    title: "Catastrophic Core Meltdown",
    description: "The reactor containment wall breaches; a kinetic shockwave and extreme thermal flare erupt.",
    environment: "Sub-Level Reactor",
    advice: "Instantaneous blast radius. Dive for the heavy emergency bulkheads.",
  },
  {
    title: "Swarming Carrion Brood",
    description: "Vents rupture overhead as hundreds of ravenous insectoid scavengers descend from the ceiling.",
    environment: "Ventilation Hub",
    advice: "Extreme threat density. Fire suppression or reckless breakthrough required.",
  },
  {
    title: "Collapsing Maglev Tunnel",
    description: "The entire tunnel ceiling gives way in a seismic collapse, hurtling tons of reinforced debris.",
    environment: "Transit Tube",
    advice: "No retreat. Only relentless forward momentum can clear the cave-in.",
  },
  {
    title: "Anomalous Singularity",
    description: "A gravitational vortex pulls nearby matter toward a tearing spacetime rift.",
    environment: "Zero Facility",
    advice: "Gravitational shear is tearing the floor apart. Anchor yourself immediately.",
  },
];

/**
 * Generates a challenge for the specified round using crypto.getRandomValues().
 * Distribution:
 * - Early rounds (1-3): Higher chance of SAFE (50%), DANGER (40%), CRITICAL (10%)
 * - Mid rounds (4-7): Balanced (SAFE 30%, DANGER 50%, CRITICAL 20%)
 * - Late rounds (8-10): Intense (SAFE 20%, DANGER 45%, CRITICAL 35%)
 */
export function generateChallenge(roundNumber: number): Challenge {
  const roll = getSecureRoll(); // 0 to 99

  let dangerLevel: DangerLevel;

  if (roundNumber <= 3) {
    if (roll < 50) dangerLevel = "SAFE";
    else if (roll < 90) dangerLevel = "DANGER";
    else dangerLevel = "CRITICAL";
  } else if (roundNumber <= 7) {
    if (roll < 30) dangerLevel = "SAFE";
    else if (roll < 80) dangerLevel = "DANGER";
    else dangerLevel = "CRITICAL";
  } else {
    if (roll < 20) dangerLevel = "SAFE";
    else if (roll < 65) dangerLevel = "DANGER";
    else dangerLevel = "CRITICAL";
  }

  const config = DANGER_CONFIG[dangerLevel];
  let pool = SAFE_CHALLENGES;
  if (dangerLevel === "DANGER") pool = DANGER_CHALLENGES;
  if (dangerLevel === "CRITICAL") pool = CRITICAL_CHALLENGES;

  const itemIndex = getSecureRandomInt(0, pool.length - 1);
  const selected = pool[itemIndex];

  return {
    id: `round-${roundNumber}-${Date.now()}-${getSecureRandomInt(1000, 9999)}`,
    title: selected.title,
    description: selected.description,
    dangerLevel,
    fatalChance: config.fatalChance,
    environment: selected.environment,
    advice: selected.advice,
  };
}

/**
 * Evaluates whether player survives the challenge.
 * Returns true if survived, false if fatal.
 * Uses crypto.getRandomValues() exclusively.
 */
export function evaluateChallengeSurvival(fatalChance: number): {
  survived: boolean;
  roll: number;
} {
  const roll = getSecureRoll(); // 0 - 99
  // If roll < fatalChance, the encounter is fatal.
  // E.g., for SAFE (fatalChance 5): rolls 0..4 are fatal (5%), 5..99 survive (95%).
  // For CRITICAL (fatalChance 50): rolls 0..49 are fatal (50%), 50..99 survive (50%).
  const survived = roll >= fatalChance;
  return { survived, roll };
}
