// LoanReviews.tsx
// Main working page for Loan Committee: review, approve, reject, request clarification


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const dummyLoans = [
  {
    id: "LN-001",
    member: "John Doe",
    type: "Short",
    amount: 10000,
    duration: "12m",
    date: "2026-02-01",
    status: "Waiting Committee",
    highRisk: false,
  },
  // Add more dummy loans as needed
];

const LoanReviews = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filters, setFilters] = useState({ type: "", min: "", max: "", date: "", highRisk: false });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Loan Reviews</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label htmlFor="loan-type" className="block text-sm font-medium">Loan Type</label>
          <select
            id="loan-type"
            className="border rounded px-2 py-1"
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All</option>
            <option value="Short">Short</option>
            <option value="Long">Long</option>
            <option value="Holiday">Holiday</option>
          </select>
        </div>
        <div>
          <label htmlFor="min-amount" className="block text-sm font-medium">Amount Range</label>
          <div className="flex gap-2">
            <input
              id="min-amount"
              type="number"
              placeholder="Min"
              className="border rounded px-2 py-1 w-20"
              value={filters.min}
              onChange={e => setFilters(f => ({ ...f, min: e.target.value }))}
            />
            <input
              id="max-amount"
              type="number"
              placeholder="Max"
              className="border rounded px-2 py-1 w-20"
              value={filters.max}
              onChange={e => setFilters(f => ({ ...f, max: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label htmlFor="submission-date" className="block text-sm font-medium">Submission Date</label>
          <input
            id="submission-date"
            type="date"
            className="border rounded px-2 py-1"
            value={filters.date}
            onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="highRisk" checked={filters.highRisk} onChange={e => setFilters(f => ({ ...f, highRisk: e.target.checked }))} />
          <label htmlFor="highRisk" className="text-sm">High-risk only</label>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No loans pending review.</TableCell>
                </TableRow>
              ) : (
                dummyLoans.map(loan => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-mono">{loan.id}</TableCell>
                    <TableCell>{loan.member}</TableCell>
                    <TableCell>{loan.type}</TableCell>
                    <TableCell>ETB {loan.amount.toLocaleString()}</TableCell>
                    <TableCell>{loan.duration}</TableCell>
                    <TableCell>{loan.date}</TableCell>
                    <TableCell>{loan.status}</TableCell>
                    <TableCell>
                      <Button variant="link" onClick={() => setSelectedLoan(loan)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Loan Details Dialog */}
      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
            <DialogDescription>Review and take action on this loan application.</DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-4">
              {/* A. Member Summary */}
              <div>
                <div className="font-semibold">Member Summary</div>
                <div className="text-sm">Membership ID: --</div>
                <div className="text-sm">Membership duration: --</div>
                <div className="text-sm">Current savings balance: --</div>
                <div className="text-sm">Status: --</div>
              </div>
              {/* B. Loan Information */}
              <div>
                <div className="font-semibold">Loan Information</div>
                <div className="text-sm">Loan type: {selectedLoan.type}</div>
                <div className="text-sm">Requested amount: ETB {selectedLoan.amount.toLocaleString()}</div>
                <div className="text-sm">Interest rate: --</div>
                <div className="text-sm">Repayment period: {selectedLoan.duration}</div>
                <div className="text-sm">Monthly repayment: --</div>
              </div>
              {/* C. Existing Loan Check */}
              <div>
                <div className="font-semibold">Existing Loan Check</div>
                <div className="text-sm">Active loans count: --</div>
                <div className="text-sm">Overdue flag: --</div>
              </div>
              {/* D. Guarantor Summary */}
              <div>
                <div className="font-semibold">Guarantor Summary</div>
                <div className="text-sm">No guarantor data (demo)</div>
              </div>
              {/* E. Committee Decision Panel */}
              <div className="mt-4 border-t pt-4">
                <div className="font-semibold mb-2">Committee Decision</div>
                <div className="flex gap-4 mb-2">
                  <Button className="bg-success/80 text-white" type="button">Approve</Button>
                  <Button className="bg-destructive/80 text-white" type="button">Reject</Button>
                  <Button className="bg-warning/80 text-white" type="button">Return</Button>
                </div>
                <textarea className="border rounded w-full p-2" placeholder="Comment (required for reject/return)" rows={2}></textarea>
                <Button className="mt-2 bg-primary text-white" type="button">Submit Decision</Button>
              </div>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setSelectedLoan(null)}>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanReviews;
