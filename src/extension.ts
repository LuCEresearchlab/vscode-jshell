import * as vscode from "vscode";
import { openJShellTerminal } from "./commands";
import { createTerminalProfile } from "./shell";
import { Api, VsJShellApi } from "./api";

export function activate(context: vscode.ExtensionContext): VsJShellApi {
  // Terminal Profile
  vscode.window.registerTerminalProfileProvider("vs-jshell:terminal-profile", {
    provideTerminalProfile: _ => createTerminalProfile()
  });

  // Commands
  vscode.commands.registerCommand(
    "vs-jshell:cmd-open-term",
    openJShellTerminal,
  );

  return Api;
}

export function deactivate() {
}


