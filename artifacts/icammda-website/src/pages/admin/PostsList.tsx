import { Link } from "wouter";
import { format } from "date-fns";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useListPosts, useDeletePost, getListPostsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";

export default function PostsList() {
  const { data: posts, isLoading } = useListPosts();
  const deletePost = useDeletePost();
  const queryClient = useQueryClient();

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePost.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
  };

  return (
    <AdminLayout title="Posts">
      <div className="space-y-5" data-testid="admin-posts">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-foreground">Posts &amp; News</h2>
            <p className="text-sm text-muted-foreground">Manage blog posts, news, and training announcements.</p>
          </div>
          <Link href="/admin/posts/new">
            <Button size="sm" data-testid="create-post-btn">
              <Plus size={14} className="mr-1.5" /> New Post
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-card-border rounded-xl overflow-hidden" data-testid="posts-table">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground" data-testid="no-posts">
              <p className="mb-3">No posts yet.</p>
              <Link href="/admin/posts/new">
                <Button size="sm" variant="outline">Create your first post</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors" data-testid={`post-row-${post.id}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate max-w-xs" data-testid={`post-row-title-${post.id}`}>{post.title}</p>
                      {post.featured && <Badge className="text-xs bg-primary/10 text-primary mt-0.5">Featured</Badge>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${post.published ? "text-green-600" : "text-muted-foreground"}`}>
                        {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-testid={`edit-post-${post.id}`}>
                            <Edit size={13} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:text-destructive"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletePost.isPending}
                          data-testid={`delete-post-${post.id}`}
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
