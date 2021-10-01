import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS, FONT} from '@src/styles';
import {useDispatch, useSelector} from 'react-redux';
import {BottomModalActions, BottomModalSelector} from '@components/core/BottomModal';

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: COLORS.white,
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 10,
    color: COLORS.black,
    marginBottom: 22
  },
});

const BottomModal = () => {
  const dispatch = useDispatch();
  const { visible, customHeader, customContent, title } = useSelector(BottomModalSelector.bottomModalSelector);
  const handleClose = () => dispatch(BottomModalActions.actionCloseModal());
  return (
    <Modal
      isVisible={visible}
      style={styles.view}
      onBackdropPress={handleClose}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {customHeader && customHeader}
        <ScrollView>
          {customContent && customContent}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default memo(BottomModal);
