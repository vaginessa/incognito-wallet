import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled.View`
  border-bottom-color: ${({ theme }) => theme.border1};
  border-bottom-width: 1;
  padding-vertical: 16;
`;

const ViewWithBorderBottom1 = (props) => {
  const { style, fullFlex, ...rest } = props;
  return (
    <Container {...rest} style={[style, fullFlex && { flex: 1 }]} />
  );
};

ViewWithBorderBottom1.defaultProps = {
  style: null,
  fullFlex: false
};

ViewWithBorderBottom1.propTypes = {
  style: PropTypes.object,
  fullFlex: PropTypes.bool
};

export default ViewWithBorderBottom1;
