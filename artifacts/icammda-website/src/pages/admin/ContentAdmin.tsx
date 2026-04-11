import { useState } from "react";
import { useGetSiteContent, useUpdateSiteContent } from "@workspace/api-client-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, CheckCircle2, FileText } from "lucide-react";

const PAGE_TABS = [
  { key: "home",      label: "Home" },
  { key: "about",     label: "About" },
  { key: "contact",   label: "Contact" },
  { key: "careers",   label: "Careers" },
  { key: "research",  label: "Research" },
  { key: "elearning", label: "eLearning" },
];

type ContentItem = {
  id: number;
  key: string;
  label: string;
  value: string;
  page: string;
  type: string;
  sortOrder: number;
  updatedAt: string;
};

function ContentField({
  item,
  onSaved,
}: {
  item: ContentItem;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(item.value);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const { mutate, isPending } = useUpdateSiteContent({
    mutation: {
      onSuccess: () => {
        setSaved(true);
        onSaved();
        setTimeout(() => setSaved(false), 2500);
      },
      onError: () => {
        toast({ title: "Failed to save", variant: "destructive" });
      },
    },
  });

  const isDirty = value !== item.value;

  const handleSave = () => {
    mutate({ id: item.id, data: { value } });
  };

  return (
    <div className="group border border-border/50 rounded-xl p-4 hover:border-border transition-colors bg-white">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-medium text-foreground">{item.label}</p>
          <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">{item.key}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || !isDirty}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            saved
              ? "bg-green-50 text-green-600 border border-green-200"
              : isDirty
              ? "bg-cyan-600 text-white hover:bg-cyan-700"
              : "bg-muted text-muted-foreground cursor-default"
          }`}
          data-testid={`save-content-${item.key}`}
        >
          {isPending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : saved ? (
            <CheckCircle2 size={11} />
          ) : (
            <Save size={11} />
          )}
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {item.type === "textarea" ? (
        <textarea
          className="w-full text-sm text-foreground bg-muted/40 border border-input rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-colors leading-relaxed"
          rows={Math.max(2, Math.ceil(value.length / 90))}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid={`field-${item.key}`}
        />
      ) : (
        <input
          type="text"
          className="w-full text-sm text-foreground bg-muted/40 border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-colors"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid={`field-${item.key}`}
        />
      )}
    </div>
  );
}

export default function ContentAdmin() {
  const [activeTab, setActiveTab] = useState("home");
  const { data: items = [], refetch, isLoading } = useGetSiteContent({}, { query: { staleTime: 0 } });

  const pageItems = items.filter((i) => i.page === activeTab);

  return (
    <AdminLayout title="Site Content">
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-cyan-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-lg">Page Content</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Edit every piece of text on every public page. Changes go live instantly.
            </p>
          </div>
        </div>

        {/* Page tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-border pb-0">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.key
                  ? "border-cyan-500 text-cyan-600 bg-cyan-50/60"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
              data-testid={`tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No content entries found for this page.
          </div>
        ) : (
          <div className="space-y-3" data-testid="content-fields">
            {pageItems.map((item) => (
              <ContentField
                key={item.id}
                item={item as ContentItem}
                onSaved={() => refetch()}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
