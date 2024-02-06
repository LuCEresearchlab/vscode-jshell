# JShell extension for VSCode

## Features

- Adds "JShell" terminal profile which uses the `jshell` available in `$PATH`
- Automatically loads the `.vscode/init.jsh` file, if found in the current workspace


![Screenshot](assets/screenshot.png)

## Build

```bash
npm install
node_modules/@vscode/vsce/vsce package
```

### Development

Open the repo in a VSCode workspace and press `F5` to load a new VSCode
instance with the extension loaded.

## Install

- **GitHub Actions**
  1. Download and extract the `vsix` file from the GitHub actions [artifacts](https://github.com/LuCEresearchlab/vscode-jshell/actions/workflows/build.yml)
  2. Execute `code --install-extension path/to/vscode-jshell-$VERSION.vsix`
  3. Open a new VSCode instance
- **Marketplace**
  1. TODO
