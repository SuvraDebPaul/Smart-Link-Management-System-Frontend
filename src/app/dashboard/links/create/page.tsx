import { CreateLinkForm } from "@/components/links/create-link-form";

export default function CreateLinkPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.16),transparent_35%)]" />

          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Create Link
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Create a branded smart link
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Add custom alias, password protection, expiry date, and QR preview
            in one place.
          </p>
        </div>
      </section>

      <CreateLinkForm />
    </div>
  );
}
