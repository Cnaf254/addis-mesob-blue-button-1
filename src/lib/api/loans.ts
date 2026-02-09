// Mock loans API

export interface LoanApplication {
  member_id: string;
  loan_type: string;
  principal_amount: number;
  term_months: number;
  interest_rate: number;
  total_amount: number;
  monthly_payment: number;
  remaining_balance: number;
  purpose: string;
  status: string;
}

export const applyLoan = async (data: LoanApplication): Promise<{ success: boolean }> => {
  // Mock implementation - simulates API call
  console.log("Loan application submitted:", data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};
