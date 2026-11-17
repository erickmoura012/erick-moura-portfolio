/** Arredonda o máximo do eixo para um número "limpo" (1, 2, 5, 10, 20, 50…). */
export function niceAxisMax(value: number): number {
  if (value <= 1) return 1
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalized = value / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
}
