import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// 1. Delete Service Confirmation Popup
export const DeleteServicePopup = ({
  visible,
  serviceName,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  serviceName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Circular Red Trash Icon */}
          <View style={[styles.iconCircle, styles.redBg]}>
            <Icon name="trash" size={24} color="#EF4444" />
          </View>

          <Text style={styles.title}>Delete Service</Text>
          
          <Text style={styles.message}>
            Are you sure you want to delete {"\n"}
            <Text style={styles.boldText}>"{serviceName}"</Text>?
          </Text>

          <Text style={styles.warningNote}>This action cannot be undone.</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// 2. Delete Category Confirmation Popup
export const DeleteCategoryPopup = ({
  visible,
  categoryName,
  servicesCount,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  categoryName: string;
  servicesCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Circular Red Folder Icon */}
          <View style={[styles.iconCircle, styles.redBg]}>
            <Icon name="folder-open" size={24} color="#EF4444" />
          </View>

          <Text style={styles.title}>Delete Category</Text>

          <Text style={styles.message}>
            Are you sure you want to delete {"\n"}
            <Text style={styles.boldText}>"{categoryName}"</Text> category?
          </Text>

          <Text style={styles.dangerWarningNote}>
            All {servicesCount} services under this category{"\n"}will also be deleted.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// 3. Success / Completed Action Popup
export const SuccessPopup = ({
  visible,
  title,
  message,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Circular Green Check Icon */}
          <View style={[styles.iconCircle, styles.greenBg]}>
            <Icon name="check-circle" size={32} color="#10B981" />
          </View>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.successMessage}>{message}</Text>

          <TouchableOpacity style={styles.okBtn} onPress={onConfirm}>
            <Text style={styles.confirmText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(32, 35, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#20232A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  redBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  greenBg: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#20232A',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14.5,
    color: '#55545C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#20232A',
  },
  successMessage: {
    fontSize: 14.5,
    color: '#55545C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  warningNote: {
    fontSize: 13,
    color: '#858994',
    marginBottom: 22,
    textAlign: 'center',
  },
  dangerWarningNote: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 22,
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#ECECF3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelText: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#858994',
  },
  deleteBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  okBtn: {
    width: '100%',
    height: 46,
    borderRadius: 23,
    backgroundColor: '#6D4CF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
