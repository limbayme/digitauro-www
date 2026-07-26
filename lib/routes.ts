export type PageRoute = {
  slug: string;
  file: string;
  path: string;
};

export const rootPage: PageRoute = {
  slug: "home",
  file: "index.html",
  path: "/"
};

export const topLevelPages: PageRoute[] = [
  { slug: "independent-site", file: "independent-site.html", path: "/independent-site" },
  { slug: "social-media", file: "social-media.html", path: "/social-media" },
  { slug: "geo-ai", file: "geo-ai.html", path: "/geo-ai" },
  { slug: "tiktok-europe", file: "tiktok-europe.html", path: "/tiktok-europe" },
  { slug: "content-production", file: "content-production.html", path: "/content-production" },
  { slug: "amazon-erp", file: "amazon-erp.html", path: "/amazon-erp" },
  { slug: "google-growth", file: "google-growth.html", path: "/google-growth" },
  { slug: "insights", file: "insights.html", path: "/insights" }
];

export const insightPages: PageRoute[] = [
  { slug: "geo-ai-cut", file: "insights/geo-ai-cut.html", path: "/insights/geo-ai-cut" },
  { slug: "independent-site-asset", file: "insights/independent-site-asset.html", path: "/insights/independent-site-asset" },
  { slug: "social-media-signal", file: "insights/social-media-signal.html", path: "/insights/social-media-signal" },
  { slug: "tiktok-europe-window", file: "insights/tiktok-europe-window.html", path: "/insights/tiktok-europe-window" }
];

export const allPages = [rootPage, ...topLevelPages, ...insightPages];

export function findTopLevelPage(slug: string) {
  return topLevelPages.find((page) => page.slug === slug);
}

export function findInsightPage(slug: string) {
  return insightPages.find((page) => page.slug === slug);
}
