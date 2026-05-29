import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';

type Variant = 'primary' | 'secondary' | 'danger';

interface Props extends TouchableOpacityProps {
  variant?: Variant;
  loading?: boolean;
  children: string;
}

const variantStyles = {
  primary: {
    background: '#10B981',
    text: '#FFFFFF',
  },
  secondary: {
    background: '#F3F4F6',
    text: '#1F2937',
  },
  danger: {
    background: '#EF4444',
    text: '#FFFFFF',
  },
};

const StyledButton = styled.TouchableOpacity<{ variant: Variant }>`
  background-color: ${(props) => variantStyles[props.variant].background};
  border-radius: 10px;
  padding-vertical: 14px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 8px;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const ButtonText = styled.Text<{ variant: Variant }>`
  color: ${(props) => variantStyles[props.variant].text};
  font-size: 16px;
  font-weight: 700;
`;

export default function Button({
  variant = 'primary',
  loading = false,
  children,
  ...rest
}: Props) {
  return (
    <StyledButton variant={variant} disabled={loading || rest.disabled} {...rest}>
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].text} size="small" />
      ) : (
        <ButtonText variant={variant}>{children}</ButtonText>
      )}
    </StyledButton>
  );
}
