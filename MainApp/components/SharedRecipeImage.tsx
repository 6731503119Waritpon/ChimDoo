import React from 'react';
import { ImageProps, StyleProp, ImageStyle } from 'react-native';
import Animated from 'react-native-reanimated';

interface SharedRecipeImageProps extends Omit<ImageProps, 'style'> {
  style?: StyleProp<ImageStyle>;
  sharedTransitionTag?: string;
}

const SharedRecipeImage: React.FC<SharedRecipeImageProps> = ({ sharedTransitionTag, ...props }) => {
  const AnimatedImage = Animated.Image as any;
  
  return (
    <AnimatedImage 
      {...props} 
      sharedTransitionTag={sharedTransitionTag} 
    />
  );
};

export default SharedRecipeImage;
