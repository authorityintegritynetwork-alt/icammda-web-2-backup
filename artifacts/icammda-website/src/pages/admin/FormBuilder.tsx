import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { useAuth } from "@clerk/react";
import {
  ArrowLeft, Plus, GripVertical, Trash2, Settings, Save, Eye, ExternalLink, Loader2,
  Type as TypeIcon, AlignLeft, Mail, Phone, ListChecks, CheckSquare, Circle, ChevronDown, Calendar, Hash, Upload as UploadIcon, Heading, FileText as ConsentIcon,
} from "lucide-react";
import {
  useGetForm,
  useUpdateForm,
  useReplaceFormFields,
  useListEvents,
  getGetFormQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragOverlay, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────── Field type catalog ───────────
type FieldType =
  | "short_text" | "long_text" | "email" | "phone" | "number" | "date"
  | "select" | "radio" | "checkboxes" | "file" | "consent" | "section";

interface FieldDef {
  type: FieldType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasOptions?: boolean;
  defaultLabel: string;
}

const FIELD_TYPES: FieldDef[] = [
  { type: "short_text", label: "Short text", icon: TypeIcon, defaultLabel: "Untitled" },
  { type: "long_text", label: "Long text", icon: AlignLeft, defaultLabel: "Untitled" },
  { type: "email", label: "Email", icon: Mail, defaultLabel: "Email address" },
  { type: "phone", label: "Phone", icon: Phone, defaultLabel: "Phone number" },
  { type: "number", label: "Number", icon: Hash, defaultLabel: "Untitled" },
  { type: "date", label: "Date", icon: Calendar, defaultLabel: "Date" },
  { type: "select", label: "Dropdown", icon: ChevronDown, hasOptions: true, defaultLabel: "Choose one" },
  { type: "radio", label: "Single choice", icon: Circle, hasOptions: true, defaultLabel: "Choose one" },
  { type: "checkboxes", label: "Multi-choice", icon: CheckSquare, hasOptions: true, defaultLabel: "Choose any" },
  { type: "file", label: "File upload", icon: UploadIcon, defaultLabel: "Upload a file" },
  { type: "consent", label: "Consent checkbox", icon: ConsentIcon, defaultLabel: "I agree to the terms" },
  { type: "section", label: "Section heading", icon: Heading, defaultLabel: "Section" },
];

interface BuilderField {
  uid: string; // local-only id for sortable
  fieldKey: string;
  type: FieldType;
  label: string;
  helpText?: string | null;
  placeholder?: string | null;
  required: boolean;
  options?: { choices?: string[] } | null;
  conditional?: { fieldKey?: string; equals?: string } | null;
  order: number;
}

function uid(): string { return Math.random().toString(36).slice(2, 10); }
function keyFromLabel(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "field_" + uid();
}

// ─────────── Sortable item ───────────
function SortableField({
  field, onEdit, onRemove, isSelected,
}: { field: BuilderField; onEdit: () => void; onRemove: () => void; isSelected: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.uid });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const Icon = FIELD_TYPES.find((t) => t.type === field.type)?.icon ?? TypeIcon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onEdit}
      className={`group border rounded-lg bg-white px-3 py-3 flex items-center gap-3 hover:border-primary/50 cursor-pointer transition ${isSelected ? "border-primary ring-1 ring-primary/30" : ""}`}
      data-testid={`field-${field.uid}`}
    >
      <button type="button" className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground touch-none" {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
        <GripVertical className="w-4 h-4" />
      </button>
      <Icon className="w-4 h-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {field.type === "section" ? <span className="text-primary">— {field.label} —</span> : field.label}
          {field.required && field.type !== "section" && <span className="text-destructive ml-1">*</span>}
        </div>
        <div className="text-[11px] text-muted-foreground">{FIELD_TYPES.find((t) => t.type === field.type)?.label}{field.conditional?.fieldKey && " · conditional"}</div>
      </div>
      <button type="button" className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─────────── Main builder ───────────
export default function FormBuilder() {
  const params = useParams();
  const formId = parseInt(params.id ?? "", 10);
  const { data: form, isLoading } = useGetForm(formId, { query: { enabled: Number.isFinite(formId) } });
  const { data: events } = useListEvents();
  const updateForm = useUpdateForm();
  const replaceFields = useReplaceFormFields();
  const qc = useQueryClient();

  const [tab, setTab] = useState<"build" | "settings">("build");

  // Builder state
  const [fields, setFields] = useState<BuilderField[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const initialised = useRef(false);

  // Settings state
  const [meta, setMeta] = useState({
    title: "", slug: "", description: "", status: "draft", eventId: null as number | null,
    capacity: "", closeDate: "", waitlistEnabled: false, successMessage: "",
  });

  useEffect(() => {
    if (!form || initialised.current) return;
    initialised.current = true;
    setFields((form.fields ?? []).map((f, idx) => ({
      uid: uid(),
      fieldKey: f.fieldKey,
      type: f.type as FieldType,
      label: f.label,
      helpText: f.helpText ?? "",
      placeholder: f.placeholder ?? "",
      required: !!f.required,
      options: (f.options ?? null) as BuilderField["options"],
      conditional: (f.conditional ?? null) as BuilderField["conditional"],
      order: f.order ?? idx,
    })));
    setMeta({
      title: form.title,
      slug: form.slug,
      description: form.description ?? "",
      status: form.status,
      eventId: form.eventId ?? null,
      capacity: form.capacity != null ? String(form.capacity) : "",
      closeDate: form.closeDate ? new Date(form.closeDate).toISOString().slice(0, 16) : "",
      waitlistEnabled: !!form.waitlistEnabled,
      successMessage: form.successMessage ?? "",
    });
  }, [form]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setFields((items) => {
      const oldIdx = items.findIndex((i) => i.uid === active.id);
      const newIdx = items.findIndex((i) => i.uid === over.id);
      return arrayMove(items, oldIdx, newIdx);
    });
  };

  const addField = (type: FieldType) => {
    const def = FIELD_TYPES.find((t) => t.type === type)!;
    const newField: BuilderField = {
      uid: uid(),
      fieldKey: keyFromLabel(def.defaultLabel) + "_" + uid().slice(0, 4),
      type,
      label: def.defaultLabel,
      required: false,
      options: def.hasOptions ? { choices: ["Option 1", "Option 2"] } : null,
      conditional: null,
      order: fields.length,
    };
    setFields((f) => [...f, newField]);
    setSelectedUid(newField.uid);
  };

  const updateField = (uidVal: string, patch: Partial<BuilderField>) => {
    setFields((items) => items.map((f) => f.uid === uidVal ? { ...f, ...patch } : f));
  };

  const removeField = (uidVal: string) => {
    setFields((items) => items.filter((f) => f.uid !== uidVal));
    if (selectedUid === uidVal) setSelectedUid(null);
  };

  const selected = fields.find((f) => f.uid === selectedUid) || null;

  const handleSave = async () => {
    // Save metadata
    await updateForm.mutateAsync({
      id: formId,
      data: {
        title: meta.title.trim(),
        slug: meta.slug.trim(),
        description: meta.description.trim() || null,
        status: meta.status,
        eventId: meta.eventId,
        capacity: meta.capacity ? parseInt(meta.capacity, 10) : null,
        closeDate: meta.closeDate ? new Date(meta.closeDate).toISOString() : null,
        waitlistEnabled: meta.waitlistEnabled,
        successMessage: meta.successMessage.trim() || null,
      },
    });
    // Save fields
    await replaceFields.mutateAsync({
      id: formId,
      data: {
        fields: fields.map((f, idx) => ({
          fieldKey: f.fieldKey,
          type: f.type,
          label: f.label,
          helpText: f.helpText || null,
          placeholder: f.placeholder || null,
          required: f.required,
          options: f.options ?? null,
          conditional: f.conditional?.fieldKey ? f.conditional : null,
          order: idx,
        })),
      },
    });
    qc.invalidateQueries({ queryKey: getGetFormQueryKey(formId) });
  };

  const saving = updateForm.isPending || replaceFields.isPending;

  if (!Number.isFinite(formId)) {
    return <AdminLayout title="Form not found"><p>Invalid form id.</p></AdminLayout>;
  }
  if (isLoading || !form) {
    return <AdminLayout title="Loading..."><Skeleton className="h-96 w-full" /></AdminLayout>;
  }

  return (
    <AdminLayout title={meta.title || form.title} description="Drag fields from the palette, click any field to edit, then save.">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <Link href="/admin/forms"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1.5" /> All forms</Button></Link>
        <div className="flex items-center gap-2">
          {form.status === "published" && (
            <a href={`/forms/${form.slug}`} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View public</Button>
            </a>
          )}
          <Link href={`/admin/forms/${formId}/submissions`}>
            <Button variant="outline" size="sm"><Eye className="w-3.5 h-3.5 mr-1.5" /> Submissions ({form.submissionCount})</Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} data-testid="save-form-btn">
            {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
            Save
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "build" | "settings")} className="mb-4">
        <TabsList>
          <TabsTrigger value="build"><Type className="w-3.5 h-3.5 mr-1.5" /> Build</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="w-3.5 h-3.5 mr-1.5" /> Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-[200px,1fr,300px] gap-4">
            {/* Palette */}
            <div className="border rounded-lg p-3 bg-muted/20 h-fit">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Add field</p>
              <div className="space-y-1">
                {FIELD_TYPES.map((t) => (
                  <button key={t.type} type="button" onClick={() => addField(t.type)} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white text-sm" data-testid={`add-${t.type}`}>
                    <t.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="border rounded-lg p-4 bg-muted/10 min-h-[400px]">
              {fields.length === 0 ? (
                <div className="text-center py-16">
                  <Plus className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Click a field type on the left to add it.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={fields.map((f) => f.uid)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {fields.map((f) => (
                        <SortableField key={f.uid} field={f} onEdit={() => setSelectedUid(f.uid)} onRemove={() => removeField(f.uid)} isSelected={selectedUid === f.uid} />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay />
                </DndContext>
              )}
            </div>

            {/* Property panel */}
            <div className="border rounded-lg p-4 bg-white h-fit sticky top-4">
              {selected ? (
                <FieldEditor
                  key={selected.uid}
                  field={selected}
                  allFields={fields}
                  onChange={(patch) => updateField(selected.uid, patch)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Click a field to edit its properties.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <div className="max-w-2xl space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Title</Label>
                <Input value={meta.title} onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))} />
              </div>
              <div>
                <Label className="mb-1.5 block">URL slug</Label>
                <Input value={meta.slug} onChange={(e) => setMeta((m) => ({ ...m, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") }))} />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Description</Label>
              <Textarea value={meta.description} onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Status</Label>
                <Select value={meta.status} onValueChange={(v) => setMeta((m) => ({ ...m, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (not visible)</SelectItem>
                    <SelectItem value="published">Published (live)</SelectItem>
                    <SelectItem value="closed">Closed (no new submissions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Linked event (optional)</Label>
                <Select value={meta.eventId == null ? "_none" : String(meta.eventId)} onValueChange={(v) => setMeta((m) => ({ ...m, eventId: v === "_none" ? null : parseInt(v, 10) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">— Standalone form —</SelectItem>
                    {(events ?? []).map((ev) => (
                      <SelectItem key={ev.id} value={String(ev.id)}>{ev.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Capacity (optional)</Label>
                <Input type="number" min="1" value={meta.capacity} onChange={(e) => setMeta((m) => ({ ...m, capacity: e.target.value }))} placeholder="No limit" />
              </div>
              <div>
                <Label className="mb-1.5 block">Close date (optional)</Label>
                <Input type="datetime-local" value={meta.closeDate} onChange={(e) => setMeta((m) => ({ ...m, closeDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium text-sm">Enable waitlist</p>
                <p className="text-xs text-muted-foreground">Once capacity is reached, additional submissions become waitlisted instead of rejected.</p>
              </div>
              <Switch checked={meta.waitlistEnabled} onCheckedChange={(v) => setMeta((m) => ({ ...m, waitlistEnabled: v }))} />
            </div>
            <div>
              <Label className="mb-1.5 block">Success message shown after submit (optional)</Label>
              <Textarea value={meta.successMessage} onChange={(e) => setMeta((m) => ({ ...m, successMessage: e.target.value }))} rows={2} placeholder="Thank you! We'll be in touch soon." />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

// Avoid name collision with HTML "Type" element; Lucide Type alias
const Type = TypeIcon;

// ─────────── Field property editor ───────────
function FieldEditor({ field, allFields, onChange }: { field: BuilderField; allFields: BuilderField[]; onChange: (patch: Partial<BuilderField>) => void }) {
  const def = FIELD_TYPES.find((t) => t.type === field.type)!;
  const candidatesForCondition = allFields.filter((f) => f.uid !== field.uid && (f.type === "select" || f.type === "radio" || f.type === "consent"));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b">
        <def.icon className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-semibold">{def.label}</p>
      </div>
      <div>
        <Label className="mb-1.5 block text-xs">Label</Label>
        <Input value={field.label} onChange={(e) => onChange({ label: e.target.value, fieldKey: field.fieldKey || keyFromLabel(e.target.value) })} />
      </div>
      {field.type !== "section" && field.type !== "consent" && (
        <div>
          <Label className="mb-1.5 block text-xs">Help text</Label>
          <Input value={field.helpText ?? ""} onChange={(e) => onChange({ helpText: e.target.value })} />
        </div>
      )}
      {(field.type === "short_text" || field.type === "long_text" || field.type === "email" || field.type === "phone" || field.type === "number") && (
        <div>
          <Label className="mb-1.5 block text-xs">Placeholder</Label>
          <Input value={field.placeholder ?? ""} onChange={(e) => onChange({ placeholder: e.target.value })} />
        </div>
      )}
      {def.hasOptions && (
        <div>
          <Label className="mb-1.5 block text-xs">Options (one per line)</Label>
          <Textarea
            rows={4}
            value={(field.options?.choices ?? []).join("\n")}
            onChange={(e) => onChange({ options: { choices: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) } })}
          />
        </div>
      )}
      {field.type !== "section" && (
        <div className="flex items-center justify-between">
          <Label className="text-xs">Required</Label>
          <Switch checked={field.required} onCheckedChange={(v) => onChange({ required: v })} />
        </div>
      )}
      {field.type !== "section" && candidatesForCondition.length > 0 && (
        <div className="border-t pt-3">
          <Label className="mb-1.5 block text-xs">Conditional visibility (optional)</Label>
          <p className="text-[10px] text-muted-foreground mb-2">Show this field only when another single-choice field has a specific value.</p>
          <Select
            value={field.conditional?.fieldKey ?? "_none"}
            onValueChange={(v) => onChange({ conditional: v === "_none" ? null : { fieldKey: v, equals: "" } })}
          >
            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">— Always show —</SelectItem>
              {candidatesForCondition.map((c) => <SelectItem key={c.uid} value={c.fieldKey}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {field.conditional?.fieldKey && (() => {
            const target = allFields.find((f) => f.fieldKey === field.conditional!.fieldKey);
            const choices = target?.type === "consent" ? ["true", "false"] : (target?.options?.choices ?? []);
            return (
              <div className="mt-2">
                <Label className="mb-1.5 block text-xs">Equals</Label>
                <Select value={String(field.conditional?.equals ?? "")} onValueChange={(v) => onChange({ conditional: { ...field.conditional!, equals: v } })}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Select value" /></SelectTrigger>
                  <SelectContent>
                    {choices.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// silence eslint about unused import; useAuth is reserved for future file uploads
void useAuth;
