import { openJShellTerminal } from "./commands";
import { getShellPath, getShellConfigArgs } from "./config";

export type VsJShellApi = {
  getBinPath: () => string | undefined,
  getConfigArgs: () => string[],
  openTerminal: () => void
};

export const Api: VsJShellApi = {
  getBinPath: getShellPath,
  getConfigArgs: getShellConfigArgs,
  openTerminal: openJShellTerminal,
};
