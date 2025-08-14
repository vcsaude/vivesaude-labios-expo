import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ViewStyle,
} from 'react-native';
import Button from './Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closable?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  style?: ViewStyle;
  animationType?: 'slide' | 'fade' | 'none';
  transparent?: boolean;
}

const colors = {
  bg: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',
  text: '#1a1a2e',
  border: '#e2e8f0',
};

export default function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closable = true,
  size = 'medium',
  style,
  animationType = 'slide',
  transparent = true,
}: ModalProps) {
  const handleBackdropPress = () => {
    if (closable) {
      onClose();
    }
  };

  const handleClosePress = () => {
    if (closable) {
      onClose();
    }
  };

  const modalContentStyle = [
    styles.modalContent,
    styles[`${size}Modal`],
    style,
  ];

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={handleClosePress}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <SafeAreaView style={styles.safeArea}>
              <View style={modalContentStyle}>
                {(title || showCloseButton) && (
                  <View style={styles.header}>
                    {title && (
                      <Text style={styles.title}>{title}</Text>
                    )}
                    {showCloseButton && closable && (
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClosePress}
                        accessibilityRole="button"
                        accessibilityLabel="Fechar modal"
                      >
                        <Text style={styles.closeButtonText}></Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                
                <View style={styles.content}>
                  {children}
                </View>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

// Alert Modal Component (for confirmations, etc.)
interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export function AlertModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  type = 'info',
}: AlertModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleCancel}
      size="small"
      closable={!!onCancel}
      showCloseButton={false}
    >
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        
        <View style={styles.alertActions}>
          {onCancel && (
            <Button
              title={cancelText}
              onPress={handleCancel}
              variant="outline"
              style={styles.alertButton}
            />
          )}
          <Button
            title={confirmText}
            onPress={handleConfirm}
            variant="primary"
            style={[styles.alertButton, { flex: 1 }]}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: colors.bg,
    borderRadius: 16,
    maxHeight: '90%',
    width: '100%',
  },
  smallModal: {
    maxWidth: 320,
  },
  mediumModal: {
    maxWidth: 480,
  },
  largeModal: {
    maxWidth: 640,
  },
  fullscreenModal: {
    flex: 1,
    maxHeight: '100%',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  
  // Alert styles
  alertContent: {
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  alertButton: {
    flex: 1,
  },
});