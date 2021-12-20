import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableOpacity, Text3 } from '@components/core';
import PropTypes from 'prop-types';
import { ButtonTyni } from '@src/components/Button';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
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
    marginBottom: 2,
  },
  headerSub: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    // color: COLORS.lightGrey36,
  },
  groupActions: {
    marginVertical: 16,
    backgroundColor: 'transparent'
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    // color: COLORS.black,
  }
});

const CustomTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.background3};
  padding: 24px;
  border-radius: 10px;
`;

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
    <CustomTouchableOpacity
      style={styles.container}
      onPress={() => onPressItem(privacyAppId)}
    >
      <Row style={styles.header}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.headerHook}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <Text3 style={styles.headerSub}>{headerSub}</Text3>
        </View>
      </Row>
      <Row style={styles.groupActions}>
        {groupActions.map(({ id, ...rest }, index) => (
          <ButtonTyni
            key={id}
            {...rest}
            style={index !== 0 ? { marginLeft: 8 } : {}}
          />
        ))}
      </Row>
      <Text style={styles.desc}>{desc}</Text>
    </CustomTouchableOpacity>
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
