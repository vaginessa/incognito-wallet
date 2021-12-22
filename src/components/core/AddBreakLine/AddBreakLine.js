import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

export const styles = StyleSheet.create({
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8
  },
});

const Divider = styled.View`
  background-color: ${({ theme }) => theme.border1};
  width: 100%;
  height: 1px;
`;

const AddBreakLine = ({ style }) => {
  return (
    <View style={[styles.arrowWrapper, style]}>
      <Divider style={styles.divider} />
    </View>
  );
};

AddBreakLine.defaultProps = {
  style: undefined
};

AddBreakLine.propTypes = {
  style: PropTypes.any,
};

export default memo(AddBreakLine);
