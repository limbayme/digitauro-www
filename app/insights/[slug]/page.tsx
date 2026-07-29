import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticHtmlPage } from "@/components/StaticHtmlPage";
import { findInsightPage, insightPages } from "@/lib/routes";
import { readStaticPage } from "@/lib/static-page";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return insightPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findInsightPage(slug);
  if (!route) return {};
  const page = readStaticPage(route);
  return { title: page.title, description: page.description };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findInsightPage(slug);
  if (!route) notFound();
  return <StaticHtmlPage route={route} />;
}
