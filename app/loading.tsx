export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-label="页面加载中">
      <div className="route-loading-shell" aria-hidden="true">
        <span className="route-loading-kicker" />
        <span className="route-loading-title" />
        <span className="route-loading-title short" />
        <span className="route-loading-copy" />
        <span className="route-loading-action" />
      </div>
    </div>
  );
}
