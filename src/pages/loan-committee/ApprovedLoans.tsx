// ApprovedLoans.tsx
// Loans approved by the Loan Committee, track handoff to Management Committee


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const dummyApproved = [
  {
    id: "LN-002",
    member: "Jane Smith",
    type: "Long",
    amount: 20000,
    approvalDate: "2026-02-02",
    status: "Waiting Management Approval",
    remarks: "Meets all criteria."
  },
  // Add more dummy approved loans as needed
];

const ApprovedLoans = () => {
  const [selected, setSelected] = useState(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approved Loans</CardTitle>
        <CardDescription>
          Loans approved by the committee. Track handoff to Management Committee.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Member Name</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Approval Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyApproved.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No approved loans yet.</TableCell>
              </TableRow>
            ) : (
              dummyApproved.map(loan => (
                <TableRow key={loan.id}>
                  <TableCell className="font-mono">{loan.id}</TableCell>
                  <TableCell>{loan.member}</TableCell>
                  <TableCell>{loan.type}</TableCell>
                  <TableCell>ETB {loan.amount.toLocaleString()}</TableCell>
                  <TableCell>{loan.approvalDate}</TableCell>
                  <TableCell>{loan.status}</TableCell>
                  <TableCell>
                    <Button variant="link" onClick={() => setSelected(loan)}>
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Details Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approved Loan Details</DialogTitle>
              <DialogDescription>Read-only details of the approved loan.</DialogDescription>
            </DialogHeader>
            {selected && (
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Application ID: </span>
                  <span className="font-mono">{selected.id}</span>
                </div>
                <div>
                  <span className="font-semibold">Member Name: </span>
                  <span>{selected.member}</span>
                </div>
                <div>
                  <span className="font-semibold">Loan Type: </span>
                  <span>{selected.type}</span>
                </div>
                <div>
                  <span className="font-semibold">Amount: </span>
                  <span>ETB {selected.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-semibold">Approval Date: </span>
                  <span>{selected.approvalDate}</span>
                </div>
                <div>
                  <span className="font-semibold">Status: </span>
                  <span>{selected.status}</span>
                </div>
                <div>
                  <span className="font-semibold">Committee Remarks: </span>
                  <span>{selected.remarks}</span>
                </div>
              </div>
            )}
            <DialogClose asChild>
              <Button variant="outline" className="mt-4 w-full" onClick={() => setSelected(null)}>
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ApprovedLoans;
