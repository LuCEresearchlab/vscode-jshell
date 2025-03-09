import * as vscode from 'vscode';

import { getShellPath } from './config';
import { getShellArgs } from './shell';
import {
  buildGradleProject,
  getGradleProjectRoot,
} from './gradle';

export function openJShellTerminal() {
  vscode.window.createTerminal(
    'JShell',
    getShellPath(),
    getShellArgs(),
  ).show(true);
}

export function gradleAssembleAndOpenJShellTerminal() {
  const gradleProject = getGradleProjectRoot();
  if (gradleProject) {
    buildGradleProject(gradleProject)
      .then(res => {
        if (res.success) {
          openJShellTerminal();
        } else {
          throw res.reason;
        }
      })
      .catch(e => vscode.window.showErrorMessage(
        `Failed to assemble Gradle project: ${e}`
      ));
  } else {
    vscode.window.showErrorMessage('Couldn\'t locate the Gradle project root');
  }
}
