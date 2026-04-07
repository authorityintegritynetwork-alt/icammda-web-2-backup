import { useState } from "react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Users } from "lucide-react";
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

const ROLES = ["director", "researcher", "postdoc", "staff"];
const roleLabel: Record<string, string> = { director: "Director", researcher: "Researcher", postdoc: "Postdoctoral Scientist", staff: "Staff" };

interface FormState {
  name: string;
  title: string;
  role: string;
  bio: string;
  email: string;
  photoUrl: string;
  displayOrder: string;
}

const EMPTY: FormState = { name: "", title: "", role: "researcher", bio: "", email: "", photoUrl: "", displayOrder: "0" };

export default function TeamList() {
  const { data: members, isLoading } = useListTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (member: NonNullable<typeof members>[0]) => {
    setEditing(member.id);
    setForm({
      name: member.name,
      title: member.title,
      role: member.role,
      bio: member.bio ?? "",
      email: member.email ?? "",
      photoUrl: member.photoUrl ?? "",
      displayOrder: String(member.displayOrder ?? 0),
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      title: form.title,
      role: form.role,
      bio: form.bio || undefined,
      email: form.email || undefined,
      photoUrl: form.photoUrl || undefined,
      displayOrder: parseInt(form.displayOrder, 10) || 0,
    };
    if (editing !== null) {
      await updateMember.mutateAsync({ id: editing, ...payload });
    } else {
      await createMember.mutateAsync(payload);
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
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors" data-testid={`member-row-${member.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users size={14} className="text-primary/50" />
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
                ))}
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
              <Label htmlFor="memberPhoto" className="mb-1.5 block">Photo URL</Label>
              <Input id="memberPhoto" type="url" value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} placeholder="https://..." data-testid="member-photo-input" />
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
              <Button type="submit" disabled={saving} data-testid="member-dialog-save">
                {saving ? "Saving..." : editing !== null ? "Update Member" : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
