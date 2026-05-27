import { HelpCircle, MessageCircleQuestion, Sparkles } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Can I create custom aliases?",
    answer:
      "Yes. You can create memorable custom aliases for your short links, as long as the alias is available and not reserved.",
  },
  {
    question: "Can I track link clicks?",
    answer:
      "Yes. Smart Link can track total clicks, devices, browsers, countries, referrers, and campaign performance.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes. You can add a custom domain, verify DNS, and use it for branded short links.",
  },
  {
    question: "Can I protect links with passwords?",
    answer:
      "Yes. You can enable password protection for sensitive or private links.",
  },
  {
    question: "Can developers use the API?",
    answer:
      "Yes. You can create API keys and shorten links from your own apps or automation workflows.",
  },
];

export function FaqSection() {
  return (
    <section className="relative overflow-hidden bg-[#061A2F] py-24 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(139,92,246,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.15),transparent_35%)]" />

      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <Badge className="rounded-full border border-cyan-300/20 bg-white/10 p-4 text-sm font-bold text-cyan-200 hover:bg-white/10">
            <HelpCircle className="mr-2 size-4" />
            FAQ
          </Badge>

          <h2 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-white md:text-5xl">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              questions
            </span>
          </h2>

          <p className="mt-5 max-w-md text-lg leading-8 text-slate-300">
            Everything you need to know about smart links, custom domains,
            analytics, password protection, and API usage.
          </p>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <MessageCircleQuestion className="size-6" />
            </div>

            <p className="text-lg font-black text-white">
              Still have questions?
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Contact us and we will help you understand which features are best
              for your link management workflow.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-xl bg-gradient-to-br from-cyan-400/25 via-blue-500/15 to-violet-500/25 blur-2xl" />

          <div className="rounded-xl border border-white/10 bg-white p-4 shadow-2xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-5"
                >
                  <AccordionTrigger className="text-left text-base font-black text-slate-950 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
                        {index + 1}
                      </div>

                      {faq.question}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-5 pl-12 text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="absolute -right-4 -top-5 hidden rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 px-4 py-3 text-white shadow-2xl md:block">
            <p className="text-xs font-bold uppercase tracking-wide">Helpful</p>
            <p className="flex items-center gap-1 text-xl font-black">
              <Sparkles className="size-5" />
              Guide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
