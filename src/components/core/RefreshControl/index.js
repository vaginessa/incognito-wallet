import styled from 'styled-components/native';
import React from 'react';

const StyledRefreshControl = styled.RefreshControl`
  tint-color:${({ theme }) => theme.contrast};
`;
const RefreshControl = (props) => {
  return (
    <StyledRefreshControl
      {...props}
    />
  );
};

export default RefreshControl;
