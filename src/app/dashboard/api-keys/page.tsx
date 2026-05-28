"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiKeyService } from "@/services/api-key.service";
import type { TApiKey, TCreatedApiKey } from "@/types/api-key.type";

function getApiKeyId(apiKey: TApiKey) {
  return apiKey.id || apiKey._id || "";
}

function formatDate(date?: string | null) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<TApiKey[]>([]);
  const [name, setName] = useState("");
  const [createdApiKey, setCreatedApiKey] = useState<TCreatedApiKey | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);

      const response = await ApiKeyService.getMyApiKeys();

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to load API keys");
        return;
      }

      setApiKeys(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      toast.error("API key name must be at least 2 characters");
      return;
    }

    try {
      setIsCreating(true);

      const response = await ApiKeyService.createApiKey({
        name: trimmedName,
      });

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to create API key");
        return;
      }

      setCreatedApiKey(response.data);
      setName("");

      await loadApiKeys();

      toast.success("API key created successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (value: string, message = "Copied successfully") => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(message);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleRevokeApiKey = async () => {
    if (!revokeTargetId) return;

    try {
      setIsRevoking(true);

      const response = await ApiKeyService.revokeApiKey(revokeTargetId);

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to revoke API key");
        return;
      }

      setApiKeys((prev) =>
        prev.map((apiKey) =>
          getApiKeyId(apiKey) === revokeTargetId ? response.data : apiKey,
        ),
      );

      setRevokeTargetId(null);
      toast.success("API key revoked successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to revoke API key");
    } finally {
      setIsRevoking(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <KeyRound className="h-4 w-4" />
            Developer Access
          </div>

          <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Create and manage API keys for programmatic access to Smart Link.
            Copy the key when it is created because it will not be shown again.
          </p>
        </div>
      </div>

      {createdApiKey && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-amber-900">
                Copy your API key now
              </h2>

              <p className="mt-1 text-sm text-amber-800">
                This full API key is shown only once. Store it securely before
                leaving this page.
              </p>

              <div className="mt-4 flex flex-col gap-3 rounded-xl bg-white p-4 md:flex-row md:items-center">
                <code className="min-w-0 flex-1 break-all text-sm font-semibold text-slate-900">
                  {createdApiKey.key}
                </code>

                <Button
                  type="button"
                  onClick={() =>
                    handleCopy(createdApiKey.key, "API key copied")
                  }
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Key
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4 border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
                onClick={() => setCreatedApiKey(null)}
              >
                I have saved this key
              </Button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleCreateApiKey}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Create New API Key
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Give your API key a clear name so you can identify where it is used.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Production App, Zapier, Automation Script"
            minLength={2}
            maxLength={50}
            className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Create API Key
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing API Keys
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            You can revoke an API key anytime. Revoked keys cannot be used
            again.
          </p>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading API keys...
            </div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <KeyRound className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No API keys created yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Create your first API key to access Smart Link from external
              applications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Key Prefix</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Used</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {apiKeys.map((apiKey) => {
                  const apiKeyId = getApiKeyId(apiKey);

                  return (
                    <tr
                      key={apiKeyId}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {apiKey.name}
                      </td>

                      <td className="px-6 py-4">
                        <code className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {apiKey.keyPrefix}...
                        </code>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                            apiKey.isActive
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-slate-100 text-slate-600 ring-slate-200"
                          }`}
                        >
                          {apiKey.isActive ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          )}
                          {apiKey.isActive ? "Active" : "Revoked"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(apiKey.lastUsedAt)}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(apiKey.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          {apiKey.isActive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isRevoking}
                              onClick={() => setRevokeTargetId(apiKeyId)}
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Revoke
                            </Button>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">
                              No action
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {revokeTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Revoke this API key?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone. Applications using this key will
              immediately lose access.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRevokeTargetId(null)}
                disabled={isRevoking}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleRevokeApiKey}
                disabled={isRevoking}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {isRevoking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Revoke API Key
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
