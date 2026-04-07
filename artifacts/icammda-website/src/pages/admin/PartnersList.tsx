import { useState } from "react";
import { Plus, Edit, Trash2, Handshake } from "lucide-react";
import {
  useListPartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  getListPartnersQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";

interface FormState {
  name: string;
  website: string;
  logoUrl: string;
  description: string;
  displayOrder: string;
}

const EMPTY: FormState = { name: "", website: "", logoUrl: "", description: "", displayOrder: "0" };

export default function PartnersList() {
  const { data: partners, isLoading } = useListPartners();
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (partner: NonNullable<typeof partners>[0]) => {
    setEditing(partner.id);
    setForm({
      name: partner.name,
      website: partner.website ?? "",
      logoUrl: partner.logoUrl ?? "",
      description: partner.description ?? "",
      displayOrder: String(partner.displayOrder ?? 0),
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      website: form.website || undefined,
      logoUrl: form.logoUrl || undefined,
      description: form.description || undefined,
      displayOrder: parseInt(form.displayOrder, 10) || 0,
    };
    if (editing !== null) {
      await updatePartner.mutateAsync({ id: editing, ...payload });
    } else {
      await createPartner.mutateAsync(payload);
    }
    queryClient.invalidateQueries({ queryKey: getListPartnersQueryKey() });
    setDialogOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Remove partner "${name}"?`)) return;
    await deletePartner.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListPartnersQueryKey() });
  };

  const saving = createPartner.isPending || updatePartner.isPending;

  return (
    <AdminLayout title="Partners">
      <div className="space-y-5" data-testid="admin-partners">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-foreground">Partners</h2>
            <p className="text-sm text-muted-foreground">Manage partner and collaborating institutions.</p>
          </div>
          <Button size="sm" onClick={openCreate} data-testid="create-partner-btn">
            <Plus size={14} className="mr-1.5" /> Add Partner
          </Button>
        </div>

        <div className="bg-card border border-card-border rounded-xl overflow-hidden" data-testid="partners-table">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : !partners || partners.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground" data-testid="no-partners">
              <Handshake size={40} className="mx-auto mb-3 opacity-20" />
              <p className="mb-3">No partners yet.</p>
              <Button size="sm" variant="outline" onClick={openCreate}>Add first partner</Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-muted/30 border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                  data-testid={`partner-card-${partner.id}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={partner.name} className="h-10 max-w-[100px] object-contain" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Handshake size={16} className="text-primary/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate" data-testid={`partner-name-${partner.id}`}>{partner.name}</p>
                      {partner.website && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">
                          {partner.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </div>
                  {partner.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{partner.description}</p>}
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => openEdit(partner)} data-testid={`edit-partner-${partner.id}`}>
                      <Edit size={12} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 hover:text-destructive"
                      onClick={() => handleDelete(partner.id, partner.name)}
                      disabled={deletePartner.isPending}
                      data-testid={`delete-partner-${partner.id}`}
                    >
                      <Trash2 size={12} className="mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" data-testid="partner-dialog">
          <DialogHeader>
            <DialogTitle>{editing !== null ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="partnerName" className="mb-1.5 block">Partner Name <span className="text-destructive">*</span></Label>
              <Input id="partnerName" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="partner-name-input" />
            </div>
            <div>
              <Label htmlFor="partnerWebsite" className="mb-1.5 block">Website URL</Label>
              <Input id="partnerWebsite" type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://..." data-testid="partner-website-input" />
            </div>
            <div>
              <Label htmlFor="partnerLogo" className="mb-1.5 block">Logo URL</Label>
              <Input id="partnerLogo" type="url" value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} placeholder="https://..." data-testid="partner-logo-input" />
            </div>
            <div>
              <Label htmlFor="partnerDesc" className="mb-1.5 block">Description</Label>
              <Textarea id="partnerDesc" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="resize-none" data-testid="partner-description-input" />
            </div>
            <div>
              <Label htmlFor="partnerOrder" className="mb-1.5 block">Display Order</Label>
              <Input id="partnerOrder" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} data-testid="partner-order-input" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-testid="partner-dialog-cancel">Cancel</Button>
              <Button type="submit" disabled={saving} data-testid="partner-dialog-save">
                {saving ? "Saving..." : editing !== null ? "Update Partner" : "Add Partner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
