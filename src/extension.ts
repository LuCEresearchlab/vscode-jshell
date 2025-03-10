import * as vscode from 'vscode';
import {
  gradleAssembleAndOpenJShellTerminal,
  openJShellTerminal,
} from './commands';
import { populateInfoChannel } from './info';
import { createTerminalProfile } from './shell';

export function activate(context: vscode.ExtensionContext) {
  // Information channel
  const chan = vscode.window.createOutputChannel("JShell");
  populateInfoChannel(chan);

  // Terminal Profile
  vscode.window.registerTerminalProfileProvider('vs-jshell:terminal-profile', {
    provideTerminalProfile: _ => createTerminalProfile()
  });

  // Commands
  vscode.commands.registerCommand(
    'vs-jshell:cmd-open-term',
    openJShellTerminal,
  );
  vscode.commands.registerCommand(
    'vs-jshell:cmd-gradle-assemble-open-term',
    gradleAssembleAndOpenJShellTerminal,
  );
}

export function deactivate() {
}


