import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';
import { ScrollView, Text, TouchableOpacity } from '@src/components/core';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import Row from '@src/components/Row';
import PropTypes from 'prop-types';
import { FONT } from '@src/styles';

const styled = StyleSheet.create({
  touchWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginBottom: 30,
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
    paddingTop: 16,
  },
});

export const SelectItem = React.memo(
  ({ id, title, desc, icon, onPressItem, itemStyled }) => {
    const navigation = useNavigation();
    const _onSelectItem = useNavigationParam('onSelectItem');
    return (
      <TouchableOpacity
        onPress={() => {
          if (typeof onPressItem === 'function') {
            // from props
            onPressItem(id);
            navigation.goBack();
            return;
          }
          if (typeof _onSelectItem === 'function') {
            _onSelectItem(id);
          }
        }}
        style={styled.touchWrapper}
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

SelectItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  srcIcon: PropTypes.any,
  onPressItem: PropTypes.func.isRequired,
};

const SelectOptionModal = () => {
  const options = useNavigationParam('options');
  return (
    <View style={styled.container}>
      <Header title="Switch platform" />
      <ScrollView style={styled.scrollview}>
        {options.map((option) => (
          <SelectItem key={option?.id} {...option} />
        ))}
      </ScrollView>
    </View>
  );
};

SelectOptionModal.propTypes = {};

export default withLayout_2(React.memo(SelectOptionModal));
