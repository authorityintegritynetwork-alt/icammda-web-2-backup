import { useState } from "react";
import { useListLinkedinPosts, useCreateLinkedinPost, useDeleteLinkedinPost } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Linkedin, ExternalLink, Loader2, AlertCircle } from "lucide-react";

export default function LinkedInAdmin() {
  const { toast } = useToast();
  const { data: posts, isLoading, refetch } = useListLinkedinPosts();
  const createMutation = useCreateLinkedinPost();
  const deleteMutation = useDeleteLinkedinPost();

  const [postUrl, setPostUrl] = useState("");
  const [label, setLabel] = useState("");
  const [order, setOrder] = useState("0");
  const [addError, setAddError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    if (!postUrl.trim()) return;
    try {
      await createMutation.mutateAsync({
        data: {
          postUrl: postUrl.trim(),
          label: label.trim() || null,
          order: parseInt(order, 10) || 0,
        },
      });
      setPostUrl("");
      setLabel("");
      setOrder("0");
      refetch();
      toast({ title: "LinkedIn post added", description: "It will now appear on the homepage." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add post";
      const detail = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setAddError(detail ?? msg);
      toast({ title: "Failed to add post", description: detail ?? msg, variant: "destructive" });
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
      toast({ title: "Post removed" });
    } catch {
      toast({ title: "Failed to remove post", variant: "destructive" });
    }
  }

  return (
    <AdminLayout title="LinkedIn Feed">
      {/* Add Form */}
      <Card className="p-6 mb-8">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Linkedin size={16} className="text-[#0A66C2]" />
          Add a LinkedIn Post
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <Label htmlFor="postUrl">LinkedIn Post URL *</Label>
            <Input
              id="postUrl"
              placeholder="https://www.linkedin.com/posts/icammda_..."
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              required
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste the full URL of a public LinkedIn post. Right-click a post → "Copy link to post".
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                placeholder="e.g. Workshop Recap"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          {addError && (
            <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {addError}
            </div>
          )}
          <Button type="submit" disabled={createMutation.isPending} className="gap-2">
            {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add Post
          </Button>
        </form>
      </Card>

      {/* Posts list */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 size={16} className="animate-spin" /> Loading posts…
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center shrink-0">
                <Linkedin size={14} className="text-[#0A66C2]" />
              </div>
              <div className="flex-1 min-w-0">
                {post.label && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{post.label}</p>
                )}
                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-700 hover:underline flex items-center gap-1 min-w-0"
                >
                  <span className="truncate">{post.postUrl}</span>
                  <ExternalLink size={11} className="shrink-0" />
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">Order: {post.order}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => handleDelete(post.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 size={15} />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-2xl">
          <Linkedin size={28} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No LinkedIn posts added yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first post using the form above.</p>
        </div>
      )}
    </AdminLayout>
  );
}
