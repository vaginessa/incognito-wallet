import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Row} from '@src/components';
import styled from '@components/RowSpaceText/RowSpaceText.styled';
import {Text} from '@components/core';

const RowSpaceText = (props) => {
  const { label, value } = props;
  return (
    <Row style={styled.hookContainer}>
      <Text style={styled.hookLabel}>{`${label}:`}</Text>
      <Row style={[styled.hookContainer, { marginBottom: 0 }]}>
        <Text style={styled.hookValue}>{value}</Text>
      </Row>
    </Row>
  );
};

RowSpaceText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};


export default memo(RowSpaceText);
