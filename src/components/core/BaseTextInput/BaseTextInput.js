import React from 'react';
import PropTypes from 'prop-types';
import { TextInputProps } from 'react-native';
import { COLORS } from '@src/styles';
import styled from 'styled-components/native';
import styles from './styles';


const StyledInput = styled.TextInput`
  color: ${({ theme }) => theme.text1};
`;

const BaseTextInput = (props: TextInputProps) => {
  const { style, editable = true, ...rest } = props;
  return (
    <StyledInput
      placeholderTextColor={COLORS.white}
      returnKeyType="done"
      autoCorrect={false}
      spellCheck={false}
      autoCompleteType="off"
      style={[
        styles.input,
        style,
        !editable ? { color: COLORS.newGrey } : null,
      ]}
      editable={editable}
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
