import * as vscode from "vscode";

import { getShellPath } from "./config";
import { getShellArgs } from "./shell";
import { getMainWorkspaceUri } from "./utils";

export function openJShellTerminal(): vscode.Terminal {
  const terminal = vscode.window.createTerminal({
    name: "JShell",
    shellPath: getShellPath(),
    shellArgs: getShellArgs(),
    cwd: getMainWorkspaceUri(),
    iconPath: new vscode.ThemeIcon("coffee"),
    isTransient: true,
  });
  terminal.show();
  return terminal;
}
