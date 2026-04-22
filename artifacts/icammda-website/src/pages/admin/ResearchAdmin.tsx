import { useRef, useState } from "react";
import { Plus, Edit, Trash2, FlaskConical, Users, ChevronDown, ChevronRight, Upload, Loader2, BookOpen, ExternalLink } from "lucide-react";
import { useAuth } from "@clerk/react";
import {
  useListResearchGroups,
  useListResearchMembers,
  useCreateResearchGroup,
  useUpdateResearchGroup,
  useDeleteResearchGroup,
  useCreateResearchMember,
  useUpdateResearchMember,
  useDeleteResearchMember,
  useListResearchPublications,
  useCreateResearchPublication,
  useUpdateResearchPublication,
  useDeleteResearchPublication,
  getListResearchGroupsQueryKey,
  getListResearchMembersQueryKey,
  getListResearchPublicationsQueryKey,
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
  const { getToken } = useAuth();

  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  const [groupDialog, setGroupDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<number | null>(null);
  const [groupForm, setGroupForm] = useState(EMPTY_GROUP);

  const [memberDialog, setMemberDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [memberTargetGroupId, setMemberTargetGroupId] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [localPreview, setLocalPreview] = useState<string>("");
  const memberFileInputRef = useRef<HTMLInputElement>(null);

  const handleMemberPhotoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo must be smaller than 5 MB.");
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return blobUrl; });
    setUploadingPhoto(true);
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
      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      setMemberForm((f) => ({ ...f, photoUrl: objectPath }));
    } catch (err) {
      alert("Photo upload failed. Please try again or paste a URL manually.");
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getMemberPhotoSrc = (url: string) => {
    if (!url) return "";
    if (url.startsWith("/objects/")) return `/api/storage/objects/${url.slice("/objects/".length)}`;
    return url;
  };

  // ── Publications state ─────────────────────────────────────────────────────
  const { data: publications, isLoading: pubsLoading } = useListResearchPublications();
  const createPub = useCreateResearchPublication();
  const updatePub = useUpdateResearchPublication();
  const deletePub = useDeleteResearchPublication();

  const EMPTY_PUB = { title: "", authors: "", journal: "", year: "", doi: "", url: "", abstract: "", displayOrder: "0" };
  const [pubDialog, setPubDialog] = useState(false);
  const [editingPub, setEditingPub] = useState<number | null>(null);
  const [pubForm, setPubForm] = useState(EMPTY_PUB);

  const openCreatePub = () => { setEditingPub(null); setPubForm(EMPTY_PUB); setPubDialog(true); };
  const openEditPub = (p: NonNullable<typeof publications>[0]) => {
    setEditingPub(p.id);
    setPubForm({
      title: p.title,
      authors: p.authors,
      journal: p.journal ?? "",
      year: p.year != null ? String(p.year) : "",
      doi: p.doi ?? "",
      url: p.url ?? "",
      abstract: p.abstract ?? "",
      displayOrder: String(p.displayOrder ?? 0),
    });
    setPubDialog(true);
  };

  const handleSavePub = async (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = pubForm.year.trim() ? parseInt(pubForm.year, 10) : null;
    const payload = {
      title: pubForm.title.trim(),
      authors: pubForm.authors.trim(),
      journal: pubForm.journal.trim() || null,
      year: Number.isFinite(yearNum as number) ? (yearNum as number) : null,
      doi: pubForm.doi.trim() || null,
      url: pubForm.url.trim() || null,
      abstract: pubForm.abstract.trim() || null,
      displayOrder: parseInt(pubForm.displayOrder, 10) || 0,
    };
    if (editingPub !== null) {
      await updatePub.mutateAsync({ id: editingPub, data: payload });
    } else {
      await createPub.mutateAsync({ data: payload });
    }
    queryClient.invalidateQueries({ queryKey: getListResearchPublicationsQueryKey() });
    setPubDialog(false);
  };

  const handleDeletePub = async (id: number, title: string) => {
    if (!confirm(`Delete publication "${title}"?`)) return;
    await deletePub.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListResearchPublicationsQueryKey() });
  };

  const savingPub = createPub.isPending || updatePub.isPending;

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
      await updateGroup.mutateAsync({ id: editingGroup, data: payload });
    } else {
      await createGroup.mutateAsync({ data: payload });
    }
    invalidate();
    setGroupDialog(false);
  };

  const handleDeleteGroup = async (id: number, name: string) => {
    if (!confirm(`Delete group "${name}" and all its members?`)) return;
    await deleteGroup.mutateAsync({ id });
    invalidate();
  };

  const clearLocalPreview = () => {
    setLocalPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return ""; });
  };

  const openCreateMember = (groupId: number | null) => {
    setEditingMember(null);
    setMemberTargetGroupId(groupId);
    setMemberForm({ ...EMPTY_MEMBER, isVisiting: groupId === null });
    clearLocalPreview();
    setMemberDialog(true);
  };

  const openEditMember = (m: ResearchMember) => {
    setEditingMember(m.id);
    setMemberTargetGroupId(m.groupId ?? null);
    clearLocalPreview();
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
      await updateMember.mutateAsync({ id: editingMember, data: payload });
    } else {
      await createMember.mutateAsync({ data: payload });
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
                              <img src={getMemberPhotoSrc(member.photoUrl)} alt={member.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-border" />
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
                      <img src={getMemberPhotoSrc(member.photoUrl)} alt={member.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-border" />
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

      {/* ── Publications section ── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Publications</h3>
            <p className="text-xs text-muted-foreground">Journal articles, book chapters, and other research outputs.</p>
          </div>
          <Button size="sm" variant="outline" onClick={openCreatePub} data-testid="add-publication-btn">
            <Plus size={13} className="mr-1.5" /> Add Publication
          </Button>
        </div>
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          {pubsLoading ? (
            <div className="p-4 space-y-2"><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-12 rounded-lg" /></div>
          ) : !publications || publications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <BookOpen size={30} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">No publications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {publications.map((p) => (
                <div key={p.id} className="flex items-start gap-3 px-4 py-3" data-testid={`publication-${p.id}`}>
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen size={14} className="text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.authors}</p>
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5 truncate">
                      {p.journal && <span className="italic">{p.journal}</span>}
                      {p.journal && p.year ? " · " : ""}
                      {p.year && <span>{p.year}</span>}
                      {(p.doi || p.url) && (p.journal || p.year) ? " · " : ""}
                      {p.doi && <span className="font-mono">DOI: {p.doi}</span>}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground" aria-label="Open link">
                        <ExternalLink size={11} />
                      </a>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditPub(p)} data-testid={`edit-publication-${p.id}`}>
                      <Edit size={11} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => handleDeletePub(p.id, p.title)} data-testid={`delete-publication-${p.id}`}>
                      <Trash2 size={11} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Publication Dialog */}
      <Dialog open={pubDialog} onOpenChange={setPubDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="publication-dialog">
          <DialogHeader>
            <DialogTitle>{editingPub !== null ? "Edit Publication" : "Add Publication"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePub} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="pubTitle" className="mb-1.5 block">Title <span className="text-destructive">*</span></Label>
              <Textarea id="pubTitle" required rows={2} value={pubForm.title} onChange={(e) => setPubForm((f) => ({ ...f, title: e.target.value }))} className="resize-none" placeholder="Full publication title" data-testid="pub-title-input" />
            </div>
            <div>
              <Label htmlFor="pubAuthors" className="mb-1.5 block">Authors <span className="text-destructive">*</span></Label>
              <Input id="pubAuthors" required value={pubForm.authors} onChange={(e) => setPubForm((f) => ({ ...f, authors: e.target.value }))} placeholder="e.g. Smith J., Doe A., Adebayo O." data-testid="pub-authors-input" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="pubJournal" className="mb-1.5 block">Journal / Source</Label>
                <Input id="pubJournal" value={pubForm.journal} onChange={(e) => setPubForm((f) => ({ ...f, journal: e.target.value }))} placeholder="e.g. The Lancet" data-testid="pub-journal-input" />
              </div>
              <div>
                <Label htmlFor="pubYear" className="mb-1.5 block">Year</Label>
                <Input id="pubYear" type="number" value={pubForm.year} onChange={(e) => setPubForm((f) => ({ ...f, year: e.target.value }))} placeholder="2025" data-testid="pub-year-input" />
              </div>
            </div>
            <div>
              <Label htmlFor="pubDoi" className="mb-1.5 block">DOI</Label>
              <Input id="pubDoi" value={pubForm.doi} onChange={(e) => setPubForm((f) => ({ ...f, doi: e.target.value }))} placeholder="10.xxxx/xxxxxx" data-testid="pub-doi-input" />
            </div>
            <div>
              <Label htmlFor="pubUrl" className="mb-1.5 block">Link / URL</Label>
              <Input id="pubUrl" type="url" value={pubForm.url} onChange={(e) => setPubForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://doi.org/..." data-testid="pub-url-input" />
            </div>
            <div>
              <Label htmlFor="pubAbstract" className="mb-1.5 block">Abstract / Summary</Label>
              <Textarea id="pubAbstract" rows={4} value={pubForm.abstract} onChange={(e) => setPubForm((f) => ({ ...f, abstract: e.target.value }))} className="resize-none" placeholder="Optional short abstract or summary..." data-testid="pub-abstract-input" />
            </div>
            <div>
              <Label htmlFor="pubOrder" className="mb-1.5 block">Display Order</Label>
              <Input id="pubOrder" type="number" value={pubForm.displayOrder} onChange={(e) => setPubForm((f) => ({ ...f, displayOrder: e.target.value }))} data-testid="pub-order-input" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPubDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={savingPub} data-testid="publication-dialog-save">
                {savingPub ? "Saving..." : editingPub !== null ? "Update Publication" : "Create Publication"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
              <Label className="mb-2 block">Photo</Label>
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
                  {localPreview || memberForm.photoUrl ? (
                    <img
                      key={localPreview || memberForm.photoUrl}
                      src={localPreview || getMemberPhotoSrc(memberForm.photoUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-6 h-6 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={memberFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMemberPhotoUpload(file);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => memberFileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    data-testid="member-photo-upload"
                  >
                    {uploadingPhoto ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Uploading...</>
                    ) : (
                      <><Upload className="w-3.5 h-3.5 mr-1.5" />Upload photo</>
                    )}
                  </Button>
                  {memberForm.photoUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600">Photo set</span>
                      <button
                        type="button"
                        onClick={() => setMemberForm((f) => ({ ...f, photoUrl: "" }))}
                        className="text-xs text-muted-foreground hover:text-destructive underline"
                      >
                        remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!memberForm.photoUrl?.startsWith("/objects/") && (
                <div className="mt-3">
                  <Label htmlFor="memberPhotoUrl" className="mb-1.5 block text-xs text-muted-foreground">Or paste an image URL (optional)</Label>
                  <Input
                    id="memberPhotoUrl"
                    type="text"
                    value={memberForm.photoUrl}
                    onChange={(e) => setMemberForm((f) => ({ ...f, photoUrl: e.target.value }))}
                    placeholder="https://..."
                    data-testid="member-photo-input"
                  />
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
