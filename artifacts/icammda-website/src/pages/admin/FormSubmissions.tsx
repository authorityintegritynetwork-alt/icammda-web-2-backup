import { useState } from "react";
import { useParams, Link } from "wouter";
import { useAuth } from "@clerk/react";
import { ArrowLeft, Download, FileSpreadsheet, Trash2, Inbox } from "lucide-react";
import {
  useGetForm,
  useListFormSubmissions,
  useUpdateFormSubmission,
  useDeleteFormSubmission,
  getListFormSubmissionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  checkedin: "bg-blue-50 text-blue-700 border-blue-200",
  waitlisted: "bg-slate-100 text-slate-700 border-slate-300",
};

const STATUSES = ["pending", "approved", "rejected", "checkedin", "waitlisted"];

export default function FormSubmissions() {
  const params = useParams();
  const formId = parseInt(params.id ?? "", 10);
  const { data: form } = useGetForm(formId, { query: { enabled: Number.isFinite(formId) } });
  const { data: submissions, isLoading } = useListFormSubmissions(formId, { query: { enabled: Number.isFinite(formId) } });
  const updateSub = useUpdateFormSubmission();
  const deleteSub = useDeleteFormSubmission();
  const qc = useQueryClient();
  const { getToken } = useAuth();

  const [filter, setFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<number | null>(null);

  const filtered = (submissions ?? []).filter((s) => filter === "all" ? true : s.status === filter);
  const fields = form?.fields ?? [];

  const handleStatus = async (id: number, status: string) => {
    await updateSub.mutateAsync({ submissionId: id, data: { status } });
    qc.invalidateQueries({ queryKey: getListFormSubmissionsQueryKey(formId) });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    await deleteSub.mutateAsync({ submissionId: id });
    qc.invalidateQueries({ queryKey: getListFormSubmissionsQueryKey(formId) });
  };

  const exportXlsx = () => {
    if (!form || !submissions) return;
    const headers = ["ID", "Submitted", "Status", ...fields.map((f) => f.label), "Notes"];
    const rows = submissions.map((s) => {
      const data = (s.data ?? {}) as Record<string, unknown>;
      return [
        s.id,
        new Date(s.createdAt).toLocaleString(),
        s.status,
        ...fields.map((f) => formatValue(data[f.fieldKey])),
        s.notes ?? "",
      ];
    });
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");
    XLSX.writeFile(wb, `${form.slug}-submissions.xlsx`);
  };

  const exportCsv = async () => {
    const token = await getToken();
    const res = await fetch(`/api/forms/${formId}/export.csv`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) { alert("CSV export failed."); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${form?.slug ?? "form"}-submissions.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const viewSub = viewing != null ? submissions?.find((s) => s.id === viewing) : null;

  return (
    <AdminLayout title={form ? `Submissions — ${form.title}` : "Submissions"} description="View, mark and export form responses.">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <Link href="/admin/forms"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1.5" /> All forms</Button></Link>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({submissions?.length ?? 0})</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{cap(s)} ({(submissions ?? []).filter((x) => x.status === s).length})</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!submissions || submissions.length === 0}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportXlsx} disabled={!submissions || submissions.length === 0}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Excel
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : filtered.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <Inbox className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No submissions {filter !== "all" ? `with status "${filter}"` : "yet"}.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Submitted</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2">{s.submitterName || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-3 py-2">{s.submitterEmail || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-3 py-2">
                      <Select value={s.status} onValueChange={(v) => handleStatus(s.id, v)}>
                        <SelectTrigger className={`h-7 text-xs w-32 border ${STATUS_STYLES[s.status] ?? ""}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((st) => <SelectItem key={st} value={st}>{cap(st)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setViewing(s.id)}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={viewing != null} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Submission #{viewSub?.id}</DialogTitle></DialogHeader>
          {viewSub && (
            <div className="space-y-3 py-2">
              <div className="text-xs text-muted-foreground">{new Date(viewSub.createdAt).toLocaleString()}</div>
              {fields.map((f) => {
                const data = (viewSub.data ?? {}) as Record<string, unknown>;
                const v = data[f.fieldKey];
                if (f.type === "section") return null;
                return (
                  <div key={f.id} className="border-b pb-2 last:border-b-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{f.label}</p>
                    <p className="text-sm mt-0.5 break-words">{formatValue(v) || <span className="text-muted-foreground italic">empty</span>}</p>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
function cap(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
