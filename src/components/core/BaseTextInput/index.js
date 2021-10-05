import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';
import { COLORS } from '@src/styles';
import styles from './styles';

const BaseTextInput = ({ style, ...rest }) => {
  return (
    <TextInput
      placeholderTextColor={COLORS.colorGreyMedium}
      returnKeyType="done"
      autoCorrect={false}
      spellCheck={false}
      autoCompleteType="off"
      style={[
        styles.input,
        style,
        // !rest?.editable ? { color: COLORS.newGrey } : null,
      ]}
      {...rest}
    />
  );
};

BaseTextInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

BaseTextInput.defaultProps = {
  style: null,
};

export default React.memo(BaseTextInput);
