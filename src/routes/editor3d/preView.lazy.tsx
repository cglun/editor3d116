import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/editor3d/preView")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/editor3d/preView"!</div>;
}
