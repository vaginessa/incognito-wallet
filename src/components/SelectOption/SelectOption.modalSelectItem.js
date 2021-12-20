import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, Text, TouchableOpacity } from '@src/components/core';
import Row from '@src/components/Row';
import PropTypes from 'prop-types';
import { FONT } from '@src/styles';
import ModalBottomSheet from '@src/components/Modal/features/ModalBottomSheet';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';

const styled = StyleSheet.create({
  touchWrapper: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: FONT.SIZE.regular,
    fontFamily: FONT.NAME.medium,
    marginLeft: 10,
    flex: 1,
  },
  desc: {
    fontSize: FONT.SIZE.regular,
    fontFamily: FONT.NAME.regular,
    width: '100%',
    textAlign: 'right',
  },
  left: {
    maxWidth: 120,
  },
  right: {
    flex: 1,
    marginLeft: 15,
  },
  scrollview: {
    flex: 1,
    paddingHorizontal: 0,
  },
});

export const SelectItem = React.memo(
  ({ id, title, desc, icon, onPressItem, itemStyled, isSelectItem }) => {
    const colors = useSelector(colorsSelector);
    return (
      <TouchableOpacity
        onPress={() => {
          if (typeof onPressItem === 'function') {
            // from props
            onPressItem(id);
          }
        }}
        style={[
          styled.touchWrapper,
          isSelectItem
            ? {
              backgroundColor: 'transparent',
              padding: 0,
              marginBottom: 30,
              borderRadius: 0,
            }
            : {
              backgroundColor: colors.grey5,
            },
        ]}
      >
        <Row style={[styled.item, itemStyled]}>
          <Row style={styled.left}>
            {icon && icon}
            <Text style={styled.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </Row>
          <View style={styled.right}>
            <Text style={styled.desc} numberOfLines={1} ellipsizeMode="tail">
              {desc}
            </Text>
          </View>
        </Row>
      </TouchableOpacity>
    );
  },
);

SelectItem.defaultProps = {
  isSelectItem: true,
};

SelectItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  srcIcon: PropTypes.any,
  onPressItem: PropTypes.func.isRequired,
  isSelectItem: PropTypes.bool,
};

const SelectOptionModal = ({ options }) => {
  return (
    <ModalBottomSheet
      style={{ height: '30%', minHeight: 300 }}
      customContent={(
        <ScrollView style={styled.scrollview}>
          {options.map((option) => (
            <SelectItem key={option?.id} {...option} />
          ))}
        </ScrollView>
      )}
    />
  );
};

SelectOptionModal.propTypes = {};

export default React.memo(SelectOptionModal);
