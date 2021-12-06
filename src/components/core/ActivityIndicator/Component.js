import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const StyledActivityIndicator = styled.ActivityIndicator`
  color: ${({ theme }) => theme.contrast}
`;
const ActivityIndicator = (props) => {
  const { size } = props;
  return <StyledActivityIndicator size={size} {...props} />;
};

ActivityIndicator.propTypes = {
  size: PropTypes.string,
};

ActivityIndicator.defaultProps = {
  size: 'small',
};

export default ActivityIndicator;
