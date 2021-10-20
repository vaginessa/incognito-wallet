import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Row} from '@src/components';
import styled from '@components/RowSpaceText/RowSpaceText.styled';
import {Text} from '@components/core';
import {ActivityIndicator, View} from 'react-native';

const RowSpaceText = (props) => {
  const { label, value, loading, style, leftStyle, rightStyle, customLeft, customRight } = props;
  return (
    <Row style={[styled.hookContainer, style]}>
      {customLeft ? customLeft : (
        <Text style={[styled.hookLabel, leftStyle]}>{`${label}:`}</Text>
      )}
      <View style={styled.wrapValue}>
        {
          loading ? (
            <ActivityIndicator size="small" />
          ) : (
            customRight ? customRight : (<Text style={[styled.hookValue, rightStyle]} numberOfLines={0}>{value}</Text>)
          )
        }
      </View>
    </Row>
  );
};

RowSpaceText.defaultProps = {
  loading: false,
  style: undefined,
  leftStyle: undefined,
  rightStyle: undefined,
  customLeft: undefined,
  customRight: undefined
};
RowSpaceText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  style: PropTypes.object,
  leftStyle: PropTypes.any,
  rightStyle: PropTypes.any,
  customLeft: PropTypes.any,
  customRight: PropTypes.any,
};


export default memo(RowSpaceText);
