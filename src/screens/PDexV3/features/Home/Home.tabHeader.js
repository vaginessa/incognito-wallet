import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';

export const styled = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    textAlign: 'center',
  },
  desc: {
    color: COLORS.black,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superLarge,
    lineHeight: FONT.SIZE.superLarge + 5,
    textAlign: 'center',
    marginTop: 10,
  },
});

const HomeTabHeader = (props) => {
  const { title, desc } = props;
  return (
    <View style={styled.container}>
      <Text style={styled.title}>{title}</Text>
      <Text style={styled.desc}>{desc}</Text>
    </View>
  );
};

HomeTabHeader.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default React.memo(HomeTabHeader);
