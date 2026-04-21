import { useState, useRef } from "react";
import { Plus, Edit, Trash2, Users, Upload, X, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/react";
import {
  useListTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  getListTeamMembersQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";

const ROLES = ["director", "postdoc", "phd", "msc", "staff", "nysc"];
const roleLabel: Record<string, string> = { director: "Director", postdoc: "Post-doctoral Scientist", phd: "PhD Scholar", msc: "MSc Scholar", staff: "Staff", nysc: "Youth Corp (NYSC)" };

const AVATAR_PALETTE = [
  { bg: "#164e63", text: "#a5f3fc" },
  { bg: "#134e4a", text: "#99f6e4" },
  { bg: "#312e81", text: "#c7d2fe" },
  { bg: "#4c1d95", text: "#ddd6fe" },
  { bg: "#78350f", text: "#fde68a" },
  { bg: "#1e3a8a", text: "#bfdbfe" },
  { bg: "#831843", text: "#fbcfe8" },
  { bg: "#14532d", text: "#bbf7d0" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function getPhotoSrc(photoUrl: string | null | undefined): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("/objects/")) {
    return `/api/storage/objects/${photoUrl.slice("/objects/".length)}`;
  }
  return photoUrl;
}

interface FormState {
  name: string;
  title: string;
  role: string;
  bio: string;
  email: string;
  linkedinUrl: string;
  photoUrl: string;
  displayOrder: string;
}

const EMPTY: FormState = { name: "", title: "", role: "phd", bio: "", email: "", linkedinUrl: "", photoUrl: "", displayOrder: "0" };

export default function TeamList() {
  const { data: members, isLoading } = useListTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (member: NonNullable<typeof members>[0]) => {
    setEditing(member.id);
    setForm({
      name: member.name,
      title: member.title,
      role: member.role,
      bio: member.bio ?? "",
      email: member.email ?? "",
      linkedinUrl: member.linkedinUrl ?? "",
      photoUrl: member.photoUrl ?? "",
      displayOrder: String(member.displayOrder ?? 0),
    });
    setDialogOpen(true);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo must be smaller than 5 MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    try {
      const token = await getToken();
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await urlRes.json();

      setUploadProgress(30);

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      setUploadProgress(100);
      setForm((f) => ({ ...f, photoUrl: objectPath }));
    } catch (err) {
      alert("Photo upload failed. Please try again or paste a URL manually.");
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      title: form.title,
      role: form.role,
      bio: form.bio || undefined,
      email: form.email || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      photoUrl: form.photoUrl || undefined,
      displayOrder: parseInt(form.displayOrder, 10) || 0,
    };
    if (editing !== null) {
      await updateMember.mutateAsync({ id: editing, data: payload });
    } else {
      await createMember.mutateAsync({ data: payload });
    }
    queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
    setDialogOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Remove "${name}" from the team?`)) return;
    await deleteMember.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
  };

  const saving = createMember.isPending || updateMember.isPending;
  const currentPhotoSrc = getPhotoSrc(form.photoUrl);
  const avatarColor = form.name ? getAvatarColor(form.name) : AVATAR_PALETTE[0];

  return (
    <AdminLayout title="Team">
      <div className="space-y-5" data-testid="admin-team">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-foreground">Team Members</h2>
            <p className="text-sm text-muted-foreground">Manage researchers, scientists, and staff profiles.</p>
          </div>
          <Button size="sm" onClick={openCreate} data-testid="create-member-btn">
            <Plus size={14} className="mr-1.5" /> Add Member
          </Button>
        </div>

        <div className="bg-card border border-card-border rounded-xl overflow-hidden" data-testid="team-table">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : !members || members.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground" data-testid="no-members">
              <Users size={40} className="mx-auto mb-3 opacity-20" />
              <p className="mb-3">No team members yet.</p>
              <Button size="sm" variant="outline" onClick={openCreate}>Add first member</Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Role</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const photoSrc = getPhotoSrc(member.photoUrl);
                  const color = getAvatarColor(member.name);
                  return (
                    <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors" data-testid={`member-row-${member.id}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {photoSrc ? (
                            <img src={photoSrc} alt={member.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                              style={{ background: color.bg, color: color.text }}
                            >
                              {getInitials(member.name)}
                            </div>
                          )}
                          <span className="font-medium text-foreground" data-testid={`member-name-row-${member.id}`}>{member.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">{member.title}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">{roleLabel[member.role] || member.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(member)} data-testid={`edit-member-${member.id}`}>
                            <Edit size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-destructive"
                            onClick={() => handleDelete(member.id, member.name)}
                            disabled={deleteMember.isPending}
                            data-testid={`delete-member-${member.id}`}
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="member-dialog">
          <DialogHeader>
            <DialogTitle>{editing !== null ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="memberName" className="mb-1.5 block">Full Name <span className="text-destructive">*</span></Label>
              <Input id="memberName" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="member-name-input" />
            </div>
            <div>
              <Label htmlFor="memberTitle" className="mb-1.5 block">Title / Position <span className="text-destructive">*</span></Label>
              <Input id="memberTitle" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Research Associate" data-testid="member-title-input" />
            </div>
            <div>
              <Label className="mb-1.5 block">Role <span className="text-destructive">*</span></Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger data-testid="member-role-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{roleLabel[r]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="memberEmail" className="mb-1.5 block">Email</Label>
              <Input id="memberEmail" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="member-email-input" />
            </div>
            <div>
              <Label htmlFor="memberLinkedin" className="mb-1.5 block">LinkedIn URL</Label>
              <Input
                id="memberLinkedin"
                type="url"
                placeholder="https://www.linkedin.com/in/username"
                value={form.linkedinUrl}
                onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                data-testid="member-linkedin-input"
              />
            </div>

            <div>
              <Label className="mb-2 block">Photo</Label>
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg border border-border/40"
                  style={currentPhotoSrc ? undefined : { background: avatarColor.bg, color: avatarColor.text }}
                >
                  {currentPhotoSrc ? (
                    <img src={currentPhotoSrc} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    form.name ? getInitials(form.name) : <Users size={20} className="opacity-40" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
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
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="upload-photo-btn"
                  >
                    {uploading ? (
                      <><Loader2 size={13} className="mr-1.5 animate-spin" /> Uploading {uploadProgress}%</>
                    ) : form.photoUrl ? (
                      <><Upload size={13} className="mr-1.5" /> Replace Photo</>
                    ) : (
                      <><Upload size={13} className="mr-1.5" /> Upload Photo</>
                    )}
                  </Button>
                  {form.photoUrl ? (
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md px-2.5 py-1.5">
                      <span className="truncate">Photo uploaded</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0"
                        onClick={() => setForm((f) => ({ ...f, photoUrl: "" }))}
                        data-testid="remove-photo-btn"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">JPG or PNG, up to 5MB.</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="memberBio" className="mb-1.5 block">Bio</Label>
              <Textarea id="memberBio" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="resize-none" data-testid="member-bio-input" />
            </div>
            <div>
              <Label htmlFor="memberOrder" className="mb-1.5 block">Display Order</Label>
              <Input id="memberOrder" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} data-testid="member-order-input" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-testid="member-dialog-cancel">Cancel</Button>
              <Button type="submit" disabled={saving || uploading} data-testid="member-dialog-save">
                {saving ? "Saving..." : editing !== null ? "Update Member" : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
