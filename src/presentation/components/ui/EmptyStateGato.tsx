import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 40px;
`;

const Message = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  margin-top: 12px;
`;

interface Props {
  message?: string;
}

export default function EmptyStateGato({ message = 'No se encontraron resultados' }: Props) {
  return (
    <Container>
      <LottieView
        source={require('../../../../assets/animations/no_results_gato.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
      <Message>{message}</Message>
    </Container>
  );
}
