// components/atoms/Icon.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 24, color }: IconProps) {
  const { colors } = useTheme();
  return <Ionicons name={name} size={size} color={color || colors.text} />;
}
