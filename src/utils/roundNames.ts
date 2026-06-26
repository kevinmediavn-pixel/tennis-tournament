export function getRoundName(round: number, totalRounds: number): string {
  const fromFinal = totalRounds - round;
  if (fromFinal === 0) return 'Chung kết';
  if (fromFinal === 1) return 'Bán kết';
  if (fromFinal === 2) return 'Tứ kết';
  if (fromFinal === 3) return 'Vòng 1/8';
  return `Vòng ${round}`;
}

export function getTotalRounds(bracketSize: number): number {
  return Math.log2(bracketSize);
}
