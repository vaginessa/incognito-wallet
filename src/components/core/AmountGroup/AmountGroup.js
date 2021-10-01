import React, {memo} from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import styled from './AmountGroup.styled';

const AmountGroup = ({ title }) => {
  return (
    <View style={styled.wrapper}>
      <Text style={styled.title}>{title}</Text>
      <Text style={styled.baseAmount}>20.0 $</Text>
      <Text style={styled.compareAmount}>= 10 PRV</Text>
    </View>
  );
};

AmountGroup.defaultProps = {
  title: 'Total rewards'
};

AmountGroup.propTypes = {
  title: PropTypes.string
};

export default memo(AmountGroup);
