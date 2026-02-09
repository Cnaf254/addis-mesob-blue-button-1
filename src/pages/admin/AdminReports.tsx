import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FileDown, Loader2, FileText, FileSpreadsheet } from "lucide-react";
import { useReportTypes, useExportReport } from "@/hooks/useAdminApi";

export default function AdminReports() {
  const { data: reports, isLoading, error } = useReportTypes();
  const exportMutation = useExportReport();
  const [exportingType, setExportingType] = useState<string | null>(null);

  const handleExport = async (type: string, format: 'pdf' | 'excel') => {
    setExportingType(`${type}-${format}`);
    try {
      const blob = await exportMutation.mutateAsync({ type, format });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type.toLowerCase().replace(/\s+/g, '-')}-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${type} report exported successfully!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to export report");
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-background">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Reports (Admin)</h2>
        <p className="text-muted-foreground">System usage & access analysis (not financial approvals).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Report Types
          </CardTitle>
          <CardDescription>Generate and export reports as PDF or Excel</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load report types. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports && reports.length > 0 ? (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.type}</TableCell>
                      <TableCell className="text-muted-foreground">{report.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(report.type, 'pdf')}
                            disabled={exportingType === `${report.type}-pdf`}
                            className="gap-1"
                          >
                            {exportingType === `${report.type}-pdf` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(report.type, 'excel')}
                            disabled={exportingType === `${report.type}-excel`}
                            className="gap-1"
                          >
                            {exportingType === `${report.type}-excel` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <FileSpreadsheet className="h-4 w-4" />
                            )}
                            Excel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No report types available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
