import fs from 'fs';
import { posix } from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const profile = {
    provideTerminalProfile(
      token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TerminalProfile> {
      let cwd: string | undefined;

      const shellArgs: string[] = getArgumentsFromConfig();

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
            shellArgs.push(initJshUri.fsPath);
          }
        } catch {
          // Ignored
        }
      }

      return {
        options: {
          name: 'JShell',
          shellPath: getShellPath(),
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

function getArgumentsFromConfig() {
  const config = vscode.workspace.getConfiguration('jshell');
  const args: string[] = [];

  const configValues = {
    feedback: config.get<string>('feedback'),
    nativeAccess: config.get<boolean>('nativeAccess'),
    preview: config.get<boolean>('preview'),
    compilerFlags: config.get<string>('compilerFlags'),
    runtimeFlags: config.get<string>('runtimeFlags'),
    remoteRuntimeFlags: config.get<string>('remoteRuntimeFlags'),
  };

  if (configValues.feedback) {
    args.push('--feedback');
    args.push(configValues.feedback);
  }
  if (configValues.nativeAccess) {
    args.push('--enable-native-access');
  }
  if (configValues.preview) {
    args.push('--enable-preview');
  }
  if (configValues.compilerFlags) {
    for (const flag in configValues.compilerFlags.split(' ')) {
      args.push(`-C${flag}`);
    }
  }
  if (configValues.runtimeFlags) {
    for (const flag in configValues.runtimeFlags.split(' ')) {
      args.push(`-J${flag}`);
    }
  }
  if (configValues.remoteRuntimeFlags) {
    for (const flag in configValues.remoteRuntimeFlags.split(' ')) {
      args.push(`-R${flag}`);
    }
  }

  return args;
}

function getShellPath() {
  return vscode.workspace.getConfiguration('jshell').get<string>('shellPath');
}
