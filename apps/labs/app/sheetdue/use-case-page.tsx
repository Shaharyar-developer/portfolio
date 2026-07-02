import { Button } from "@workspace/ui/components/button";
import { ArrowRight, CheckCircle2, Sheet } from "lucide-react";
import Link from "next/link";

type SheetdueUseCasePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  rows: string[][];
  bullets: string[];
};

export function SheetdueUseCasePage({
  eyebrow,
  title,
  description,
  rows,
  bullets,
}: SheetdueUseCasePageProps) {
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-5 text-white">
      <section className="mx-auto flex min-h-[calc(100svh-2.5rem)] max-w-6xl flex-col justify-center">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/sheetdue" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/5">
              <Sheet className="size-4 text-emerald-300" />
            </span>
            <span className="font-semibold">SheetDue</span>
          </Link>
          <Button asChild className="bg-white text-black hover:bg-zinc-200">
            <Link href="/sheetdue/dashboard">Start free</Link>
          </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              {description}
            </p>
            <div className="mt-8 grid gap-3">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                  {bullet}
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
                <Link href="/sheetdue/dashboard">
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/sheetdue#example">View example sheet</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="font-semibold">Template preview</p>
              <p className="mt-1 text-sm text-zinc-500">
                Client / Task / Due Date / Recipient Email / Status
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={row.join("-")} className="border-b border-white/10 last:border-b-0">
                      {row.map((cell) => (
                        <td key={cell} className="px-5 py-4 text-zinc-200">
                          {rowIndex === 0 ? (
                            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
