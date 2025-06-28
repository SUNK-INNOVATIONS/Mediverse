import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Easing } from 'react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const COLORS = ['#4682B4', '#6A5ACD', '#DB7093', '#FFD700'];

const blobs = [
  { x: width * 0.2, y: height * 0.2, size: 520 },   // bigger
  { x: width * 0.7, y: height * 0.15, size: 480 },  // bigger
  { x: width * 0.5, y: height * 0.5, size: 420 },   // bigger
  { x: width * 0.2, y: height * 0.7, size: 380 },
  { x: width * 0.7, y: height * 0.7, size: 420 },
  { x: width * 0.5, y: height * 0.8, size: 360 },
];

export default function BlendedMeshGradient() {
  const colorAnims = useRef(
    blobs.map(() => new Animated.Value(Math.random()))
  ).current;

  const positionAnims = useRef(
    blobs.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0)
    }))
  ).current;

  useEffect(() => {
    colorAnims.forEach(anim => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random(),
            duration: 10000 + Math.random() * 5000,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: Math.random(),
            duration: 10000 + Math.random() * 5000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });

    positionAnims.forEach((anim, i) => {
      const move = () => {
  const blob = blobs[i];
  const maxX = width - blob.size / 2;
  const minX = blob.size / 2;
  const maxY = height - blob.size / 2;
  const minY = blob.size / 2;

  const targetX = Math.max(
    minX,
    Math.min(
      maxX,
      blob.x + (Math.random() - 0.5) * (width - blob.size)
    )
  );
  const targetY = Math.max(
    minY,
    Math.min(
      maxY,
      blob.y + (Math.random() - 0.5) * (height - blob.size)
    )
  );

  Animated.parallel([
    Animated.timing(anim.x, {
      toValue: targetX - blob.x,
      duration: 12000 + Math.random() * 4000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }),
    Animated.timing(anim.y, {
      toValue: targetY - blob.y,
      duration: 12000 + Math.random() * 4000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }),
  ]).start(() => move());
};

      move();
    });
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      {blobs.map((blob, i) => {
        const backgroundColor = colorAnims[i].interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [
            COLORS[i % COLORS.length],
            COLORS[(i + 1) % COLORS.length],
            COLORS[(i + 2) % COLORS.length],
            COLORS[(i + 3) % COLORS.length],
            COLORS[i % COLORS.length]
          ]
        });

        const left = Animated.add(blob.x - blob.size / 2, positionAnims[i].x);
        const top = Animated.add(blob.y - blob.size / 2, positionAnims[i].y);

        return (
          <Animated.View
            key={`blob-layer-${i}`}
            style={[
              StyleSheet.absoluteFill,
              { zIndex: 1 }
            ]}
            pointerEvents="none"
          >
            <Animated.View
              style={[
                styles.blob,
                {
                  left,
                  top,
                  width: blob.size,
                  height: blob.size,
                  borderRadius: blob.size / 2,
                  backgroundColor,
                  opacity: 0.8,
                  transform: [
                    {
                      scale: positionAnims[i].x.interpolate({
                        inputRange: [-50, 0, 50],
                        outputRange: [0.92, 1, 0.92],
                        extrapolate: 'clamp'
                      })
                    }
                  ]
                }
              ]}
            />
          </Animated.View>
        );
      })}
      <BlurView
        intensity={100}
        tint="light"
        style={[StyleSheet.absoluteFill, { zIndex: 2 }]}
      />
      <View style={styles.frostedOverlay} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    zIndex: 1,
  },
  frostedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 3,
  },
});