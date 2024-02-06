import { EventEmitter } from "vscode";
import History from "./History";

export default function PseudoTerm(
  writeEmitter: EventEmitter<string>,
): {
  onEnter: () => string,
  onKeyPress: (data: string) => void,
} {
  /*
   * ANSI escape codes reference:
   *   https://en.wikipedia.org/wiki/ANSI_escape_code
   */

  let currLine: string[] = [];
  let cursor = 0;
  const history = History();

  const replaceCurrentLine = (newLine: string[]) => {
    currLine = newLine;
    cursor = newLine.length;

    /*
     * 1. Clear the entire line
     * 2. Move cursor to the beginning of the line
     * 3. Insert the current history entry
     * 4. Move cursor to the end
     */
    writeEmitter.fire(`\x1b[2K\x1b[1G${currLine.join('')}\x1b[${1 + currLine.length}G`);
  };

  const onInput = (data: string) => {
    const initialCursor = cursor;
    currLine.splice(cursor, 0, ...data.split(''));
    cursor += data.length;
    if (cursor === currLine.length) {
      writeEmitter.fire(data);
    } else {
      /*
       * 1. Move to initialCursor + 1
       * 2. Clear until the end
       * 3. insert currLine[cursor:]
       * 4. Move cursor to the end
       */
      writeEmitter.fire(`\x1b[${initialCursor + 1}G\x1b[0J${currLine.slice(cursor - 1).join('')}\x1b[${cursor + 1}G`);
    }
  };

  const onLeftArrow = () => {
    if (cursor > 0) {
      cursor--;
      // Move cursor backward
      writeEmitter.fire('\x1b[D');
    }
  }
  const onRightArrow = () => {
    if (cursor < currLine.length) {
      cursor++;
      // Move cursor forward
      writeEmitter.fire('\x1b[C');
    }
  };
  const onUpArrow = () => {
    const histEntry = history.previous();
    if (histEntry) {
      replaceCurrentLine(histEntry);
    }
  };
  const onDownArrow = () => {
    const histEntry = history.next();
    if (histEntry) {
      replaceCurrentLine(histEntry);
    }
  };

  const onBackspace = () => {
    if (currLine.length === 0) {
      return;
    }
    currLine.splice(currLine.length - 1, 1);
    // Move cursor backward & delete
    writeEmitter.fire('\x1b[D\x1b[P');
  };

  const onEnter = () =>  {
    const lineAsStr = currLine.join('') + '\r\n';
    history.insert(currLine);
    currLine = [];
    cursor = 0;
    // Emit newline
    writeEmitter.fire('\r\n');
    // Return the full line as a string
    return lineAsStr;
  };

  const specialKeyHandler: { [key: string]: () => void } = {
    '\x7f': onBackspace,
    '\x1b[A': onUpArrow,
    '\x1b[B': onDownArrow,
    '\x1b[C': onRightArrow,
    '\x1b[D': onLeftArrow,
  };

  const onKeyPress = (data: string) => {
    if (data in specialKeyHandler) {
      specialKeyHandler[data]();
    } else {
      onInput(data);
    }
  };

  return {
    onEnter,
    onKeyPress,
  };
};
