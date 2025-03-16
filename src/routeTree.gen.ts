/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const Editor3dIndexLazyImport = createFileRoute('/editor3d/')()
const Editor3dTestLazyImport = createFileRoute('/editor3d/test')()
const Editor3dScriptLazyImport = createFileRoute('/editor3d/script')()
const Editor3dMarkLazyImport = createFileRoute('/editor3d/mark')()
const Editor3dDocumentLazyImport = createFileRoute('/editor3d/document')()
const Editor3dConfigLazyImport = createFileRoute('/editor3d/config')()
const Editor3dAddMeshLazyImport = createFileRoute('/editor3d/addMesh')()
const Editor3dAboutLazyImport = createFileRoute('/editor3d/about')()

// Create/Update Routes

const Editor3dIndexLazyRoute = Editor3dIndexLazyImport.update({
  id: '/editor3d/',
  path: '/editor3d/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/editor3d/index.lazy').then((d) => d.Route),
)

const Editor3dTestLazyRoute = Editor3dTestLazyImport.update({
  id: '/editor3d/test',
  path: '/editor3d/test',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/editor3d/test.lazy').then((d) => d.Route))

const Editor3dScriptLazyRoute = Editor3dScriptLazyImport.update({
  id: '/editor3d/script',
  path: '/editor3d/script',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/editor3d/script.lazy').then((d) => d.Route),
)

const Editor3dMarkLazyRoute = Editor3dMarkLazyImport.update({
  id: '/editor3d/mark',
  path: '/editor3d/mark',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/editor3d/mark.lazy').then((d) => d.Route))

const Editor3dDocumentLazyRoute = Editor3dDocumentLazyImport.update({
  id: '/editor3d/document',
  path: '/editor3d/document',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/editor3d/document.lazy').then((d) => d.Route),
)

const Editor3dConfigLazyRoute = Editor3dConfigLazyImport.update({
  id: '/editor3d/config',
  path: '/editor3d/config',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/editor3d/config.lazy').then((d) => d.Route),
)

const Editor3dAddMeshLazyRoute = Editor3dAddMeshLazyImport.update({
  id: '/editor3d/addMesh',
  path: '/editor3d/addMesh',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/editor3d/addMesh.lazy').then((d) => d.Route),
)

const Editor3dAboutLazyRoute = Editor3dAboutLazyImport.update({
  id: '/editor3d/about',
  path: '/editor3d/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/editor3d/about.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/editor3d/about': {
      id: '/editor3d/about'
      path: '/editor3d/about'
      fullPath: '/editor3d/about'
      preLoaderRoute: typeof Editor3dAboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/editor3d/addMesh': {
      id: '/editor3d/addMesh'
      path: '/editor3d/addMesh'
      fullPath: '/editor3d/addMesh'
      preLoaderRoute: typeof Editor3dAddMeshLazyImport
      parentRoute: typeof rootRoute
    }
    '/editor3d/config': {
      id: '/editor3d/config'
      path: '/editor3d/config'
      fullPath: '/editor3d/config'
      preLoaderRoute: typeof Editor3dConfigLazyImport
      parentRoute: typeof rootRoute
    }
    '/editor3d/document': {
      id: '/editor3d/document'
      path: '/editor3d/document'
      fullPath: '/editor3d/document'
      preLoaderRoute: typeof Editor3dDocumentLazyImport
      parentRoute: typeof rootRoute
    }
    '/editor3d/mark': {
      id: '/editor3d/mark'
      path: '/editor3d/mark'
      fullPath: '/editor3d/mark'
      preLoaderRoute: typeof Editor3dMarkLazyImport
      parentRoute: typeof rootRoute
    }
    '/editor3d/script': {
      id: '/editor3d/script'
      path: '/editor3d/script'
      fullPath: '/editor3d/script'
      preLoaderRoute: typeof Editor3dScriptLazyImport
      parentRoute: typeof rootRoute
    }
    '/editor3d/test': {
      id: '/editor3d/test'
      path: '/editor3d/test'
      fullPath: '/editor3d/test'
      preLoaderRoute: typeof Editor3dTestLazyImport
      parentRoute: typeof rootRoute
    }
    '/editor3d/': {
      id: '/editor3d/'
      path: '/editor3d'
      fullPath: '/editor3d'
      preLoaderRoute: typeof Editor3dIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/editor3d/about': typeof Editor3dAboutLazyRoute
  '/editor3d/addMesh': typeof Editor3dAddMeshLazyRoute
  '/editor3d/config': typeof Editor3dConfigLazyRoute
  '/editor3d/document': typeof Editor3dDocumentLazyRoute
  '/editor3d/mark': typeof Editor3dMarkLazyRoute
  '/editor3d/script': typeof Editor3dScriptLazyRoute
  '/editor3d/test': typeof Editor3dTestLazyRoute
  '/editor3d': typeof Editor3dIndexLazyRoute
}

export interface FileRoutesByTo {
  '/editor3d/about': typeof Editor3dAboutLazyRoute
  '/editor3d/addMesh': typeof Editor3dAddMeshLazyRoute
  '/editor3d/config': typeof Editor3dConfigLazyRoute
  '/editor3d/document': typeof Editor3dDocumentLazyRoute
  '/editor3d/mark': typeof Editor3dMarkLazyRoute
  '/editor3d/script': typeof Editor3dScriptLazyRoute
  '/editor3d/test': typeof Editor3dTestLazyRoute
  '/editor3d': typeof Editor3dIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/editor3d/about': typeof Editor3dAboutLazyRoute
  '/editor3d/addMesh': typeof Editor3dAddMeshLazyRoute
  '/editor3d/config': typeof Editor3dConfigLazyRoute
  '/editor3d/document': typeof Editor3dDocumentLazyRoute
  '/editor3d/mark': typeof Editor3dMarkLazyRoute
  '/editor3d/script': typeof Editor3dScriptLazyRoute
  '/editor3d/test': typeof Editor3dTestLazyRoute
  '/editor3d/': typeof Editor3dIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/editor3d/about'
    | '/editor3d/addMesh'
    | '/editor3d/config'
    | '/editor3d/document'
    | '/editor3d/mark'
    | '/editor3d/script'
    | '/editor3d/test'
    | '/editor3d'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/editor3d/about'
    | '/editor3d/addMesh'
    | '/editor3d/config'
    | '/editor3d/document'
    | '/editor3d/mark'
    | '/editor3d/script'
    | '/editor3d/test'
    | '/editor3d'
  id:
    | '__root__'
    | '/editor3d/about'
    | '/editor3d/addMesh'
    | '/editor3d/config'
    | '/editor3d/document'
    | '/editor3d/mark'
    | '/editor3d/script'
    | '/editor3d/test'
    | '/editor3d/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  Editor3dAboutLazyRoute: typeof Editor3dAboutLazyRoute
  Editor3dAddMeshLazyRoute: typeof Editor3dAddMeshLazyRoute
  Editor3dConfigLazyRoute: typeof Editor3dConfigLazyRoute
  Editor3dDocumentLazyRoute: typeof Editor3dDocumentLazyRoute
  Editor3dMarkLazyRoute: typeof Editor3dMarkLazyRoute
  Editor3dScriptLazyRoute: typeof Editor3dScriptLazyRoute
  Editor3dTestLazyRoute: typeof Editor3dTestLazyRoute
  Editor3dIndexLazyRoute: typeof Editor3dIndexLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  Editor3dAboutLazyRoute: Editor3dAboutLazyRoute,
  Editor3dAddMeshLazyRoute: Editor3dAddMeshLazyRoute,
  Editor3dConfigLazyRoute: Editor3dConfigLazyRoute,
  Editor3dDocumentLazyRoute: Editor3dDocumentLazyRoute,
  Editor3dMarkLazyRoute: Editor3dMarkLazyRoute,
  Editor3dScriptLazyRoute: Editor3dScriptLazyRoute,
  Editor3dTestLazyRoute: Editor3dTestLazyRoute,
  Editor3dIndexLazyRoute: Editor3dIndexLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/editor3d/about",
        "/editor3d/addMesh",
        "/editor3d/config",
        "/editor3d/document",
        "/editor3d/mark",
        "/editor3d/script",
        "/editor3d/test",
        "/editor3d/"
      ]
    },
    "/editor3d/about": {
      "filePath": "editor3d/about.lazy.tsx"
    },
    "/editor3d/addMesh": {
      "filePath": "editor3d/addMesh.lazy.tsx"
    },
    "/editor3d/config": {
      "filePath": "editor3d/config.lazy.tsx"
    },
    "/editor3d/document": {
      "filePath": "editor3d/document.lazy.tsx"
    },
    "/editor3d/mark": {
      "filePath": "editor3d/mark.lazy.tsx"
    },
    "/editor3d/script": {
      "filePath": "editor3d/script.lazy.tsx"
    },
    "/editor3d/test": {
      "filePath": "editor3d/test.lazy.tsx"
    },
    "/editor3d/": {
      "filePath": "editor3d/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
