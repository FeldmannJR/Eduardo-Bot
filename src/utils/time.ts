const times = new Map<string, number>();

/**
 * Returns if elepsed the number of milliseconds since last call
 * @param key
 * @param time
 */
export function elapsed(key: string, time: number): boolean {
  const now = Date.now();
  const lastTime = times.get(key);
  if (lastTime) {
    if (now < (lastTime + time)) {
      return false;
    }
  }
  times.set(key, now);
  return true;
}
