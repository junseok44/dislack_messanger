export function withCooldown<T extends (...args: any[]) => void>(
  func: T,
  cooldown: number
): (...args: Parameters<T>) => void {
  let lastCallTime: number | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (lastCallTime === null || now - lastCallTime >= cooldown) {
      lastCallTime = now;
      func(...args);
    }
  };
}
