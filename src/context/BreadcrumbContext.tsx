import React from 'react';

export interface NamedBreadcrumb {
  path: string;
  name: string;
}

interface BreadcrumbsContextState {
  namedBreadcrumbs: Map<string, string>;
  addBreadcrumb: (breadcrumb: NamedBreadcrumb) => void;
  deleteBreadcrumb: (path: string) => void;
}

export const BreadcrumbsContext = React.createContext<BreadcrumbsContextState>({
  namedBreadcrumbs: new Map(),
  addBreadcrumb: (_) => {},
  deleteBreadcrumb: (_) => {},
});
