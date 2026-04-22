import { useState } from "react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, FileText, ExternalLink, Inbox } from "lucide-react";
import {
  useListForms,
  useCreateForm,
  useDeleteForm,
  getListFormsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-700 border-slate-300",
};

export default function FormsList() {
  const { data: forms, isLoading } = useListForms();
  const createForm = useCreateForm();
  const deleteForm = useDeleteForm();
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const reset = () => { setTitle(""); setSlug(""); setDescription(""); setError(""); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !slug.trim()) { setError("Title and slug are required."); return; }
    try {
      await createForm.mutateAsync({
        data: {
          title: title.trim(),
          slug: slugify(slug),
          description: description.trim() || null,
          status: "draft",
        },
      });
      qc.invalidateQueries({ queryKey: getListFormsQueryKey() });
      setOpen(false);
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create form";
      setError(msg.includes("unique") || msg.includes("duplicate") ? "Slug already in use." : msg);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete form "${title}" and all its submissions? This cannot be undone.`)) return;
    await deleteForm.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListFormsQueryKey() });
  };

  return (
    <AdminLayout title="Forms" description="Build registration and intake forms for events or general use.">
      <div className="flex items-center justify-end mb-4">
        <Button onClick={() => { reset(); setOpen(true); }} data-testid="new-form-btn">
          <Plus className="w-4 h-4 mr-2" /> New form
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : !forms || forms.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No forms yet. Click "New form" to create one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {forms.map((form) => (
            <div key={form.id} className="border rounded-lg p-4 flex items-center gap-4 hover:bg-muted/30 transition" data-testid={`form-row-${form.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{form.title}</h3>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${STATUS_STYLES[form.status] ?? STATUS_STYLES.draft}`}>
                    {form.status}
                  </span>
                  {form.eventId && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">event</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">/forms/{form.slug}</p>
              </div>
              <Link href={`/admin/forms/${form.id}/submissions`}>
                <Button variant="outline" size="sm" data-testid={`form-submissions-${form.id}`}>
                  <Inbox className="w-3.5 h-3.5 mr-1.5" /> Submissions
                </Button>
              </Link>
              {form.status === "published" && (
                <a href={`/forms/${form.slug}`} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="sm" title="Open public form">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              )}
              <Link href={`/admin/forms/${form.id}/edit`}>
                <Button variant="ghost" size="sm" data-testid={`edit-form-${form.id}`}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(form.id, form.title)} className="text-destructive hover:text-destructive" data-testid={`delete-form-${form.id}`}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>New form</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div>
                <Label htmlFor="ft" className="mb-1.5 block">Title <span className="text-destructive">*</span></Label>
                <Input id="ft" value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} placeholder="e.g. Workshop on Bayesian Methods Registration" required />
              </div>
              <div>
                <Label htmlFor="fs" className="mb-1.5 block">URL slug <span className="text-destructive">*</span></Label>
                <Input id="fs" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="bayesian-workshop-registration" required />
                <p className="text-[11px] text-muted-foreground mt-1">Public URL: /forms/{slug || "your-slug"}</p>
              </div>
              <div>
                <Label htmlFor="fd" className="mb-1.5 block">Description (optional)</Label>
                <Textarea id="fd" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createForm.isPending}>{createForm.isPending ? "Creating..." : "Create & open builder"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
