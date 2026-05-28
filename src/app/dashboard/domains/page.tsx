"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Globe2,
  Loader2,
  Power,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DomainService } from "@/services/domain.service";
import type { TDomain, TDomainStatus } from "@/types/domain.type";

function normalizeDomainInput(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .trim();
}

function getStatusClass(status: TDomainStatus) {
  if (status === "verified") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "failed") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

function getStatusIcon(status: TDomainStatus) {
  if (status === "verified") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (status === "failed") {
    return <XCircle className="h-4 w-4" />;
  }

  return <ShieldCheck className="h-4 w-4" />;
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<TDomain[]>([]);
  const [domainInput, setDomainInput] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTargetDomainId, setDeleteTargetDomainId] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDomains = async () => {
    try {
      setIsLoading(true);

      const response = await DomainService.getMyDomain();

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to load domains");
        return;
      }

      setDomains(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load domains");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDomain = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedDomain = normalizeDomainInput(domainInput);

    if (!normalizedDomain) {
      toast.error("Please enter a domain");
      return;
    }

    try {
      setIsCreating(true);

      const response = await DomainService.createDomain({
        domain: normalizedDomain,
      });

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to connect domain");
        return;
      }

      setDomains((prev) => [response.data, ...prev]);
      setDomainInput("");

      toast.success("Domain connected successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to connect domain");
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

  const handleVerifyDns = async (domainId: string) => {
    try {
      setVerifyingId(domainId);

      const response = await DomainService.verifyDomainDns(domainId);

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to verify DNS");
        return;
      }

      setDomains((prev) =>
        prev.map((domain) => (domain.id === domainId ? response.data : domain)),
      );

      toast.success("Domain DNS verified successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to verify DNS");

      await loadDomains();
    } finally {
      setVerifyingId(null);
    }
  };

  const handleToggleActive = async (domain: TDomain) => {
    try {
      setUpdatingId(domain.id);

      const response = await DomainService.updateDomain(domain.id, {
        isActive: !domain.isActive,
      });

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to update domain");
        return;
      }

      setDomains((prev) =>
        prev.map((item) => (item.id === domain.id ? response.data : item)),
      );

      toast.success(
        response.data.isActive
          ? "Domain activated successfully"
          : "Domain deactivated successfully",
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update domain");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteDomain = async () => {
    if (!deleteTargetDomainId) return;

    try {
      setIsDeleting(true);

      const response = await DomainService.deleteDomain(deleteTargetDomainId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete domain");
        return;
      }

      setDomains((prev) =>
        prev.filter((domain) => domain.id !== deleteTargetDomainId),
      );

      toast.success("Domain deleted successfully");
      setDeleteTargetDomainId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete domain");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Globe2 className="h-4 w-4" />
            Custom Domain Management
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Domains</h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Connect your own branded domain and verify ownership using DNS TXT
            records.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCreateDomain}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Connect New Domain
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter your domain without protocol. Example: links.yourdomain.com
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={domainInput}
            onChange={(event) => setDomainInput(event.target.value)}
            placeholder="links.example.com"
            className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Globe2 className="mr-2 h-4 w-4" />
                Connect Domain
              </>
            )}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading domains...
          </div>
        </div>
      ) : domains.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Globe2 className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No domains connected yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Connect a branded domain to make your smart links more professional.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getStatusClass(
                        domain.status,
                      )}`}
                    >
                      {getStatusIcon(domain.status)}
                      {domain.status}
                    </span>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                        domain.isActive
                          ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                          : "bg-slate-100 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {domain.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-slate-900">
                    {domain.domain}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Created {formatDate(domain.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updatingId === domain.id}
                    onClick={() => handleToggleActive(domain)}
                  >
                    {updatingId === domain.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="mr-2 h-4 w-4" />
                    )}
                    {domain.isActive ? "Deactivate" : "Activate"}
                  </Button>

                  {/* <Button
                    variant="outline"
                    size="sm"
                    disabled={manualVerifyingId === domain.id}
                    onClick={() => handleManualVerify(domain.id)}
                  >
                    {manualVerifyingId === domain.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Manual Verify
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={verifyingId === domain.id}
                    onClick={() => handleVerifyDns(domain.id)}
                  >
                    {verifyingId === domain.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    Verify DNS
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTargetDomainId(domain.id)}
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  DNS Verification TXT Record
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Add this TXT record to your DNS provider, then click Verify
                  DNS.
                </p>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase text-slate-400">
                          Type
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {domain.dnsInstruction.type}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopy(
                            domain.dnsInstruction.type,
                            "DNS type copied",
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase text-slate-400">
                          Name / Host
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                          {domain.dnsInstruction.name}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopy(
                            domain.dnsInstruction.name,
                            "DNS host copied",
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase text-slate-400">
                          Value
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                          {domain.dnsInstruction.value}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopy(
                            domain.dnsInstruction.value,
                            "DNS value copied",
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {domain.status !== "verified" && (
                  <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800">
                    <p className="font-semibold text-red-500">
                      Click Verify DNS
                    </p>
                    <p className="mt-1">
                      DNS propagation may take a few minutes to several hours
                      depending on your DNS provider.
                    </p>
                  </div>
                )}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Step 3: Point Domain to Smart Link
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    After verification, point your domain to your Smart Link
                    server.
                  </p>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="font-semibold text-slate-800">
                      For subdomain:
                    </p>
                    <p className="mt-1 text-slate-600">
                      Add a CNAME record pointing to your Smart Link backend
                      domain.
                    </p>
                    <p className="mt-2 text-slate-600">
                      Example: CNAME:links.yourdomain.com →
                      smartlink.yourdomain.com
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="font-semibold text-slate-800">
                      For root domain:
                    </p>
                    <p className="mt-1 text-slate-600">
                      Add an A record pointing to your server IP address.
                    </p>
                    <p className="mt-1 text-slate-600">
                      A Record: yourdomain.com → YOUR_SERVER_IP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTargetDomainId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete this domain?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This domain will be removed from your account. Smart links will
              not be deleted, but they will no longer use this domain.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTargetDomainId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDeleteDomain}
                disabled={isDeleting}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Domain
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
