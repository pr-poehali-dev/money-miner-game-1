export const BALANCE_KEY = 'minewin_balance';
export const DEPOSITS_KEY = 'minewin_deposits';
export const WITHDRAWALS_KEY = 'minewin_withdrawals';

export function getBalance(): number {
  return parseInt(localStorage.getItem(BALANCE_KEY) || '0') || 0;
}

export function setBalance(val: number) {
  localStorage.setItem(BALANCE_KEY, String(Math.max(0, val)));
}

export type DepositStatus = 'pending' | 'approved' | 'rejected';

export interface DepositRequest {
  id: string;
  amount: number;
  time: string;
  status: DepositStatus;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  payout: number;
  phone: string;
  bank: string;
  time: string;
  status: 'pending' | 'done';
}

export function getDeposits(): DepositRequest[] {
  try {
    return JSON.parse(localStorage.getItem(DEPOSITS_KEY) || '[]');
  } catch { return []; }
}

export function saveDeposits(list: DepositRequest[]) {
  localStorage.setItem(DEPOSITS_KEY, JSON.stringify(list));
}

export function getWithdrawals(): WithdrawalRequest[] {
  try {
    return JSON.parse(localStorage.getItem(WITHDRAWALS_KEY) || '[]');
  } catch { return []; }
}

export function saveWithdrawals(list: WithdrawalRequest[]) {
  localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(list));
}
