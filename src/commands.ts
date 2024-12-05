import * as vscode from 'vscode';

import { getShellPath } from './config';
import { getShellArgs } from './shell';

export function openJShellTerminal() {
  vscode.window.createTerminal(
    "JShell",
    getShellPath(),
    getShellArgs(),
  ).show(true);
}
