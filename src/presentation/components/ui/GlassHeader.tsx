import type { ReactNode } from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 16px;
  margin-horizontal: 16px;
  margin-top: 52px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TitleArea = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const TitleText = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

export default function GlassHeader({
  title,
  leftIcon,
  rightIcon,
  children,
}: {
  title: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Wrapper>
      <Row>
        <TitleArea>
          {leftIcon}
          <TitleText numberOfLines={1}>{title}</TitleText>
        </TitleArea>
        {rightIcon}
      </Row>
      {children}
    </Wrapper>
  );
}
