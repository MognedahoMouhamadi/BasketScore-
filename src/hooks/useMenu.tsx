 
import React from 'react';

export default function useMenu() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openMenu = React.useCallback(() => setMenuOpen(true), []);
  const closeMenu = React.useCallback(() => setMenuOpen(false), []);
  const toggleMenu = React.useCallback(() => setMenuOpen(o => !o), []);

  return { menuOpen, setMenuOpen, openMenu, closeMenu, toggleMenu };
}
