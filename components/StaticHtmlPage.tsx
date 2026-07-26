import { readStaticPage } from "@/lib/static-page";
import { PageRoute } from "@/lib/routes";

export function StaticHtmlPage({ route }: { route: PageRoute }) {
  const page = readStaticPage(route);

  return (
    <>
      {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </>
  );
}
