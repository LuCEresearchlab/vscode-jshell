export default function History(): {
  getCurrentEntry: () => void,
  previous: () => (string[] | undefined),
  next: () => (string[] | undefined),
  insert: (newEntry: string[]) => void,
} {
  let idx = 0;
  const entries: string[][] = [];

  const setCursor = (shift: number) => {
    const newCursor = idx + shift;
    if (newCursor < 0 || newCursor > entries.length) {
      return;
    }
    idx = newCursor;
    return idx === entries.length
      // New empty line
      ? []
      // Copy the array so we can change it without altering older entries
      : [...entries[newCursor]];
  };

  const insert = (newEntry: string[]) => {
    if (newEntry.length === 0) {
      return;
    }

    if (idx == entries.length) {
      entries.push(newEntry);
    } else {
      entries.splice(idx + 1, entries.length - idx - 1, newEntry);
    }
    idx += 1;
  };

  return {
    getCurrentEntry: () => entries[idx],
    previous: () => setCursor(-1),
    next: () => setCursor(1),
    insert,
  }
}
