import { useState } from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';

interface Props extends TextInputProps {
  label?: string;
}

const Wrapper = styled.View`
  margin-bottom: 4px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
  margin-top: 12px;
`;

const StyledInput = styled.TextInput<{ isFocused: boolean }>`
  border-width: 1px;
  border-color: ${({ isFocused, theme }) =>
    isFocused ? theme.colors.borderFocus : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding-horizontal: 14px;
  padding-vertical: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export default function Input({ label, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Wrapper>
      {label ? <Label>{label}</Label> : null}
      <StyledInput
        isFocused={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </Wrapper>
  );
}
