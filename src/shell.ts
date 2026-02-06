import fs from "fs";
import path from "path";
import { posix } from "path";
import * as vscode from "vscode";

import {
  getShellConfigArgs,
  getShellPath,
} from "./config";
import { getMainWorkspaceUri } from "./utils";

function getClassPath(
  workspaceUri: vscode.Uri,
  classPathFileUri: vscode.Uri,
): string {
  const contents = fs.readFileSync(classPathFileUri.fsPath, "utf-8");
  return contents
    .replace("\r\n", "\n") // CRLF -> LF
    .replace("\r", "\n") // CR -> LF
    .split("\n") // Split LF
    .filter(line => line.length > 0) // Non-empty
    .filter(path => {
      const uri = workspaceUri.with({
        path: posix.join(workspaceUri.path, ...path.split("/")),
      });
      return fs.existsSync(uri.fsPath);
    }) // Entry exists
    .join(path.delimiter);
}

export function getShellArgs() {
  const args = getShellConfigArgs();
  const wsUri = getMainWorkspaceUri();

  if (wsUri) {
    // Add additional entries to the classpath
    try {
      const cpUri = wsUri.with({
        path: posix.join(wsUri.path, ".vscode", "class-path.jsh"),
      });
      if (fs.existsSync(cpUri.fsPath)) {
        const classPath = getClassPath(wsUri, cpUri);
        if (classPath.length > 0) {
          args.push("--class-path");
          args.push(classPath);
        }
      }
    } catch (e) {
      vscode.window.showErrorMessage(`Failed to read .vscode/class-path.jsh: ${e}`);
    }

    // Execute code when the shell is started (e.g. imports)
    try {
      const initJshUri = wsUri.with({
        path: posix.join(wsUri.path, ".vscode", "init.jsh"),
      });
      if (fs.existsSync(initJshUri.fsPath)) {
        args.push(initJshUri.fsPath);
      }
    } catch (e) {
      vscode.window.showErrorMessage(`Failed to read .vscode/init.jsh: ${e}`);
    }
  }

  return args;
}

export function createTerminalOptions(): vscode.TerminalOptions {
  return {
    name: "JShell",
    shellPath: getShellPath(),
    shellArgs: getShellArgs(),
    cwd: getMainWorkspaceUri(),
    iconPath: new vscode.ThemeIcon("coffee"),
    isTransient: true,
  };
}
