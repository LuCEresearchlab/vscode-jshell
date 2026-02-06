import * as vscode from "vscode";

import { createTerminalOptions } from "./shell";

export function openJShellTerminal(): vscode.Terminal {
  const terminal = vscode.window.createTerminal(createTerminalOptions());
  terminal.show();
  return terminal;
}
