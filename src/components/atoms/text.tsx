// components/atoms/Text.tsx
import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { typography, colors } from '../../theme/index';

type TextProps = {
  children: React.ReactNode;
  variant?: 'small' | 'body' | 'title' | 'heading' | 'hero';
  style?: TextStyle | TextStyle[];
};

export function Text({ children, variant = 'body', style }: TextProps) {
  const fontSize = typography.fontSizes[variant] || typography.fontSizes.body;
  return (
    <RNText style={[styles.base, { fontSize }, style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamilyRegular,
    color: colors.text,
  },
});
