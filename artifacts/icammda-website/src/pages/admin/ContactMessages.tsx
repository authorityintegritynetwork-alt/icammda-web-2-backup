import { useState } from "react";
import { format } from "date-fns";
import { Mail, MailOpen, Trash2, Search, Inbox } from "lucide-react";
import {
  useListContactMessages,
  useUpdateContactMessage,
  useDeleteContactMessage,
  getListContactMessagesQueryKey,
} from "@workspace/api-client-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

export default function ContactMessages() {
  const { data: messages, isLoading } = useListContactMessages();
  const updateMsg = useUpdateContactMessage();
  const deleteMsg = useDeleteContactMessage();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListContactMessagesQueryKey() });

  const filtered = (messages ?? []).filter((m) => {
    if (filter === "unread" && m.isRead) return false;
    if (filter === "read" && !m.isRead) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) ||
           m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
  });

  const selected = messages?.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages?.filter((m) => !m.isRead).length ?? 0;

  const handleOpen = async (id: number, isRead: boolean) => {
    setSelectedId(id);
    if (!isRead) {
      await updateMsg.mutateAsync({ id, data: { isRead: true } });
      invalidate();
    }
  };

  const handleToggleRead = async (id: number, currentRead: boolean) => {
    await updateMsg.mutateAsync({ id, data: { isRead: !currentRead } });
    invalidate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently delete this message?")) return;
    await deleteMsg.mutateAsync({ id });
    if (selectedId === id) setSelectedId(null);
    invalidate();
  };

  return (
    <AdminLayout title="Contact Messages">
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Inbox</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {messages?.length ?? 0} total · <span className="font-semibold text-cyan-600">{unreadCount} unread</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, subject, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="messages-search"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className="capitalize"
                data-testid={`filter-${f}`}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground" data-testid="messages-empty">
            <Inbox size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-foreground">No messages</p>
            <p className="text-sm mt-1">
              {messages?.length === 0
                ? "When visitors send messages through the contact form, they'll appear here."
                : "No messages match your filters."}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-card-border rounded-xl overflow-hidden divide-y divide-border">
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleOpen(m.id, m.isRead)}
                className={`w-full text-left flex items-start gap-4 p-4 hover:bg-muted/40 transition-colors ${!m.isRead ? "bg-cyan-50/40" : ""}`}
                data-testid={`message-row-${m.id}`}
              >
                <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${!m.isRead ? "bg-cyan-500/15 text-cyan-600" : "bg-muted text-muted-foreground"}`}>
                  {m.isRead ? <MailOpen size={14} /> : <Mail size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className={`text-sm truncate ${!m.isRead ? "font-bold text-foreground" : "font-medium text-foreground/90"}`}>
                      {m.name}
                      <span className="ml-2 font-normal text-muted-foreground text-xs">&lt;{m.email}&gt;</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground shrink-0">
                      {format(new Date(m.createdAt), "MMM d, p")}
                    </p>
                  </div>
                  <p className={`text-sm mt-0.5 truncate ${!m.isRead ? "text-foreground" : "text-foreground/70"}`}>
                    {m.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{m.message}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="message-detail-dialog">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-serif">{selected.subject}</DialogTitle>
                  <DialogDescription className="text-sm pt-1">
                    From <span className="font-semibold text-foreground">{selected.name}</span>{" "}
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="text-cyan-600 hover:underline">
                      &lt;{selected.email}&gt;
                    </a>
                    {" · "}
                    {format(new Date(selected.createdAt), "PPpp")}
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/30 border border-border rounded-lg p-4 mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {selected.message}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border mt-3">
                  <Button asChild size="sm" data-testid="reply-btn">
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>
                      <Mail size={13} className="mr-1.5" /> Reply
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleRead(selected.id, selected.isRead)}
                    data-testid="toggle-read-btn"
                  >
                    Mark as {selected.isRead ? "unread" : "read"}
                  </Button>
                  <div className="flex-1" />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(selected.id)}
                    disabled={deleteMsg.isPending}
                    data-testid="delete-btn"
                  >
                    <Trash2 size={13} className="mr-1.5" /> Delete
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
