import deployedAddressJson from "./deployed-address.json";

// Default or configured address
export const LAST_STAND_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_LASTSTAND_CONTRACT_ADDRESS ||
  deployedAddressJson.address ||
  ""
) as `0x${string}`;

export const BOTCHAIN_EXPLORER_URL = "https://scan.bohr.life";
export const BOTCHAIN_CHAIN_ID = 968;
