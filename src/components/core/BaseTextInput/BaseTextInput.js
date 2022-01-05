import React from 'react';
import PropTypes from 'prop-types';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { isAndroid } from '@src/utils/platform';
import { colorsSelector } from '@src/theme/theme.selector';
import { useSelector } from 'react-redux';
import styles from './styles';

const StyledInput = styled.TextInput`
  color: ${({ theme }) => theme.text1};
`;

const BaseTextInput = (props: TextInputProps) => {
  const {
    style,
    editable = true,
    onFocus,
    onBlur,
    onChangeText,
    value,
    ...rest
  } = props;
  const colors = useSelector(colorsSelector);
  const [selection, setSelection] = React.useState(undefined);
  const handleOnBlur = () => {
    if (typeof onBlur === 'function') {
      onBlur();
    }
    if (isAndroid() && !!value) {
      setSelection({ ...selection, start: 0, end: 0 });
      setTimeout(() => {
        setSelection(undefined);
      }, 100);
    }
  };

  const handleOnFocus = async () => {
    if (typeof onFocus === 'function') {
      onFocus();
    }
    if (isAndroid() && !!value) {
      setSelection(
        Object.assign({}, { start: value?.length, end: value?.length }),
      );
      setTimeout(() => {
        setSelection(undefined);
      }, 100);
    }
  };
  return (
    <StyledInput
      placeholderTextColor={colors.text10}
      returnKeyType="done"
      autoCorrect={false}
      spellCheck={false}
      autoCompleteType="off"
      style={[styles.input, style, !editable ? { color: colors.text4 } : null]}
      editable={editable}
      value={value}
      selection={isAndroid() && !!selection ? selection : undefined}
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      onChangeText={(text) => {
        setSelection(undefined);
        if (typeof onChangeText === 'function') {
          onChangeText(text);
        }
      }}
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
