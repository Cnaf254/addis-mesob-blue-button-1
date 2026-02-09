// LoanCommitteeReports.tsx
// Loan approval statistics, risk and guarantor exposure summary


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const LoanCommitteeReports = () => {
  const [filters, setFilters] = useState({ type: "", from: "", to: "" });
  // Dummy data for demonstration
  const summary = {
    approved: 12,
    rejected: 4,
    total: 16,
  };
  const rejectionReasons = [
    { reason: "Insufficient savings", count: 2 },
    { reason: "Guarantor risk", count: 1 },
    { reason: "Other", count: 1 },
  ];
  const amountDist = [
    { type: "Short", count: 7 },
    { type: "Long", count: 5 },
    { type: "Holiday", count: 4 },
  ];
  const guarantorExposure = [
    { name: "Guarantor A", exposure: 12000 },
    { name: "Guarantor B", exposure: 8000 },
  ];

  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-8">Reports</h2>
      <div className="mb-8 flex gap-6 flex-wrap items-end">
        <div className="mb-2">
          <label htmlFor="loan-type" className="block text-sm font-medium">Loan Type</label>
          <select
            id="loan-type"
            className="px-2 py-1 focus:outline-blue-500"
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All</option>
            <option value="Short">Short</option>
            <option value="Long">Long</option>
            <option value="Holiday">Holiday</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="from-date" className="block text-sm font-medium">From</label>
          <input
            id="from-date"
            type="date"
            className="px-2 py-1 focus:outline-blue-500"
            value={filters.from}
            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="to-date" className="block text-sm font-medium">To</label>
          <input
            id="to-date"
            type="date"
            className="px-2 py-1 focus:outline-blue-500"
            value={filters.to}
            onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
          />
        </div>
        <div className="flex gap-3 mt-4">
          <Button>Export PDF</Button>
          <Button>Export Excel</Button>
        </div>
      </div>

      {/* Loan Approval vs Rejection Summary */}
      <div className="mb-10">
        <h3 className="font-semibold mb-2">Loan Approval vs Rejection</h3>
        <div className="flex gap-8 md:gap-12 flex-col md:flex-row">
          <Card className="bg-blue-100 flex-1">
            <CardHeader>
              <CardTitle className="text-blue-900">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-900">{summary.approved}</span>
            </CardContent>
          </Card>
          <Card className="bg-yellow-100 flex-1">
            <CardHeader>
              <CardTitle className="text-yellow-900">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-yellow-900">{summary.rejected}</span>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 flex-1">
            <CardHeader>
              <CardTitle className="text-blue-900">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-900">{summary.total}</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rejection Reasons Breakdown */}
      <div className="mb-10">
        <h3 className="font-semibold mb-2">Rejection Reasons Breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reason</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rejectionReasons.map(r => (
              <TableRow key={r.reason}>
                <TableCell>{r.reason}</TableCell>
                <TableCell>{r.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Loan Amount Distribution by Type */}
      <div className="mb-10">
        <h3 className="font-semibold mb-2">Loan Amount Distribution by Type</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amountDist.map(a => (
              <TableRow key={a.type}>
                <TableCell>{a.type}</TableCell>
                <TableCell>{a.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Guarantor Exposure Summary */}
      <div className="mb-10">
        <h3 className="font-semibold mb-2">Guarantor Exposure Summary</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guarantor</TableHead>
              <TableHead>Exposure (ETB)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guarantorExposure.map(g => (
              <TableRow key={g.name}>
                <TableCell>{g.name}</TableCell>
                <TableCell>{g.exposure.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LoanCommitteeReports;
