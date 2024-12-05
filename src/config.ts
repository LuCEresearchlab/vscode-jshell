import * as vscode from 'vscode';

function getFlags(config: string, option: string): string[] {
  return config.split(' ')
    .filter(flag => flag.length > 0)
    .flatMap(flag => [option, flag]);
}

/**
 * Get the arguments for the repl command from the workspace config.
 * 
 * Keys:
 * - jshell.feedback: string
 * - jshell.nativeAccess: boolean
 * - jshell.preview: boolean
 * - jshell.compilerFlags: string
 * - jshell.runtimeFlags: string
 * - jshell.remoteRuntimeFlags: string
 */
export function getShellArgs(): string[] {
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
    args.push(...getFlags(configValues.compilerFlags, '-C'));
  }
  if (configValues.runtimeFlags) {
    args.push(...getFlags(configValues.runtimeFlags, '-J'));
  }
  if (configValues.remoteRuntimeFlags) {
    args.push(...getFlags(configValues.remoteRuntimeFlags, '-R'));
  }

  return args;
}

/**
 * Get the path to the jshell executable from workspace config.
 * 
 * Keys:
 * - jshell.shellPath: string
 */
export function getShellPath(): string | undefined {
  return vscode.workspace.getConfiguration('jshell').get<string>('shellPath');
}
