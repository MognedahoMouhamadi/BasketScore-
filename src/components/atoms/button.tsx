import { TouchableOpacity, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type Variant = 'primary' | 'secondary';
type Size = 'small' | 'large';

type ButtonProps = {
  title: string;
  variant?: Variant;
  size?: Size;
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
};

export function Button({
  title,
  variant,
  size,
  bgColor,
  textColor,
  borderRadius,
  paddingVertical,
  paddingHorizontal,
  style,
  ...rest
}: ButtonProps) {
  // recupère couleurs par défaut du theme
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={[
        styles.base,
        // applique d’abord les styles par variant/size
        variant && styles[variant],
        size && styles[size],
        // ensuite les overrides de l’utilisateur
        bgColor && { backgroundColor: bgColor },
        borderRadius != null && { borderRadius },
        paddingVertical != null && { paddingVertical },
        paddingHorizontal != null && { paddingHorizontal },
        style,
      ]}
      {...rest}
    >
      <Text style={{ color: textColor ?? colors.background }}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343f49ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,





  },
  // Example variants
  primary: {
    backgroundColor: '#000000ff',
        shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  secondary: {
    backgroundColor: '#ff0000ff',
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Example sizes
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
});
