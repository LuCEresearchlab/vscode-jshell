import process from "process";
import * as os from "os";
import * as vscode from 'vscode';

import { getShellConfigArgs, getShellPath } from './config';

export function populateInfoChannel(chan: vscode.OutputChannel) {
  chan.appendLine("# JShell info");
  chan.appendLine("");
  chan.appendLine("## Environment");
  chan.appendLine(`• Host:      ${os.platform} ${os.release} ${os.arch}`);
  chan.appendLine(`• Editor:    ${vscode.env.appName} ${process.version} (${vscode.env.appHost})`);
  chan.appendLine(`• JAVA_HOME: ${process.env.JAVA_HOME}`);
  chan.appendLine("## Configuration");
  chan.appendLine(`• Shell:    ${getShellPath()}`);
  chan.appendLine(`• Arguments: ${getShellConfigArgs().join(" ")}`);
}
