import type { Metadata } from "next";
import { StaticHtmlPage } from "@/components/StaticHtmlPage";
import { readStaticPage } from "@/lib/static-page";
import { rootPage } from "@/lib/routes";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const page = readStaticPage(rootPage);
  return { title: page.title, description: page.description };
}

export default function HomePage() {
  return <StaticHtmlPage route={rootPage} />;
}
