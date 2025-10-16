import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseUnits, formatUnits } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseAmount(amount: string, decimals: number): string {
  return parseUnits(amount, decimals).toString();
}

export function formatAmount(
  amount: string | bigint,
  decimals: number,
): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  return formatUnits(value, decimals);
}

// Re-export claim utilities
export { prepareClaimTransactions } from './claim';
