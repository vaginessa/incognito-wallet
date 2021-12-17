import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from '@components/core';
import PropTypes from 'prop-types';
import { ButtonTyni } from '@src/components/Button';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: COLORS.colorGrey5,
    borderRadius: 10,
  },
  header: { alignItems: 'center' },
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black,
    marginBottom: 2,
  },
  headerSub: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    color: COLORS.lightGrey36,
  },
  groupActions: {
    marginVertical: 16,
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    color: COLORS.black,
  }
});

const PrivacyAppItem = (props) => {
  const {
    privacyAppId,
    icon,
    headerTitle,
    headerSub,
    groupActions,
    desc,
    onPressItem,
  } = props;
  return (
    <TouchableOpacity
      style={styled.container}
      onPress={() => onPressItem(privacyAppId)}
    >
      <Row style={styled.header}>
        <View style={styled.icon}>{icon}</View>
        <View style={styled.headerHook}>
          <Text style={styled.headerTitle}>{headerTitle}</Text>
          <Text style={styled.headerSub}>{headerSub}</Text>
        </View>
      </Row>
      <Row style={styled.groupActions}>
        {groupActions.map(({ id, ...rest }, index) => (
          <ButtonTyni
            key={id}
            {...rest}
            style={index !== 0 ? { marginLeft: 8 } : {}}
          />
        ))}
      </Row>
      <Text style={styled.desc}>{desc}</Text>
    </TouchableOpacity>
  );
};

PrivacyAppItem.propTypes = {
  privacyAppId: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  headerTitle: PropTypes.string.isRequired,
  headerSub: PropTypes.string.isRequired,
  groupActions: PropTypes.array.isRequired,
  desc: PropTypes.string.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

export default React.memo(PrivacyAppItem);
