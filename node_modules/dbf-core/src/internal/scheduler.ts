export function schedule(fn: () => void) {
    queueMicrotask(fn);
  }
  