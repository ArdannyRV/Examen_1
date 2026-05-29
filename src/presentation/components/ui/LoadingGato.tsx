import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function LoadingGato() {
  return (
    <Container>
      <LottieView
        source={require('../../../../assets/animations/loading_gato.json')}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
        resizeMode="contain"
      />
    </Container>
  );
}
