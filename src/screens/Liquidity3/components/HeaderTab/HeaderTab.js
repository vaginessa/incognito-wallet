import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import styled from '@screens/Liquidity3/components/HeaderTab/HeaderTab.styled';

const HeaderTab = ({ tabs, selected, wrapperStyle }) => {
  const renderItem = (item) => {
    const isSelected = selected === item;
    return(
      <TouchableOpacity
        key={item}
        style={[styled.wrapItem, isSelected && styled.itemSelected]}
      >
        <Text style={[isSelected ? styled.textSelected : styled.textUnSelected]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styled.wrapper, wrapperStyle]}>
      {Object.keys(tabs).map(renderItem)}
    </View>
  );
};

HeaderTab.defaultProps = {
  tabs: {},
  wrapperStyle: null
};

HeaderTab.propTypes = {
  selected: PropTypes.string.isRequired,
  tabs: PropTypes.object,
  wrapperStyle: PropTypes.object
};


export default memo(HeaderTab);
