/**
 * Recipe-related utility functions.
 * Extracted from inline component code for reusability.
 */

/**
 * Parse a numeric amount from an ingredient string.
 * Handles integers, decimals, and fractions (e.g. "1/2 cup flour").
 */
export function parseAmount(text: string): { num: number | null; rest: string } {
    const match = text.match(/([0-9./]+)/);
    if (!match) return { num: null, rest: text };

    const numStr = match[0];
    let num = 0;

    if (numStr.includes('/')) {
        const [n, d] = numStr.split('/').map(Number);
        num = n / d;
    } else {
        num = Number(numStr);
    }

    return { num, rest: text.replace(numStr, '').trim() };
}

/**
 * Cubic ease-in-out function for smooth animations.
 * Returns a value between 0–1 for a given progress t (0–1).
 */
export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
