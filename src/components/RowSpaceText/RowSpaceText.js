import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Row} from '@src/components';
import styled from '@components/RowSpaceText/RowSpaceText.styled';
import {Text} from '@components/core';
import {ActivityIndicator} from 'react-native';

const RowSpaceText = (props) => {
  const { label, value, loading, style } = props;
  return (
    <Row style={[styled.hookContainer, style]}>
      <Text style={styled.hookLabel}>{`${label}:`}</Text>
      <Row>
        {
          loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styled.hookValue}>{value}</Text>
          )
        }
      </Row>
    </Row>
  );
};

RowSpaceText.defaultProps = {
  loading: false,
  style: undefined,
};
RowSpaceText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  style: PropTypes.object,
};


export default memo(RowSpaceText);
