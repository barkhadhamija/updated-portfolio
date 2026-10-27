// localStorage that never throws (private windows and blocked storage just forget things).

export function get(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function set(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* not remembered, which is fine */
  }
}

export const still = () => document.documentElement.classList.contains('still');
