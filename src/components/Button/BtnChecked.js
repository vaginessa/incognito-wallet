import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CheckedIcon } from '@src/components/Icons';
import { Row } from '@src/components';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  btnStyle: {},
  row: {
    alignItems: 'center',
  },
});

const BtnBack = (props) => {
  const { btnStyle, checked, hook, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...rest}>
      <Row style={styled.row}>
        <CheckedIcon checked={checked} />
        {hook}
      </Row>
    </TouchableOpacity>
  );
};

BtnBack.defaultProps = {
  btnStyle: null,
  hook: null,
};

BtnBack.propTypes = {
  btnStyle: PropTypes.any,
  checked: PropTypes.bool.isRequired,
  hook: PropTypes.element,
};

export default BtnBack;
