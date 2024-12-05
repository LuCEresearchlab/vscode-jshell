import fs from 'fs';
import path from 'path';
import { posix } from 'path';
import * as vscode from 'vscode';

import {
  getShellArgs,
  getShellPath,
} from './config';

function getClassPath(
  workspaceUri: vscode.Uri,
  classPathFileUri: vscode.Uri,
): string {
  const contents = fs.readFileSync(classPathFileUri.fsPath, 'utf-8');
  return contents
    .replace('\r\n', '\n') // CRLF -> LF
    .replace('\r', '\n') // CR -> LF
    .split('\n') // Split LF
    .filter(line => line.length > 0) // Non-empty
    .filter(path => {
      const uri = workspaceUri.with({
        path: posix.join(workspaceUri.path, ...path.split('/')),
      });
      return fs.existsSync(uri.fsPath);
    }) // Entry exists
    .join(path.delimiter);
}

export function createTerminalProfile(): vscode.TerminalProfile {
  let cwd: string | undefined;

  const shellArgs: string[] = getShellArgs();

  if (vscode.workspace.workspaceFolders) {
    const folderUri = vscode.workspace.workspaceFolders[0].uri;

    // Add additional entries to the classpath
    const cpUri = folderUri.with({
      path: posix.join(folderUri.path, '.vscode', 'class-path.jsh'),
    });

    // Execute code when the shell is started (e.g. imports)
    const initJshUri = folderUri.with({
      path: posix.join(folderUri.path, '.vscode', 'init.jsh'),
    });

    try {
      if (fs.existsSync(folderUri.fsPath)) {
        cwd = folderUri.fsPath;
      }
      if (fs.existsSync(cpUri.fsPath)) {
        const classPath = getClassPath(folderUri, cpUri);
        if (classPath.length > 0) {
          shellArgs.push('--class-path');
          shellArgs.push(classPath);
        }
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
