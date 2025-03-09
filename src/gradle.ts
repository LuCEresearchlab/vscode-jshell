import fs from 'fs';
import * as vscode from 'vscode';
import { getMainWorkspaceUri } from './utils';
import { posix } from 'path';

function getExtension(): vscode.Extension<any> | undefined {
  return vscode.extensions.getExtension('vscjava.vscode-gradle');
}

export function getGradleStatus(): GradleStatus {
  const extension = getExtension();
  return {
    extension: {
      available: extension?.isActive || false,
      version: extension?.packageJSON['version'],
    },
    project: getGradleProjectRoot() !== undefined,
  }
}

export async function buildGradleProject(
  projectFolder: string
): Promise<GradleAssembleResult> {
  const extension = getExtension();
  if (!extension) {
    return {
      success: false,
      reason: 'couldn\'t find the Gradle VSCode extension',
    };
  }

  const gradleApi = extension!.exports as GradleApi;
  const assembleProjectOps: RunTaskOpts = {
    projectFolder,
    taskName: 'assemble',
    showOutputColors: false,
  };

  try {
    await gradleApi.runTask(assembleProjectOps);
    return { success: true };
  } catch {
    return {
      success: false,
      reason: "compilation error",
    };
  }
}

export function getGradleProjectRoot(): string | undefined {
  const wsUri = getMainWorkspaceUri();
  if (wsUri) {
    const buildGradlePath = wsUri.with({
      path: posix.join(wsUri.path, 'build.gradle'),
    });
    if (fs.existsSync(buildGradlePath.fsPath)) {
      return wsUri.fsPath;
    }
  }

  return undefined;
}

type GradleAssembleResult = { success: true }
  | { success: false, reason: string }

type GradleStatus = {
  extension: {
    available: boolean,
    version: string | undefined,
  },
  project: boolean,
}

interface GradleApi {
  runTask(opts: RunTaskOpts): Promise<void>;
  cancelRunTask(opts: CancelTaskOpts): Promise<void>;
}

interface RunTaskOpts {
  projectFolder: string,
  taskName: string,
  showOutputColors: boolean,
};

interface CancelTaskOpts {
};
