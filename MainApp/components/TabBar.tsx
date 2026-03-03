import { StyleSheet, View, LayoutChangeEvent, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState({ height: 50, width: 100 });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  const bubbleWidth = buttonWidth - 20;
  const bubbleInset = (buttonWidth - bubbleWidth) / 2;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index, {
      damping: 18,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index, buttonWidth]);

  return (
    <View style={styles.tabbarWrapper}>
      <View onLayout={onTabbarLayout} style={styles.tabbar}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              backgroundColor: '#1D3557',
              borderRadius: 24,
              left: bubbleInset,
              top: 8,
              height: dimensions.height - 16,
              width: bubbleWidth,
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              color={isFocused ? '#fff' : '#555'}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabbarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 4,
    paddingHorizontal: 16,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 500,
    paddingVertical: 12,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
});