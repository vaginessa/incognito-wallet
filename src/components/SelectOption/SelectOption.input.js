import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';
import { SelectItem } from './SelectOption.modalSelectItem';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.colorGrey4,
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
});

const SelectOptionInput = (props) => {
  const { options, actived, ...rest } = props;
  return (
    <View style={styled.container}>
      <SelectItem {...actived} itemStyled={{ marginBottom: 0 }} {...rest} />
    </View>
  );
};

SelectOptionInput.propTypes = {
  actived: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
};

export default React.memo(SelectOptionInput);
