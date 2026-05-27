"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  TCampaign,
  TCampaignStatus,
  TCreateCampaignPayload,
} from "@/types/campaign.type";

type TCampaignFormProps = {
  mode: "create" | "edit";
  defaultValues?: TCampaign;
  isSubmitting?: boolean;
  onSubmit: (payload: TCreateCampaignPayload) => Promise<void>;
};

const statusOptions: TCampaignStatus[] = ["active", "paused", "completed"];

function formatDateForInput(date?: string | null) {
  if (!date) return "";

  return new Date(date).toISOString().slice(0, 10);
}

export function CampaignForm({
  mode,
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: TCampaignFormProps) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [description, setDescription] = useState(
    defaultValues?.description || "",
  );
  const [status, setStatus] = useState<TCampaignStatus>(
    defaultValues?.status || "active",
  );
  const [startDate, setStartDate] = useState(
    formatDateForInput(defaultValues?.startDate),
  );
  const [endDate, setEndDate] = useState(
    formatDateForInput(defaultValues?.endDate),
  );
  const [goalClicks, setGoalClicks] = useState(
    defaultValues?.goalClicks ? String(defaultValues.goalClicks) : "",
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: TCreateCampaignPayload = {
      name: name.trim(),
      description: description.trim() || null,
      status,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      goalClicks: goalClicks ? Number(goalClicks) : null,
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Campaign Name <span className="text-rose-500">*</span>
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Eid Offer Campaign"
            required
            minLength={2}
            maxLength={100}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a short note about this campaign..."
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TCampaignStatus)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Goal Clicks
          </label>

          <input
            type="number"
            value={goalClicks}
            onChange={(event) => setGoalClicks(event.target.value)}
            placeholder="Example: 1000"
            min={1}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Campaign"
            ) : (
              "Update Campaign"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
