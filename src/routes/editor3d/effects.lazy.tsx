import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/editor3d/effects")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>还没有</div>;
}
