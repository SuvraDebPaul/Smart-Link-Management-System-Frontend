"use client";

import { FormEvent, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  TCreatePagePayload,
  TPage,
  TPageLink,
  TPageTheme,
} from "@/types/page.type";

type TPageFormProps = {
  mode: "create" | "edit";
  defaultValues?: TPage;
  isSubmitting?: boolean;
  onSubmit: (payload: TCreatePagePayload) => Promise<void>;
};

const themeOptions: TPageTheme[] = ["light", "dark", "gradient"];

const emptyLink: TPageLink = {
  title: "",
  url: "",
  order: 0,
  isActive: true,
};

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export function PageForm({
  mode,
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: TPageFormProps) {
  const [slug, setSlug] = useState(defaultValues?.slug || "");
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [bio, setBio] = useState(defaultValues?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(defaultValues?.avatarUrl || "");
  const [theme, setTheme] = useState<TPageTheme>(
    defaultValues?.theme || "light",
  );
  const [isPublished, setIsPublished] = useState(
    defaultValues?.isPublished ?? true,
  );
  const [links, setLinks] = useState<TPageLink[]>(
    defaultValues?.links?.length
      ? defaultValues.links.map((link, index) => ({
          title: link.title,
          url: link.url || link.originalUrl || "",
          order: link.order ?? index,
          isActive: link.isActive ?? true,
        }))
      : [{ ...emptyLink }],
  );

  const handleAddLink = () => {
    setLinks((prev) => [
      ...prev,
      {
        ...emptyLink,
        order: prev.length,
      },
    ]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prev) =>
      prev
        .filter((_, currentIndex) => currentIndex !== index)
        .map((link, linkIndex) => ({
          ...link,
          order: linkIndex,
        })),
    );
  };

  const handleLinkChange = (
    index: number,
    field: keyof TPageLink,
    value: string | boolean,
  ) => {
    setLinks((prev) =>
      prev.map((link, currentIndex) => {
        if (currentIndex !== index) return link;

        return {
          ...link,
          [field]: value,
        };
      }),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedLinks = links
      .filter((link) => link.title.trim() && link.url?.trim())
      .map((link, index) => ({
        title: link.title.trim(),
        url: link.url?.trim(),
        order: index,
        isActive: link.isActive,
      }));

    const payload: TCreatePagePayload = {
      slug: normalizeSlug(slug),
      title: title.trim(),
      bio: bio.trim() || null,
      avatarUrl: avatarUrl.trim() || null,
      theme,
      links: cleanedLinks,
      isPublished,
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Page Slug <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              value={slug}
              onChange={(event) => setSlug(normalizeSlug(event.target.value))}
              placeholder="suvra-deb"
              required
              minLength={3}
              maxLength={40}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Public URL will be like: /u/{slug || "your-slug"}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Page Title <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Suvra Deb Paul"
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Write a short introduction..."
            rows={4}
            maxLength={300}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            {bio.length}/300 characters
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Avatar URL
            </label>

            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Theme
            </label>

            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as TPageTheme)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              {themeOptions.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Publish Status
            </label>

            <select
              value={String(isPublished)}
              onChange={(event) =>
                setIsPublished(event.target.value === "true")
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Bio Page Links
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add buttons that will appear on your public bio page.
              </p>
            </div>

            <Button type="button" variant="outline" onClick={handleAddLink}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            {links.map((link, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="grid gap-4 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Link Title
                    </label>

                    <input
                      type="text"
                      value={link.title}
                      onChange={(event) =>
                        handleLinkChange(index, "title", event.target.value)
                      }
                      placeholder="Portfolio"
                      maxLength={80}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      URL
                    </label>

                    <input
                      type="url"
                      value={link.url || ""}
                      onChange={(event) =>
                        handleLinkChange(index, "url", event.target.value)
                      }
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemoveLink(index)}
                    disabled={links.length === 1}
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={link.isActive}
                    onChange={(event) =>
                      handleLinkChange(index, "isActive", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Active on public page
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Bio Page"
            ) : (
              "Update Bio Page"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
