import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Sistem</CardTitle>
          <CardDescription>Atur konfigurasi dasar untuk proses upload dan review AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Model AI default: Claude Sonnet 4</p>
          <p>Auto review: Aktif</p>
          <p>Status default: Pending</p>
        </CardContent>
      </Card>
    </div>
  );
}
