import React from 'react';
import { Image, ImageProps, StyleProp, ImageStyle } from 'react-native';
import Animated from 'react-native-reanimated';

interface SharedRecipeImageProps extends Omit<ImageProps, 'style'> {
  style?: StyleProp<ImageStyle>;
  sharedTransitionTag?: string;
}

const AnimatedImage = Animated.createAnimatedComponent(Image) as React.ComponentType<
  ImageProps & { sharedTransitionTag?: string }
>;

const SharedRecipeImage: React.FC<SharedRecipeImageProps> = ({ sharedTransitionTag, ...props }) => {
  return (
    <AnimatedImage 
      {...props} 
      sharedTransitionTag={sharedTransitionTag} 
    />
  );
};

export default SharedRecipeImage;
