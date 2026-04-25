import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationEnd: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationEnd }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const [activeSquare, setActiveSquare] = useState(0);
  const totalSquares = 5;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Squares animation loop
    let current = 0;
    const interval = setInterval(() => {
      setActiveSquare(current % totalSquares);
      current++;
    }, 400);

    // End animation after some time
    const timeout = setTimeout(() => {
      clearInterval(interval);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationEnd();
      });
    }, 4000); // Show for 4 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../assets/logo_splash.png')}
          style={[styles.logo, { transform: [{ scale: logoScale }] }]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.loaderContainer}>
        {[...Array(totalSquares)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.square,
              { backgroundColor: activeSquare === index ? '#F59E0B' : '#1e2330' },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D111C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logoContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 10,
  },
  square: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});

export default AnimatedSplashScreen;
