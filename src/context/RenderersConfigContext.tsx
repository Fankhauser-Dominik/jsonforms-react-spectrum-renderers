import React from 'react';

export interface RenderersConfigContextType {
  externalizePath?: (path: string) => string | undefined;
}

export const RenderersConfigContext = React.createContext<RenderersConfigContextType>({
  externalizePath: (path) => path,
});
