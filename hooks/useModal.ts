import { useState, useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useModal = (onAfterClose?: () => void) => {
  const [isVisible, setIsVisible] = useState(false);

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onAfterClose) onAfterClose();
    });
  };

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  return {
    isVisible,
    showModal,
    hideModal,
    backdropAnim,
    modalAnim,
  };
};
