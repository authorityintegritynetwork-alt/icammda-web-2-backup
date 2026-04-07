import { useState } from "react";
import { Plus, Edit, Trash2, FlaskConical, Users, ChevronDown, ChevronRight } from "lucide-react";
import {
  useListResearchGroups,
  useListResearchMembers,
  useCreateResearchGroup,
  useUpdateResearchGroup,
  useDeleteResearchGroup,
  useCreateResearchMember,
  useUpdateResearchMember,
  useDeleteResearchMember,
  getListResearchGroupsQueryKey,
  getListResearchMembersQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";

type ResearchMember = {
  id: number;
  groupId?: number | null;
  name: string;
  role: string;
  affiliation?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  isVisiting: boolean;
  order: number;
};

type ResearchGroup = {
  id: number;
  name: string;
  description?: string | null;
  order: number;
  members: ResearchMember[];
};

const EMPTY_GROUP = { name: "", description: "", order: "0" };
const EMPTY_MEMBER = { name: "", role: "", affiliation: "", email: "", photoUrl: "", isVisiting: false, order: "0" };

function getInitials(name: string) {
  return name.replace(/\(.*?\)/g, "").trim().split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");
}

export default function ResearchAdmin() {
  const { data: groups, isLoading } = useListResearchGroups();
  const createGroup = useCreateResearchGroup();
  const updateGroup = useUpdateResearchGroup();
  const deleteGroup = useDeleteResearchGroup();
  const createMember = useCreateResearchMember();
  const updateMember = useUpdateResearchMember();
  const deleteMember = useDeleteResearchMember();
  const queryClient = useQueryClient();

  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  const [groupDialog, setGroupDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<number | null>(null);
  const [groupForm, setGroupForm] = useState(EMPTY_GROUP);

  const [memberDialog, setMemberDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [memberTargetGroupId, setMemberTargetGroupId] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);

  const { data: visitingMembers, isLoading: visitorsLoading } = useListResearchMembers({ visiting: true } as Parameters<typeof useListResearchMembers>[0]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListResearchGroupsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListResearchMembersQueryKey() });
  };

  const toggleGroup = (id: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCreateGroup = () => { setEditingGroup(null); setGroupForm(EMPTY_GROUP); setGroupDialog(true); };
  const openEditGroup = (g: ResearchGroup) => {
    setEditingGroup(g.id);
    setGroupForm({ name: g.name, description: g.description ?? "", order: String(g.order) });
    setGroupDialog(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: groupForm.name, description: groupForm.description || null, order: parseInt(groupForm.order, 10) || 0 };
    if (editingGroup !== null) {
      await updateGroup.mutateAsync({ id: editingGroup, ...payload });
    } else {
      await createGroup.mutateAsync(payload);
    }
    invalidate();
    setGroupDialog(false);
  };

  const handleDeleteGroup = async (id: number, name: string) => {
    if (!confirm(`Delete group "${name}" and all its members?`)) return;
    await deleteGroup.mutateAsync({ id });
    invalidate();
  };

  const openCreateMember = (groupId: number | null) => {
    setEditingMember(null);
    setMemberTargetGroupId(groupId);
    setMemberForm({ ...EMPTY_MEMBER, isVisiting: groupId === null });
    setMemberDialog(true);
  };

  const openEditMember = (m: ResearchMember) => {
    setEditingMember(m.id);
    setMemberTargetGroupId(m.groupId ?? null);
    setMemberForm({
      name: m.name,
      role: m.role,
      affiliation: m.affiliation ?? "",
      email: m.email ?? "",
      photoUrl: m.photoUrl ?? "",
      isVisiting: m.isVisiting,
      order: String(m.order),
    });
    setMemberDialog(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      groupId: memberTargetGroupId,
      name: memberForm.name,
      role: memberForm.role,
      affiliation: memberForm.affiliation || null,
      email: memberForm.email || null,
      photoUrl: memberForm.photoUrl || null,
      isVisiting: memberForm.isVisiting,
      order: parseInt(memberForm.order, 10) || 0,
    };
    if (editingMember !== null) {
      await updateMember.mutateAsync({ id: editingMember, ...payload });
    } else {
      await createMember.mutateAsync(payload);
    }
    invalidate();
    setMemberDialog(false);
  };

  const handleDeleteMember = async (id: number, name: string) => {
    if (!confirm(`Remove "${name}" from this group?`)) return;
    await deleteMember.mutateAsync({ id });
    invalidate();
  };

  const savingGroup = createGroup.isPending || updateGroup.isPending;
  const savingMember = createMember.isPending || updateMember.isPending;
  const visitors = (visitingMembers ?? []) as ResearchMember[];

  return (
    <AdminLayout title="Research">
      <div className="space-y-6" data-testid="admin-research">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-foreground">Research Groups</h2>
            <p className="text-sm text-muted-foreground">Manage research groups, members, and visiting scholars.</p>
          </div>
          <Button size="sm" onClick={openCreateGroup} data-testid="create-group-btn">
            <Plus size={14} className="mr-1.5" /> Add Group
          </Button>
        </div>

        {/* Groups list */}
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)
          ) : !groups || groups.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bg-card border border-card-border rounded-xl">
              <FlaskConical size={40} className="mx-auto mb-3 opacity-20" />
              <p className="mb-3">No research groups yet.</p>
              <Button size="sm" variant="outline" onClick={openCreateGroup}>Add first group</Button>
            </div>
          ) : (
            (groups as ResearchGroup[]).map((group) => {
              const expanded = expandedGroups.has(group.id);
              return (
                <div key={group.id} className="bg-card border border-card-border rounded-xl overflow-hidden" data-testid={`group-${group.id}`}>
                  {/* Group header row */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <button className="text-muted-foreground shrink-0">
                      {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </button>
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FlaskConical size={13} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{group.name}</p>
                      {group.description && <p className="text-xs text-muted-foreground truncate">{group.description}</p>}
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">{group.members.length} member{group.members.length !== 1 ? "s" : ""}</Badge>
                    <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditGroup(group)} data-testid={`edit-group-${group.id}`}>
                        <Edit size={12} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => handleDeleteGroup(group.id, group.name)} data-testid={`delete-group-${group.id}`}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>

                  {/* Members */}
                  {expanded && (
                    <div className="border-t border-border bg-muted/20 px-4 py-3 space-y-2">
                      {group.members.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">No members yet.</p>
                      ) : (
                        group.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-3 bg-background rounded-lg p-2.5 border border-border/60" data-testid={`member-${member.id}`}>
                            {member.photoUrl ? (
                              <img src={member.photoUrl} alt={member.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-border" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                <span className="text-primary text-[10px] font-bold">{getInitials(member.name)}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}{member.affiliation ? ` · ${member.affiliation}` : ""}</p>
                            </div>
                            {member.isVisiting && <Badge variant="outline" className="text-[10px] shrink-0">Visiting</Badge>}
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditMember(member)} data-testid={`edit-member-${member.id}`}>
                                <Edit size={11} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => handleDeleteMember(member.id, member.name)} data-testid={`delete-member-${member.id}`}>
                                <Trash2 size={11} />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                      <Button size="sm" variant="outline" className="w-full mt-1 h-8 text-xs" onClick={() => openCreateMember(group.id)} data-testid={`add-member-${group.id}`}>
                        <Plus size={12} className="mr-1" /> Add Member to this Group
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Visiting scholars section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Visiting Scholars &amp; Interns</h3>
              <p className="text-xs text-muted-foreground">Members not attached to a specific research group.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => openCreateMember(null)} data-testid="add-visitor-btn">
              <Plus size={13} className="mr-1.5" /> Add Visitor
            </Button>
          </div>
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            {isLoading || visitorsLoading ? (
              <div className="p-4"><Skeleton className="h-12 rounded-lg" /></div>
            ) : visitors.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Users size={30} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No visiting scholars yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {visitors.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 px-4 py-3" data-testid={`visitor-${member.id}`}>
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-border" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                        <span className="text-violet-400 text-[10px] font-bold">{getInitials(member.name)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}{member.affiliation ? ` · ${member.affiliation}` : ""}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditMember(member)}>
                        <Edit size={11} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => handleDeleteMember(member.id, member.name)}>
                        <Trash2 size={11} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group Dialog */}
      <Dialog open={groupDialog} onOpenChange={setGroupDialog}>
        <DialogContent className="max-w-md" data-testid="group-dialog">
          <DialogHeader>
            <DialogTitle>{editingGroup !== null ? "Edit Research Group" : "Add Research Group"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveGroup} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="groupName" className="mb-1.5 block">Group Name <span className="text-destructive">*</span></Label>
              <Input id="groupName" required value={groupForm.name} onChange={(e) => setGroupForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Malaria Modelling Research Group" data-testid="group-name-input" />
            </div>
            <div>
              <Label htmlFor="groupDesc" className="mb-1.5 block">Description</Label>
              <Textarea id="groupDesc" rows={2} value={groupForm.description} onChange={(e) => setGroupForm((f) => ({ ...f, description: e.target.value }))} className="resize-none" placeholder="Brief description of this group's focus..." data-testid="group-desc-input" />
            </div>
            <div>
              <Label htmlFor="groupOrder" className="mb-1.5 block">Display Order</Label>
              <Input id="groupOrder" type="number" value={groupForm.order} onChange={(e) => setGroupForm((f) => ({ ...f, order: e.target.value }))} data-testid="group-order-input" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGroupDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={savingGroup} data-testid="group-dialog-save">
                {savingGroup ? "Saving..." : editingGroup !== null ? "Update Group" : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Member Dialog */}
      <Dialog open={memberDialog} onOpenChange={setMemberDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="member-dialog">
          <DialogHeader>
            <DialogTitle>{editingMember !== null ? "Edit Member" : "Add Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMember} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="memberName" className="mb-1.5 block">Full Name <span className="text-destructive">*</span></Label>
              <Input id="memberName" required value={memberForm.name} onChange={(e) => setMemberForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Afeez ABIDEMI (Ph.D)" data-testid="member-name-input" />
            </div>
            <div>
              <Label htmlFor="memberRole" className="mb-1.5 block">Role / Position <span className="text-destructive">*</span></Label>
              <Input id="memberRole" required value={memberForm.role} onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. PhD Scholar, Post-doctoral Scientist" data-testid="member-role-input" />
            </div>
            <div>
              <Label htmlFor="memberAffil" className="mb-1.5 block">Affiliation <span className="text-muted-foreground font-normal">(for visiting scholars)</span></Label>
              <Input id="memberAffil" value={memberForm.affiliation} onChange={(e) => setMemberForm((f) => ({ ...f, affiliation: e.target.value }))} placeholder="e.g. University of Ibadan" data-testid="member-affil-input" />
            </div>
            <div>
              <Label htmlFor="memberEmail" className="mb-1.5 block">Email</Label>
              <Input id="memberEmail" type="email" value={memberForm.email} onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))} data-testid="member-email-input" />
            </div>
            <div>
              <Label htmlFor="memberPhoto" className="mb-1.5 block">Photo URL</Label>
              <Input id="memberPhoto" type="url" value={memberForm.photoUrl} onChange={(e) => setMemberForm((f) => ({ ...f, photoUrl: e.target.value }))} placeholder="https://..." data-testid="member-photo-input" />
              {memberForm.photoUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={memberForm.photoUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="memberVisiting"
                checked={memberForm.isVisiting}
                onCheckedChange={(v) => setMemberForm((f) => ({ ...f, isVisiting: v }))}
                data-testid="member-visiting-switch"
              />
              <Label htmlFor="memberVisiting" className="cursor-pointer">Visiting Scholar / Intern</Label>
            </div>
            <div>
              <Label htmlFor="memberOrder" className="mb-1.5 block">Display Order</Label>
              <Input id="memberOrder" type="number" value={memberForm.order} onChange={(e) => setMemberForm((f) => ({ ...f, order: e.target.value }))} data-testid="member-order-input" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMemberDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={savingMember} data-testid="member-dialog-save">
                {savingMember ? "Saving..." : editingMember !== null ? "Update Member" : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
