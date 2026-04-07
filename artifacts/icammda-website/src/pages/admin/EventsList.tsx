import { Link } from "wouter";
import { format } from "date-fns";
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
import { useListEvents, useDeleteEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";

export default function EventsList() {
  const { data: events, isLoading } = useListEvents();
  const deleteEvent = useDeleteEvent();
  const queryClient = useQueryClient();

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteEvent.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
  };

  return (
    <AdminLayout title="Events">
      <div className="space-y-5" data-testid="admin-events">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-foreground">Events &amp; Programs</h2>
            <p className="text-sm text-muted-foreground">Manage workshops, webinars, symposia, and training events.</p>
          </div>
          <Link href="/admin/events/new">
            <Button size="sm" data-testid="create-event-btn">
              <Plus size={14} className="mr-1.5" /> New Event
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-card-border rounded-xl overflow-hidden" data-testid="events-table">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground" data-testid="no-events">
              <Calendar size={40} className="mx-auto mb-3 opacity-20" />
              <p className="mb-3">No events yet.</p>
              <Link href="/admin/events/new">
                <Button size="sm" variant="outline">Create your first event</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Form</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors" data-testid={`event-row-${event.id}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate max-w-xs" data-testid={`event-row-title-${event.id}`}>{event.title}</p>
                      {event.featured && <Badge className="text-xs bg-primary/10 text-primary mt-0.5">Featured</Badge>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs">{event.eventType}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                      {event.startDate ? format(new Date(event.startDate), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${event.published ? "text-green-600" : "text-muted-foreground"}`}>
                        {event.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {event.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs capitalize">{event.formType}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-testid={`edit-event-${event.id}`}>
                            <Edit size={13} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:text-destructive"
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deleteEvent.isPending}
                          data-testid={`delete-event-${event.id}`}
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
    </AdminLayout>
  );
}
