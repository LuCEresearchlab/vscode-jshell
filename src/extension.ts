import { posix } from 'path';
import * as vscode from 'vscode';

import fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const profile = {
    provideTerminalProfile(
      token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TerminalProfile> {
      let cwd: string | undefined;
      let shellArgs: string[] = [];
      if (vscode.workspace.workspaceFolders) {
        const folderUri = vscode.workspace.workspaceFolders[0].uri;
        const initJshUri = folderUri.with({
          path: posix.join(folderUri.path, '.vscode', 'init.jsh'),
        });
        try {
          if (fs.existsSync(folderUri.fsPath)) {
            cwd = folderUri.fsPath;
          }
          if (fs.existsSync(initJshUri.fsPath)) {
            shellArgs = [initJshUri.fsPath];
          }
        } catch {
          // Ignored
        }
      }

      return {
        options: {
          name: 'JShell',
          shellPath: 'jshell',
          shellArgs,
          cwd,
        },
      };
    }
  };

  vscode.window.registerTerminalProfileProvider('vs-jshell:terminal-profile', profile);
}

export function deactivate() {
}
