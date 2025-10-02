// src/theme/ThemeProvider.tsx
import React, { createContext, ReactNode, useContext } from 'react';
import { colors, typography } from './index';

type Theme = {
  colors: typeof colors;
  typography: typeof typography;
};

// Option A (simple) : valeur par défaut avec ton thème
const ThemeContext = createContext<Theme>({ colors, typography });

// Option B (strict) : évite l'oubli du Provider
// const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ colors, typography }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Pas d’argument ici !
export const useTheme = () => {
  // Option B (strict) :
  // const ctx = useContext(ThemeContext);
  // if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  // return ctx;

  return useContext(ThemeContext);
};
