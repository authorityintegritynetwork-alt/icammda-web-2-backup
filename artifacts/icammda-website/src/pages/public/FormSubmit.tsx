import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { CheckCircle2, AlertCircle, Loader2, Upload as UploadIcon } from "lucide-react";
import { useGetPublicForm } from "@workspace/api-client-react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PublicField {
  id: number;
  fieldKey: string;
  type: string;
  label: string;
  helpText?: string | null;
  placeholder?: string | null;
  required: boolean;
  options?: { choices?: string[] } | null;
  conditional?: { fieldKey?: string; equals?: unknown } | null;
}

export default function FormSubmit() {
  const params = useParams();
  const slug = params.slug ?? "";
  const { data: form, isLoading, error } = useGetPublicForm(slug);

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ status: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (form) {
      const init: Record<string, unknown> = {};
      for (const f of form.fields as PublicField[]) {
        if (f.type === "checkboxes") init[f.fieldKey] = [];
        else if (f.type === "consent") init[f.fieldKey] = false;
        else init[f.fieldKey] = "";
      }
      setValues(init);
    }
  }, [form]);

  if (isLoading) {
    return (
      <Wrapper>
        <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
      </Wrapper>
    );
  }

  if (error || !form) {
    return (
      <Wrapper>
        <SEO title="Form not found" noIndex />
        <div className="max-w-xl mx-auto text-center py-16">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h1 className="text-2xl font-bold">Form not found</h1>
          <p className="text-muted-foreground mt-2">The form you're looking for doesn't exist or hasn't been published.</p>
        </div>
      </Wrapper>
    );
  }

  if (form.isClosed) {
    return (
      <Wrapper>
        <SEO title={`${form.title} — Closed`} />
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold">{form.title}</h1>
          <p className="text-muted-foreground mt-3">Registration for this form is now closed.</p>
        </div>
      </Wrapper>
    );
  }

  const isFullNoWaitlist = form.isFull && !form.waitlistEnabled;

  const fields = (form.fields ?? []) as PublicField[];
  const isVisible = (f: PublicField): boolean => {
    if (!f.conditional?.fieldKey) return true;
    const target = values[f.conditional.fieldKey];
    if (target === undefined) return false;
    return String(target) === String(f.conditional.equals);
  };

  const setVal = (key: string, v: unknown) => setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Client-side required validation
    for (const f of fields) {
      if (!isVisible(f) || !f.required || f.type === "section") continue;
      const v = values[f.fieldKey];
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0) || (f.type === "consent" && v !== true)) {
        setErrorMsg(`Please complete: ${f.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/forms/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: values }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Submission failed.");
      } else {
        setResult({ status: json.status, message: json.message });
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <Wrapper>
        <SEO title={`${form.title} — Thank you`} noIndex />
        <div className="max-w-xl mx-auto text-center py-16">
          <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500 mb-4" />
          <h1 className="text-2xl font-bold">Thank you!</h1>
          <p className="text-muted-foreground mt-3 whitespace-pre-line">{result.message}</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <SEO title={form.title} description={form.description ?? undefined} />
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-0">
        <h1 className="text-3xl font-bold tracking-tight">{form.title}</h1>
        {form.description && <p className="text-muted-foreground mt-2 whitespace-pre-line">{form.description}</p>}
        {form.isFull && form.waitlistEnabled && (
          <div className="mt-4 border border-amber-200 bg-amber-50 text-amber-800 rounded-md px-3 py-2 text-sm">
            This event is full. New submissions will be added to the waitlist.
          </div>
        )}
        {isFullNoWaitlist && (
          <div className="mt-4 border border-red-200 bg-red-50 text-red-800 rounded-md px-3 py-2 text-sm">
            Registration is full and no further submissions can be accepted at this time.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {fields.map((f) => {
            if (!isVisible(f)) return null;
            if (f.type === "section") {
              return (
                <div key={f.id} className="pt-4 border-t">
                  <h2 className="text-lg font-semibold">{f.label}</h2>
                  {f.helpText && <p className="text-sm text-muted-foreground mt-1">{f.helpText}</p>}
                </div>
              );
            }
            return (
              <div key={f.id}>
                <Label className="mb-1.5 block">
                  {f.label}{f.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {f.helpText && <p className="text-xs text-muted-foreground mb-1.5">{f.helpText}</p>}
                <FieldInput field={f} value={values[f.fieldKey]} onChange={(v) => setVal(f.fieldKey, v)} />
              </div>
            );
          })}

          {errorMsg && (
            <div className="border border-destructive/30 bg-destructive/5 text-destructive rounded-md px-3 py-2 text-sm">{errorMsg}</div>
          )}

          <Button type="submit" disabled={submitting || isFullNoWaitlist} className="w-full sm:w-auto" size="lg">
            {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>) : isFullNoWaitlist ? "Registration full" : "Submit"}
          </Button>
        </form>
      </div>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <PublicFooter />
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: PublicField; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "long_text":
      return <Textarea value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ""} rows={4} />;
    case "email":
      return <Input type="email" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ""} />;
    case "phone":
      return <Input type="tel" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ""} />;
    case "number":
      return <Input type="number" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ""} />;
    case "date":
      return <Input type="date" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      return (
        <Select value={(value as string) ?? ""} onValueChange={onChange}>
          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
          <SelectContent>
            {(field.options?.choices ?? []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {(field.options?.choices ?? []).map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name={field.fieldKey} value={c} checked={value === c} onChange={() => onChange(c)} className="text-primary" />
              {c}
            </label>
          ))}
        </div>
      );
    case "checkboxes": {
      const arr = (Array.isArray(value) ? value : []) as string[];
      return (
        <div className="space-y-2">
          {(field.options?.choices ?? []).map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={arr.includes(c)} onCheckedChange={(v) => {
                const next = v ? [...arr, c] : arr.filter((x) => x !== c);
                onChange(next);
              }} />
              {c}
            </label>
          ))}
        </div>
      );
    }
    case "file":
      return <FileUploadInput value={(value as string) ?? ""} onChange={onChange} />;
    case "consent":
      return (
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <Checkbox checked={value === true} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
          <span>{field.label}</span>
        </label>
      );
    case "short_text":
    default:
      return <Input value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ""} />;
  }
}

function FileUploadInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    if (file.size > 10 * 1024 * 1024) { setError("File must be smaller than 10 MB."); return; }
    setUploading(true);
    setFilename(file.name);
    try {
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "application/octet-stream" }),
      });
      // Public form submitters won't have admin auth — this WILL 401. We need an unauthenticated upload route OR make this only for admins.
      // For now, fall back to a graceful error.
      if (urlRes.status === 401 || urlRes.status === 403) {
        setError("File uploads aren't available on public forms yet. Contact us to send your file separately.");
        setUploading(false);
        return;
      }
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await urlRes.json();
      const put = await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
      if (!put.ok) throw new Error("Upload failed");
      onChange(`${objectPath}::${file.name}`);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="border border-dashed rounded-md px-3 py-4 flex items-center gap-2 cursor-pointer hover:bg-muted/30 transition">
        <UploadIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {uploading ? "Uploading..." : value ? (value.split("::")[1] || filename || "File attached") : "Click to choose a file"}
        </span>
        <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} disabled={uploading} />
      </label>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
