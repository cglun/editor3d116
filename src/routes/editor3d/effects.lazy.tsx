import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/editor3d/effects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editor3d/efects"!</div>
}
