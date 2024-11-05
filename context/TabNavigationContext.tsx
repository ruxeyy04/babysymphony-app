import React, { createContext, useContext } from 'react';

type TabNavigationContextType = {
  setIndex: (index: number) => void;
};

export const TabNavigationContext = createContext<TabNavigationContextType | null>(null);

export const TabNavigationProvider = TabNavigationContext.Provider;

export const useTabNavigation = () => {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw new Error("useTabNavigation must be used within a TabNavigationProvider");
  }
  return context;
};
