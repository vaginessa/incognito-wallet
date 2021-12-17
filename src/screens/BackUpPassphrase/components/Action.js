import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { THEME } from '@src/styles';
import { Text, TouchableOpacity } from '@components/core';
import { Text4 } from '@components/core/Text';

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  label: {
    ...THEME.text.boldTextStyleSuperMedium
  },
  desc: {
    marginTop: 5,
    ...THEME.text.mediumTextMotto,
  },
});


const Action = ({ label, desc, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text4 style={styles.desc}>{desc}</Text4>
    </TouchableOpacity>
  );
};

Action.propTypes = {
  label: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Action;
