import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { useSystemSettings, useUpdateSystemSettings } from "@/hooks/useAdminApi";
import type { SystemSettings as SystemSettingsType } from "@/lib/api/admin";

export default function SystemSettings() {
  const { data: settings, isLoading, error } = useSystemSettings();
  const updateMutation = useUpdateSystemSettings();
  
  const [form, setForm] = useState<Partial<SystemSettingsType>>({
    system_name: '',
    default_language: 'English',
    date_format: 'YYYY-MM-DD',
    currency_format: 'ETB',
    loan_types: [],
    interest_rates: {},
    max_loan_limit: 0,
    required_guarantor_count: 2,
    approval_steps_enabled: true,
    approval_order: 'fixed',
    bank_api_key: '',
    sms_service: '',
    email_service: '',
  });

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof SystemSettingsType, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form);
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 min-h-screen w-full bg-background space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 min-h-screen w-full bg-background">
        <div className="text-center py-12 text-destructive">
          Failed to load settings. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-background">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">System Settings</h2>
          <p className="text-muted-foreground">Configure system-wide behavior (not data).</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>System name, language, date & currency format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label>System Name</Label>
                <Input 
                  value={form.system_name || ''} 
                  onChange={(e) => handleChange('system_name', e.target.value)}
                  placeholder="System Name" 
                />
              </div>
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select 
                  value={form.default_language || 'English'} 
                  onValueChange={(v) => handleChange('default_language', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amharic">Amharic</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Input 
                  value={form.date_format || ''} 
                  onChange={(e) => handleChange('date_format', e.target.value)}
                  placeholder="YYYY-MM-DD" 
                />
              </div>
              <div className="space-y-2">
                <Label>Currency Format</Label>
                <Input 
                  value={form.currency_format || ''} 
                  onChange={(e) => handleChange('currency_format', e.target.value)}
                  placeholder="ETB" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Configuration</CardTitle>
            <CardDescription>Loan types, interest rates, limits, guarantor count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label>Loan Types (comma-separated)</Label>
                <Input 
                  value={form.loan_types?.join(', ') || ''} 
                  onChange={(e) => handleChange('loan_types', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Short, Long, Holiday" 
                />
              </div>
              <div className="space-y-2">
                <Label>Default Interest Rate (%)</Label>
                <Input 
                  type="number" 
                  value={form.interest_rates?.default || ''} 
                  onChange={(e) => handleChange('interest_rates', { ...form.interest_rates, default: Number(e.target.value) })}
                  placeholder="%" 
                />
              </div>
              <div className="space-y-2">
                <Label>Max Loan Limit (ETB)</Label>
                <Input 
                  type="number" 
                  value={form.max_loan_limit || ''} 
                  onChange={(e) => handleChange('max_loan_limit', Number(e.target.value))}
                  placeholder="Amount" 
                />
              </div>
              <div className="space-y-2">
                <Label>Required Guarantor Count</Label>
                <Input 
                  type="number" 
                  value={form.required_guarantor_count || ''} 
                  onChange={(e) => handleChange('required_guarantor_count', Number(e.target.value))}
                  placeholder="Count" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Workflow Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Workflow Settings</CardTitle>
            <CardDescription>Enable/disable steps, approval order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Approval Steps</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, loans require multi-step approval
                  </p>
                </div>
                <Switch
                  checked={form.approval_steps_enabled || false}
                  onCheckedChange={(checked) => handleChange('approval_steps_enabled', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Approval Order</Label>
                <Select 
                  value={form.approval_order || 'fixed'} 
                  onValueChange={(v) => handleChange('approval_order', v)}
                >
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Order</SelectItem>
                    <SelectItem value="admin_controlled">Admin Controlled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Bank API, SMS/Email service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label>Bank API Key</Label>
                <Input 
                  type="password" 
                  value={form.bank_api_key || ''} 
                  onChange={(e) => handleChange('bank_api_key', e.target.value)}
                  placeholder="********" 
                />
              </div>
              <div className="space-y-2">
                <Label>SMS Service Provider</Label>
                <Input 
                  value={form.sms_service || ''} 
                  onChange={(e) => handleChange('sms_service', e.target.value)}
                  placeholder="Provider" 
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Email Service Provider</Label>
                <Input 
                  value={form.email_service || ''} 
                  onChange={(e) => handleChange('email_service', e.target.value)}
                  placeholder="Provider" 
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No historical data editing allowed.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
