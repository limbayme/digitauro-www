"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const businessItems = [
  ["品牌独立站及 Google 增长", "建站 + Google SEM/SEO 全链路", "/independent-site", "/assets/logos/biz-independent.png"],
  ["全球社交媒体运营", "五平台内容 + 投放 + 舆情一体化", "/social-media", "/assets/logos/biz-social.png"],
  ["GEO 全球 AI 获客", "让 ChatGPT、Gemini 主动推荐你", "/geo-ai", "/assets/logos/biz-geo-ai.png"],
  ["TikTok 欧洲本土店及达人分发", "欧洲 TAP + 本土店 + 达人资源池", "/tiktok-europe", "/assets/logos/biz-tiktok-eu.png"],
  ["内容素材制作服务", "15秒短视频 / 故事板分镜 / 定制时长视频", "/content-production", "/assets/logos/biz-vdoo.png"],
  ["Amazon SPN 及 ERP 服务", "Listing 优化 + 库存管理 + 订单履约", "/amazon-erp", "/assets/logos/biz-amazon-erp.png"]
];

const growthFormUrl = "https://page.looyucdn.cn/mall/subpages/view/pages/article/article?id=2213782&cid=80058651&advId=18680672652&promote=18680672652&pacId=8d293a481c425ed62e63bc064e80c5106e727237a7b3c4b9535a476ff58112c0593fa4414ca43b530865491f622adf18";

const homeLinks = [
  ["增长技术", "/#tech"],
  ["前海玖麦", "/#jiumai"],
  ["生态伙伴", "/#partners"],
  ["洞察", "/insights"],
  ["联系", "mailto:young@digitauro.com"]
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const floatHref = pathname === "/" ? "#contact" : "/#contact";

  const navClassName = useMemo(() => `nav${pathname === "/" ? " home-nav" : ""}${scrolled || open ? " scrolled" : ""}${open ? " mobile-open" : ""}`, [pathname, scrolled, open]);

  useEffect(() => {
    let animationFrame = 0;
    let isScrolled = window.scrollY > 40;
    setScrolled(isScrolled);

    const update = () => {
      animationFrame = 0;
      const nextScrolled = window.scrollY > 40;
      if (nextScrolled === isScrolled) return;
      isScrolled = nextScrolled;
      setScrolled(nextScrolled);
    };

    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 769px)").matches) return;
    const lightLogo = new Image();
    lightLogo.decoding = "async";
    lightLogo.src = "/assets/logos/digitauro-logo-light.png";
    lightLogo.decode?.().catch(() => undefined);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-lock", open);
    return () => document.body.classList.remove("nav-lock");
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="noise-overlay" />
      <nav className={navClassName} id="navbar">
        <div className="nav-inner">
          <Link className="nav-brand" href="/" prefetch={false}>
            <picture className="nav-logo-picture">
              <source media="(max-width: 768px)" srcSet="/assets/logos/digitauro-symbol.png" />
              <img src={scrolled ? "/assets/logos/digitauro-logo-light.png" : "/assets/logos/digitauro-logo-dark.png"} alt="数漫极光 DigitAuro" loading="eager" decoding="sync" fetchPriority="high" />
            </picture>
          </Link>

          <div className="nav-menu">
            <div className="nav-item">
              <Link className={`nav-link${businessItems.some(([, , href]) => isActive(pathname, href)) ? " active" : ""}`} href="/#business" prefetch={false}>核心业务 ▾</Link>
              <div className="nav-dropdown">
                {businessItems.map(([title, desc, href, icon]) => (
                  <Link className={`dropdown-card${isActive(pathname, href) ? " active" : ""}`} href={href} prefetch={false} key={href}>
                    <img className="dropdown-icon-img" src={icon} alt="" loading="lazy" decoding="async" fetchPriority="low" />
                    <div><div className="dropdown-title">{title}</div><div className="dropdown-desc">{desc}</div></div>
                  </Link>
                ))}
              </div>
            </div>
            {homeLinks.map(([label, href]) => (
              href.startsWith("/") ? <Link className={`nav-link${isActive(pathname, href) ? " active" : ""}`} href={href} prefetch={false} key={href}>{label}</Link> : <a className={`nav-link${isActive(pathname, href) ? " active" : ""}`} href={href} key={href}>{label}</a>
            ))}
            <a className="btn-nav" href={growthFormUrl} target="_blank" rel="noopener">获取增长方案 →</a>
          </div>

          <button className="menu-toggle" aria-label={open ? "关闭菜单" : "打开菜单"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <span className="menu-toggle-bars" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>

        {open ? (
          <div className="mobile-nav-panel" aria-hidden="false">
            <div className="mobile-nav-scroll">
              <div className="mobile-nav-label">核心业务</div>
              <div className="mobile-business-grid">
                {businessItems.map(([title, desc, href, icon]) => (
                  <Link className={`mobile-business-card${isActive(pathname, href) ? " active" : ""}`} href={href} prefetch={false} key={href}>
                    <img src={icon} alt="" loading="lazy" decoding="async" fetchPriority="low" />
                    <span><strong>{title}</strong><em>{desc}</em></span>
                  </Link>
                ))}
              </div>
              <div className="mobile-nav-label">导航</div>
              <div className="mobile-nav-links">
                {homeLinks.map(([label, href]) => (
                  href.startsWith("/") ? <Link className={isActive(pathname, href) ? "active" : ""} href={href} prefetch={false} key={href}>{label}</Link> : <a className={isActive(pathname, href) ? "active" : ""} href={href} key={href}>{label}</a>
                ))}
                <a className="mobile-nav-cta" href={growthFormUrl} target="_blank" rel="noopener">获取增长方案 →</a>
              </div>
            </div>
          </div>
        ) : null}
      </nav>
      <main>{children}</main>
      <Footer />
      <a className="float-contact" href={floatHref}><span>💬</span>聊聊你的出海计划</a>
      <ClientEffects />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer site-footer" id="about">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/logos/digitauro-logo-dark.png" alt="数漫极光 DigitAuro" loading="lazy" decoding="async" fetchPriority="low" />
            <div className="footer-slogan" style={{ color: "#fff" }}>你的全球增长合伙人</div>
            <p className="footer-positioning" style={{ color: "rgba(255,255,255,.5)" }}>整合流量和技术，驱动品牌全球增长。</p>
          </div>
          <div className="footer-col"><h4>核心业务</h4><ul>{businessItems.map(([title, , href]) => <li key={href}><a href={href}>{title.replace("全域", "")}</a></li>)}</ul></div>
          <div className="footer-col"><h4>产品与技术</h4><ul><li><a href="https://jmai.digitwalk.co" target="_blank" rel="noopener">前海玖麦工作台</a></li><li><a href="https://www.noiz.ai" target="_blank" rel="noopener">Noiz.ai</a></li><li><a href="https://www.volcengine.com" target="_blank" rel="noopener">火山引擎</a></li></ul></div>
          <div className="footer-col"><h4>公司</h4><ul><li><a href="/#about">关于我们</a></li><li><a href="/insights">洞察</a></li><li><a href="/#partners">加入生态</a></li><li><a href={growthFormUrl} target="_blank" rel="noopener">获取增长方案</a></li></ul></div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© DigitAuro 2026 · 深圳市数漫极光科技有限公司 · <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2025440301号-1</a></div>
          <div className="footer-affiliates">
            <a className="footer-affiliate-link" href="https://jiumi.com.cn" target="_blank" rel="noopener"><img src="/assets/logos/jiumi_partner.png" alt="前海九米" style={{ height: 18 }} loading="lazy" decoding="async" fetchPriority="low" />前海九米</a>
            <span className="footer-affiliate-divider">·</span>
            <a className="footer-affiliate-link" href="https://www.digitwalk.co" target="_blank" rel="noopener"><img src="/assets/logos/digitwalk-new.png" alt="数字漫步" loading="lazy" decoding="async" fetchPriority="low" />数字漫步 DigitWalk</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ClientEffects() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const prefetchedRoutes = new Set<string>();
    const prefetchFromTarget = (target: EventTarget | null) => {
      const anchor = (target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      const route = `${url.pathname}${url.search}`;
      if (prefetchedRoutes.has(route)) return;
      prefetchedRoutes.add(route);
      router.prefetch(route);
    };

    const onIntent = (event: Event) => prefetchFromTarget(event.target);
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
    document.addEventListener("touchstart", onIntent, { passive: true });

    return () => {
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
      document.removeEventListener("touchstart", onIntent);
    };
  }, [router]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

      event.preventDefault();
      router.push(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  useEffect(() => {
    const animationFrames = new Set<number>();
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (!entry.isIntersecting || el.classList.contains("counted")) return;
        el.classList.add("counted");
        countObserver.unobserve(el);
        const target = Number.parseInt(el.dataset.target ?? "", 10);
        if (!target) return;
        const suffix = el.textContent?.replace(/[0-9]/g, "") ?? "";
        const startedAt = performance.now();
        let previousStep = -1;
        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / 900, 1);
          const step = Math.floor(progress * 30);
          if (step !== previousStep) {
            previousStep = step;
            el.textContent = `${Math.floor(target * progress)}${suffix}`;
          }
          if (progress < 1) {
            const frame = requestAnimationFrame(animate);
            animationFrames.add(frame);
          }
        };
        const frame = requestAnimationFrame(animate);
        animationFrames.add(frame);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(".data-value[data-target]").forEach((el) => countObserver.observe(el));

    const sectionLinks = new Map([
      ["tech", '.nav-link[href="/#tech"]'],
      ["jiumai", '.nav-link[href="/#jiumai"]'],
      ["partners", '.nav-link[href="/#partners"]']
    ]);
    const navLinks = document.querySelectorAll('.nav-link[href^="/#"]');
    const visibleSections = new Set<string>();
    const setActiveSection = () => {
      navLinks.forEach((link) => link.classList.remove("active"));
      let activeId: string | null = null;
      sectionLinks.forEach((_selector, id) => {
        if (visibleSections.has(id)) activeId = id;
      });
      const selector = activeId ? sectionLinks.get(activeId) : null;
      if (selector) document.querySelector<HTMLElement>(selector)?.classList.add("active");
    };

    const sectionObserver = pathname === "/" ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target.id);
        else visibleSections.delete(entry.target.id);
      });
      setActiveSection();
    }, { rootMargin: "-112px 0px -58% 0px", threshold: 0 }) : null;

    if (sectionObserver) {
      sectionLinks.forEach((_selector, id) => {
        const section = document.getElementById(id);
        if (section) sectionObserver.observe(section);
      });
    }

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.addEventListener("click", onClick);

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      sectionObserver?.disconnect();
      animationFrames.forEach((frame) => cancelAnimationFrame(frame));
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  return null;
}
