import React from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import Button from './Button';
import IconClose from 'react-native-vector-icons/AntDesign';

const Popup = ({visible, onClose, title, children, style}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={[styles.modalBody, style && {...style}]}>
            {children}
          </View>
          <Button
            style={styles.closeButton}
            onChange={onClose}
            text=""
            textStyle={styles.closeButtonText}>
            <IconClose name="closecircle" size={20} color="black" />
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 3,
    borderWidth: 2,
    borderColor: 'black',
    width: '80%',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    elevation: 5,
    marginBottom: '8%',
    marginTop: '10%',
  },
  modalTitle: {
    padding: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    borderLeftWidth: 3,
  },
  modalBody: {
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Popup;
