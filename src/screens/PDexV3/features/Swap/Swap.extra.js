/* eslint-disable react-native/no-unused-styles */
import { Row } from '@src/components';
import { Text } from '@src/components/core';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BtnQuestionDefault } from '@src/components/Button';
import srcQuestionIcon from '@src/assets/images/icons/help-inline.png';

export const styled = StyleSheet.create({
  container: {},
  titleContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    marginRight: 10,
  },
  hook: {
    marginBottom: 15,
  },
  labelContainer: {
    flex: 1,
    maxWidth: '48%',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.newGrey,
    marginRight: 5,
  },
  value: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.newGrey,
    flex: 1,
    textAlign: 'right',
  },
  boldLabel: {
    color: COLORS.black,
    fontFamily: FONT.NAME.bold,
  },
  hookCustomStyleBtnQuestion: {
    width: 14,
    height: 14,
  },
  orangeValue: {
    color: COLORS.orange,
  },
});

export const Hook = React.memo((props) => {
  const {
    label,
    value,
    boldLabel,
    hasQuestionIcon,
    onPressQuestionIcon,
    customValue,
  } = props;
  return (
    <Row style={styled.hook}>
      <Row style={styled.labelContainer}>
        <Text
          style={[styled.label, boldLabel && styled.boldLabel]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
        {hasQuestionIcon && (
          <BtnQuestionDefault
            icon={srcQuestionIcon}
            onPress={onPressQuestionIcon}
            customStyle={styled.hookCustomStyleBtnQuestion}
          />
        )}
      </Row>
      {customValue ? (
        customValue
      ) : (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styled.value}>
          {value}
        </Text>
      )}
    </Row>
  );
});

const Extra = (props) => {
  const { title, hooks, hasQuestionIcon, onPressQuestionIcon } = props;
  return (
    <View style={styled.container}>
      {title && (
        <Row style={styled.titleContainer}>
          <Text style={styled.title}>{title}</Text>
          {hasQuestionIcon && (
            <BtnQuestionDefault
              icon={srcQuestionIcon}
              onPress={onPressQuestionIcon}
            />
          )}
        </Row>
      )}
      {hooks}
    </View>
  );
};

Hook.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  boldLabel: PropTypes.bool,
  hasQuestionIcon: PropTypes.bool,
  onPressQuestionIcon: PropTypes.func,
  customValue: PropTypes.any,
};

Extra.propTypes = {
  title: PropTypes.string,
  hooks: PropTypes.any,
};

export default React.memo(Extra);
