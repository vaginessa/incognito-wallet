import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import { Name, Symbol } from './Token';
import withToken from './Token.enhance';
import { styled } from './Token.styled';

const TokenTrade = (props) => {
  const { style, ...rest } = props;
  return (
    <TouchableOpacity {...rest}>
      <View style={[styled.container, style]}>
        <View style={[styled.extra, styled.extraTop]}>
          <Name {...props} />
        </View>
        <View style={styled.extra}>
          <Symbol {...props} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

TokenTrade.defaultProps = {
  style: null,
  showBalance: false,
  rightTopExtra: null,
  shouldShowFollowed: false,
};
TokenTrade.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  showBalance: PropTypes.bool,
  rightTopExtra: PropTypes.element,
  shouldShowFollowed: PropTypes.bool,
};

export default withToken(React.memo(TokenTrade));
