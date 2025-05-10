import React, { ReactNode } from "react";
import {
  Modal,
  View,
  SafeAreaView,
  Animated,
  StyleSheet,
  ModalProps,
} from "react-native";

interface AnimatedModalProps extends ModalProps {
  visible: boolean;
  hideModal: () => void;
  backdropAnim: Animated.Value;
  modalAnim: Animated.Value;
  children: ReactNode;
}

const ProSubscribeModal: React.FC<AnimatedModalProps> = ({
  visible,
  hideModal,
  backdropAnim,
  modalAnim,
  children,
  ...modalProps
}) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={hideModal}
      {...modalProps}
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
        className="flex-1 justify-center items-center"
      >
        <SafeAreaView className="w-full items-center">
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
                opacity: modalAnim,
              },
            ]}
            className="w-full"
          >
            <View className="p-4">{children}</View>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContainer: {
    width: "100%",
    maxWidth: 480,
  },
});

export default ProSubscribeModal;
