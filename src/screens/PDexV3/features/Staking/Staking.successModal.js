import React, {memo} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {COLORS, FONT} from '@src/styles';
import {BTNPrimary} from '@components/core/Button';
import {useDispatch} from 'react-redux';
import {actionToggleModal} from '@components/Modal';
import {SuccessIcon} from '@components/Icons';

const SuccessModal = ({ onButtonPress, title, content, subContent, buttonText }) => {
  const dispatch = useDispatch();
  const onPress = () => {
    typeof onButtonPress === 'function' && onButtonPress();
    dispatch(actionToggleModal());
  };
  return (
    <View style={styled.container}>
      <SuccessIcon />
      {!!title && <Text style={styled.title}>{title}</Text>}
      {!!content && (<Text style={styled.content}>{content}</Text>)}
      {!!subContent && (<Text style={styled.content}>{subContent}</Text>)}
      <BTNPrimary title={buttonText} wrapperStyle={styled.button} onPress={onPress} />
    </View>
  );
};

SuccessModal.defaultProps = {
  title: null,
  content: null,
  subContent: null,
  buttonText: 'Ok'
};

SuccessModal.propTypes = {
  onButtonPress: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  subContent: PropTypes.string,
  buttonText: PropTypes.string,
};

const styled = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
  },
  title: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    textAlign: 'center',
    marginTop: 8
  },
  content: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
    color: COLORS.newGrey,
    lineHeight: FONT.SIZE.regular + 5,
    textAlign: 'center',
    marginTop: 24,
  },
  button: {
    width: '100%',
    marginTop: 37,
    marginBottom: 0
  }
});

export default memo(SuccessModal);
