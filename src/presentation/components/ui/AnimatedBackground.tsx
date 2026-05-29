import { Dimensions } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'styled-components/native';

const { width, height } = Dimensions.get('window');

const BLOB_SIZE = width * 0.6;

function Blob({
  size,
  initialX,
  initialY,
  delay,
}: {
  size: number;
  initialX: number;
  initialY: number;
  delay: number;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(30, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
    translateY.value = withDelay(
      delay + 200,
      withRepeat(
        withTiming(-25, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          left: initialX,
          top: initialY,
          opacity: 0.15,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={{ flex: 1, borderRadius: size / 2 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
}

export default function AnimatedBackground() {
  const theme = useTheme();
  const opacity = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        },
        gradientStyle,
      ]}
    >
      <LinearGradient
        colors={[theme.colors.background, '#D1FAE5', theme.colors.background]}
        locations={[0, 0.5, 1]}
        style={{ flex: 1 }}
      >
        <Blob
          size={BLOB_SIZE}
          initialX={-BLOB_SIZE * 0.3}
          initialY={height * 0.1}
          delay={0}
        />
        <Blob
          size={BLOB_SIZE * 0.7}
          initialX={width - BLOB_SIZE * 0.4}
          initialY={height * 0.4}
          delay={800}
        />
        <Blob
          size={BLOB_SIZE * 0.5}
          initialX={width * 0.5}
          initialY={height * 0.75}
          delay={1600}
        />
      </LinearGradient>
    </Animated.View>
  );
}
