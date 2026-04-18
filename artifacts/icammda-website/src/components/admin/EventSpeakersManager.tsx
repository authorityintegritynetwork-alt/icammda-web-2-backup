import { useState, useRef } from "react";
import { Plus, Edit, Trash2, Users, Upload, Loader2, X } from "lucide-react";
import {
  useListEventSpeakers,
  useCreateEventSpeaker,
  useUpdateEventSpeaker,
  useDeleteEventSpeaker,
  getListEventSpeakersQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

const SPEAKER_TYPES = ["Keynote Speaker", "Speaker", "Panelist", "Facilitator", "Guest of Honour", "Moderator"];

interface FormState {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
  photoUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  email: string;
  speakerType: string;
  displayOrder: string;
}

const EMPTY: FormState = {
  name: "", title: "", affiliation: "", bio: "", photoUrl: "",
  linkedinUrl: "", websiteUrl: "", email: "",
  speakerType: "Speaker", displayOrder: "0",
};

function getPhotoSrc(url: string) {
  if (!url) return "";
  if (url.startsWith("/objects/")) return `/api/storage/objects/${url.slice("/objects/".length)}`;
  return url;
}

export default function EventSpeakersManager({ eventId }: { eventId: number }) {
  const { data: speakers, isLoading } = useListEventSpeakers({ eventId });
  const createSpeaker = useCreateEventSpeaker();
  const updateSpeaker = useUpdateEventSpeaker();
  const deleteSpeaker = useDeleteEventSpeaker();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListEventSpeakersQueryKey({ eventId }) });

  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (s: NonNullable<typeof speakers>[0]) => {
    setEditing(s.id);
    setForm({
      name: s.name,
      title: s.title ?? "",
      affiliation: s.affiliation ?? "",
      bio: s.bio ?? "",
      photoUrl: s.photoUrl ?? "",
      linkedinUrl: s.linkedinUrl ?? "",
      websiteUrl: s.websiteUrl ?? "",
      email: s.email ?? "",
      speakerType: s.speakerType,
      displayOrder: String(s.displayOrder),
    });
    setDialogOpen(true);
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await urlRes.json();
      const putRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");
      setForm((f) => ({ ...f, photoUrl: objectPath }));
    } catch (err) {
      alert(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      title: form.title || null,
      affiliation: form.affiliation || null,
      bio: form.bio || null,
      photoUrl: form.photoUrl || null,
      linkedinUrl: form.linkedinUrl || null,
      websiteUrl: form.websiteUrl || null,
      email: form.email || null,
      speakerType: form.speakerType,
      displayOrder: parseInt(form.displayOrder, 10) || 0,
    };
    if (editing !== null) {
      await updateSpeaker.mutateAsync({ id: editing, data: payload });
    } else {
      await createSpeaker.mutateAsync({ data: { ...payload, eventId } });
    }
    invalidate();
    setDialogOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Remove speaker "${name}"?`)) return;
    await deleteSpeaker.mutateAsync({ id });
    invalidate();
  };

  const saving = createSpeaker.isPending || updateSpeaker.isPending;

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">Speakers & Guests</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Add the people presenting at or attending this event.</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={openCreate} data-testid="add-speaker-btn">
          <Plus size={14} className="mr-1.5" /> Add Speaker
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      ) : !speakers || speakers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg" data-testid="no-speakers">
          <Users size={28} className="mx-auto mb-2 opacity-30" />
          <p>No speakers added yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {speakers.map((s) => (
            <div key={s.id} className="flex items-center gap-3 bg-muted/30 border border-border rounded-lg p-2.5" data-testid={`speaker-${s.id}`}>
              {s.photoUrl ? (
                <img src={getPhotoSrc(s.photoUrl)} alt={s.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-border" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Users size={14} className="text-cyan-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                  <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600">
                    {s.speakerType}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {[s.title, s.affiliation].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(s)} data-testid={`edit-speaker-${s.id}`}>
                  <Edit size={12} />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => handleDelete(s.id, s.name)} disabled={deleteSpeaker.isPending} data-testid={`delete-speaker-${s.id}`}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="speaker-dialog">
          <DialogHeader>
            <DialogTitle>{editing !== null ? "Edit Speaker" : "Add Speaker"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div>
              <Label className="mb-1.5 block">Photo</Label>
              <div className="flex items-start gap-3">
                {form.photoUrl ? (
                  <div className="relative shrink-0">
                    <img src={getPhotoSrc(form.photoUrl)} alt="preview" className="w-20 h-20 rounded-lg object-cover border border-border" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, photoUrl: "" }))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
                      title="Remove photo"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center shrink-0">
                    <Users size={20} className="text-muted-foreground/40" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                      e.target.value = "";
                    }}
                    data-testid="speaker-photo-file"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    data-testid="speaker-photo-upload-btn"
                  >
                    {uploading ? (
                      <><Loader2 size={13} className="mr-1.5 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload size={13} className="mr-1.5" /> Upload Photo</>
                    )}
                  </Button>
                  {!form.photoUrl?.startsWith("/objects/") && (
                    <Input
                      type="text"
                      className="mt-2 text-xs"
                      placeholder="…or paste an image URL"
                      value={form.photoUrl}
                      onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
                      data-testid="speaker-photo-url"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="sp-name" className="mb-1.5 block">Full Name <span className="text-destructive">*</span></Label>
                <Input id="sp-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="speaker-name-input" />
              </div>
              <div>
                <Label className="mb-1.5 block">Speaker Type</Label>
                <Select value={form.speakerType} onValueChange={(v) => setForm((f) => ({ ...f, speakerType: v }))}>
                  <SelectTrigger data-testid="speaker-type-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SPEAKER_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sp-order" className="mb-1.5 block">Display Order</Label>
                <Input id="sp-order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} data-testid="speaker-order-input" />
              </div>
              <div>
                <Label htmlFor="sp-title" className="mb-1.5 block">Title / Role</Label>
                <Input id="sp-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Professor, Director, ..." data-testid="speaker-title-input" />
              </div>
              <div>
                <Label htmlFor="sp-aff" className="mb-1.5 block">Affiliation</Label>
                <Input id="sp-aff" value={form.affiliation} onChange={(e) => setForm((f) => ({ ...f, affiliation: e.target.value }))} placeholder="University / Institution" data-testid="speaker-affiliation-input" />
              </div>
              <div>
                <Label htmlFor="sp-email" className="mb-1.5 block">Email</Label>
                <Input id="sp-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="speaker-email-input" />
              </div>
              <div>
                <Label htmlFor="sp-linkedin" className="mb-1.5 block">LinkedIn URL</Label>
                <Input id="sp-linkedin" value={form.linkedinUrl} onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/..." data-testid="speaker-linkedin-input" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="sp-website" className="mb-1.5 block">Website URL</Label>
                <Input id="sp-website" value={form.websiteUrl} onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))} placeholder="https://..." data-testid="speaker-website-input" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="sp-bio" className="mb-1.5 block">Biography</Label>
                <Textarea
                  id="sp-bio"
                  rows={5}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="A short biography that will appear in the speaker's profile..."
                  className="resize-y"
                  data-testid="speaker-bio-input"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-testid="speaker-dialog-cancel">Cancel</Button>
              <Button type="submit" disabled={saving || uploading} data-testid="speaker-dialog-save">
                {saving ? "Saving..." : editing !== null ? "Update Speaker" : "Add Speaker"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
