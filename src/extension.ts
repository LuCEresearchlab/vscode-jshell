import * as vscode from 'vscode';
import { createTerminalProfile } from './shell';

export function activate(context: vscode.ExtensionContext) {
  const profile = {
    provideTerminalProfile(
      token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TerminalProfile> {
      return createTerminalProfile();
    }
  };

  vscode.window.registerTerminalProfileProvider('vs-jshell:terminal-profile', profile);
}

export function deactivate() {
}


