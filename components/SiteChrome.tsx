"use client";

import { usePathname } from "next/navigation";
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <a className="nav-brand" href="/">
            <img className="logo-dark" src="/assets/logos/digitauro-logo-dark.png" alt="数漫极光 DigitAuro" />
            <img className="logo-light" src="/assets/logos/digitauro-logo-light.png" alt="数漫极光 DigitAuro" />
            <img className="logo-symbol" src="/assets/logos/digitauro-symbol.png" alt="数漫极光 DigitAuro" />
          </a>

          <div className="nav-menu">
            <div className="nav-item">
              <a className={`nav-link${businessItems.some(([, , href]) => isActive(pathname, href)) ? " active" : ""}`} href="/#business">核心业务 ▾</a>
              <div className="nav-dropdown">
                {businessItems.map(([title, desc, href, icon]) => (
                  <a className={`dropdown-card${isActive(pathname, href) ? " active" : ""}`} href={href} key={href}>
                    <img className="dropdown-icon-img" src={icon} alt="" />
                    <div><div className="dropdown-title">{title}</div><div className="dropdown-desc">{desc}</div></div>
                  </a>
                ))}
              </div>
            </div>
            {homeLinks.map(([label, href]) => (
              <a className={`nav-link${isActive(pathname, href) ? " active" : ""}`} href={href} key={href}>{label}</a>
            ))}
            <a className="btn-nav" href={growthFormUrl} target="_blank" rel="noopener">获取增长方案 →</a>
          </div>

          <button className="menu-toggle" aria-label={open ? "关闭菜单" : "打开菜单"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <span className="menu-toggle-bars" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>

        <div className="mobile-nav-panel" aria-hidden={!open}>
          <div className="mobile-nav-scroll">
            <div className="mobile-nav-label">核心业务</div>
            <div className="mobile-business-grid">
              {businessItems.map(([title, desc, href, icon]) => (
                <a className={`mobile-business-card${isActive(pathname, href) ? " active" : ""}`} href={href} key={href}>
                  <img src={icon} alt="" />
                  <span><strong>{title}</strong><em>{desc}</em></span>
                </a>
              ))}
            </div>
            <div className="mobile-nav-label">导航</div>
            <div className="mobile-nav-links">
              {homeLinks.map(([label, href]) => (
                <a className={isActive(pathname, href) ? "active" : ""} href={href} key={href}>{label}</a>
              ))}
              <a className="mobile-nav-cta" href={growthFormUrl} target="_blank" rel="noopener">获取增长方案 →</a>
            </div>
          </div>
        </div>
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
            <img src="/assets/logos/digitauro-logo-dark.png" alt="数漫极光 DigitAuro" />
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
            <a className="footer-affiliate-link" href="https://jiumi.com.cn" target="_blank" rel="noopener"><img src="/assets/logos/jiumi_partner.png" alt="前海九米" style={{ height: 18 }} />前海九米</a>
            <span className="footer-affiliate-divider">·</span>
            <a className="footer-affiliate-link" href="https://www.digitwalk.co" target="_blank" rel="noopener"><img src="/assets/logos/digitwalk-new.png" alt="数字漫步" />数字漫步 DigitWalk</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ClientEffects() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (!entry.isIntersecting || el.classList.contains("counted")) return;
        el.classList.add("counted");
        const target = Number.parseInt(el.dataset.target ?? "", 10);
        if (!target) return;
        const suffix = el.textContent?.replace(/[0-9]/g, "") ?? "";
        let current = 0;
        const step = target / (1800 / 16);
        const animate = () => {
          current += step;
          el.textContent = `${Math.min(Math.floor(current), target)}${suffix}`;
          if (current < target) requestAnimationFrame(animate);
        };
        animate();
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(".data-value[data-target]").forEach((el) => countObserver.observe(el));

    const sectionLinks = [
      { id: "tech", selector: '.nav-link[href="/#tech"]' },
      { id: "jiumai", selector: '.nav-link[href="/#jiumai"]' },
      { id: "partners", selector: '.nav-link[href="/#partners"]' }
    ];

    const updateScrollSpy = () => {
      if (window.location.pathname !== "/") return;
      const navLinks = document.querySelectorAll('.nav-link[href^="/#"]');
      navLinks.forEach((link) => link.classList.remove("active"));

      const scrollY = window.scrollY + 120;
      let currentSelector: string | null = null;
      sectionLinks.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollY) currentSelector = section.selector;
      });

      if (window.scrollY < 200) currentSelector = null;
      if (currentSelector) document.querySelector<HTMLElement>(currentSelector)?.classList.add("active");
    };

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
    window.addEventListener("scroll", updateScrollSpy, { passive: true });
    updateScrollSpy();

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", updateScrollSpy);
    };
  }, []);

  return null;
}
