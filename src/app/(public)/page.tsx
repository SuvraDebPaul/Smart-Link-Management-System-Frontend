import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm">
          Smart Link Management Platform
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
          Shorten, Brand, Track & Grow Every Link
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Create powerful short links, branded domains, link-in-bio pages, API
          keys, and real-time analytics from one smart dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg">Start Free</Button>
          <Button size="lg" variant="outline">
            View Features
          </Button>
        </div>
      </section>
    </main>
  );
}
