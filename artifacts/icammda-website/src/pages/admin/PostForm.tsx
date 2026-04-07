import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import {
  useListPosts,
  useCreatePost,
  useUpdatePost,
  getListPostsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";

const CATEGORIES = ["News", "Recent Training", "Upcoming Training"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PostForm() {
  const [, params] = useRoute("/admin/posts/:id/edit");
  const [, navigate] = useLocation();
  const isEdit = !!params?.id;
  const postId = params?.id ? parseInt(params.id, 10) : undefined;

  const { data: posts, isLoading: postsLoading } = useListPosts();
  const existing = posts?.find((p) => p.id === postId);

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "News",
    authorName: "",
    imageUrl: "",
    published: false,
    featured: false,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        excerpt: existing.excerpt ?? "",
        content: existing.content,
        category: existing.category,
        authorName: existing.authorName ?? "",
        imageUrl: existing.imageUrl ?? "",
        published: existing.published,
        featured: existing.featured,
      });
    }
  }, [existing]);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
      category: form.category,
      authorName: form.authorName || undefined,
      imageUrl: form.imageUrl || undefined,
      published: form.published,
      featured: form.featured,
    };

    if (isEdit && postId) {
      await updatePost.mutateAsync({ id: postId, ...payload });
    } else {
      await createPost.mutateAsync(payload);
    }
    queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
    navigate("/admin/posts");
  };

  const saving = createPost.isPending || updatePost.isPending;

  if (isEdit && postsLoading) {
    return (
      <AdminLayout title={isEdit ? "Edit Post" : "New Post"}>
        <div className="space-y-4 max-w-2xl">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Post" : "New Post"}>
      <div className="max-w-2xl" data-testid="post-form">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/admin/posts")} className="text-sm text-muted-foreground hover:text-foreground">← Posts</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{isEdit ? "Edit Post" : "New Post"}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-card-border rounded-xl p-6">
          <div>
            <Label htmlFor="title" className="mb-1.5 block">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
              data-testid="post-title-input"
            />
          </div>

          <div>
            <Label htmlFor="slug" className="mb-1.5 block">Slug <span className="text-destructive">*</span></Label>
            <Input
              id="slug"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              placeholder="url-slug"
              data-testid="post-slug-input"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Category <span className="text-destructive">*</span></Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger data-testid="post-category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="authorName" className="mb-1.5 block">Author Name</Label>
              <Input
                id="authorName"
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                placeholder="Author's name"
                data-testid="post-author-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl" className="mb-1.5 block">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://..."
              data-testid="post-image-input"
            />
          </div>

          <div>
            <Label htmlFor="excerpt" className="mb-1.5 block">Excerpt</Label>
            <Textarea
              id="excerpt"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short summary shown in listings"
              className="resize-none"
              data-testid="post-excerpt-input"
            />
          </div>

          <div>
            <Label htmlFor="content" className="mb-1.5 block">Content (HTML) <span className="text-destructive">*</span></Label>
            <Textarea
              id="content"
              required
              rows={12}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="<p>Post content...</p>"
              className="font-mono text-sm"
              data-testid="post-content-input"
            />
            <p className="text-xs text-muted-foreground mt-1">Supports HTML markup.</p>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                data-testid="post-published-switch"
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                data-testid="post-featured-switch"
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving} data-testid="post-save-btn">
              {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/posts")} data-testid="post-cancel-btn">
              Cancel
            </Button>
          </div>

          {(createPost.isError || updatePost.isError) && (
            <p className="text-sm text-destructive" data-testid="post-form-error">
              {(createPost.error as Error)?.message ?? (updatePost.error as Error)?.message ?? "An error occurred."}
            </p>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
