import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import { Row } from '@src/components';
import { ArrowFillIcon } from '@components/Icons';

const styled = StyleSheet.create({
  title: {
    ...FONT.STYLE.medium,
    color: COLORS.black,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 10,
    marginRight: 4,
  },
  group: {
    marginTop: 24
  },
  wrapArrow: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  child: {
    marginTop: 16
  }
});

const GroupItem = ({ name, child }) => {
  const [expand, setExpand] = useState(true);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <View>
      <TouchableOpacity style={styled.group} onPress={toggleExpand}>
        <Row centerVertical>
          <Text style={styled.title}>{name}</Text>
          <View style={styled.wrapArrow}>
            <ArrowFillIcon position={expand ? 'DOWN' : 'UP'} />
          </View>
        </Row>
      </TouchableOpacity>
      {expand && (
        <View style={styled.child}>
          {child}
        </View>
      )}
    </View>
  );
};

GroupItem.propTypes = {
  name: PropTypes.string.isRequired,
  child: PropTypes.any.isRequired,
};

export default GroupItem;
