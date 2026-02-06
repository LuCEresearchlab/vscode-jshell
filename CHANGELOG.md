# Changelog

Notable changes are listed in this document.

## 1.3.0

- Remove extra features (those not strictly related to jshell). Those now live in the `pf2-powerpack` extension
- Add public extension API, allowing other extensions to retrieve information about jshell, and to open a new terminal session

## 1.2.0

- Add support for executing gradle `assemble` and opening a new JShell session upon successful completion (requires the [Gradle for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension)

## 1.1.0

- Add support for `.vscode/class-path.jsh` and improve classpath handling
- Enable assertions in remote runtime by default
- Add system information in a "JShell" output channel
- Add key shortcut to open a new jshell session

## 1.0.0

- Initial version
