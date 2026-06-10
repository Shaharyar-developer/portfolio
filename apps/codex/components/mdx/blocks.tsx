import type { ReactNode } from "react";
import { Callout as FumadocsCallout } from "fumadocs-ui/components/callout";

type CalloutType = "note" | "tip" | "warning" | "success";

const calloutTypeMap = {
  note: "info",
  tip: "idea",
  warning: "warn",
  success: "success",
} as const satisfies Record<CalloutType, Parameters<typeof FumadocsCallout>[0]["type"]>;

export function Callout({
  children,
  title,
  type = "note",
}: {
  children: ReactNode;
  title?: string;
  type?: CalloutType;
}) {
  return (
    <FumadocsCallout title={title} type={calloutTypeMap[type] ?? "info"}>
      {children}
    </FumadocsCallout>
  );
}

export function Figure({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: ReactNode;
}) {
  return (
    <figure>
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function Aside({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <FumadocsCallout title={title} type="info">
      {children}
    </FumadocsCallout>
  );
}
