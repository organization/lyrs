export const alpha = (color: string, alpha: number): string => `oklch(from ${color} l c h / ${alpha})`;
