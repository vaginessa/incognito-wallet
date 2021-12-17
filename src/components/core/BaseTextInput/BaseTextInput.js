import React from 'react';
import PropTypes from 'prop-types';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { colorsSelector } from '@src/theme/theme.selector';
import { useSelector } from 'react-redux';
import styles from './styles';

const StyledInput = styled.TextInput`
  color: ${({ theme }) => theme.text1};
`;

const BaseTextInput = (props: TextInputProps) => {
  const { style, editable = true, ...rest } = props;
  const colors = useSelector(colorsSelector);
  return (
    <StyledInput
      placeholderTextColor={colors.text10}
      returnKeyType="done"
      autoCorrect={false}
      spellCheck={false}
      autoCompleteType="off"
      style={[
        styles.input,
        style,
        !editable ? { color: colors.text4 } : null,
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
