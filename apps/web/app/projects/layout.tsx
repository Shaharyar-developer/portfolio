import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose dark:prose-invert max-w-[90%] pt-4 font-mono sm:max-w-prose mx-auto">
      <div className="fixed top-4 left-4">
        <Link
          href="/"
          className="flex gap-2 items-center hover:scale-105 transition-all"
        >
          <ArrowLeft className="size-4 " /> Return
        </Link>
      </div>
      {children}
    </article>
  );
}
