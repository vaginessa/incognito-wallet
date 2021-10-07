import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from '@components/core';
import { withLayout_2 } from '@src/components/Layout';
import { Row } from '@src/components';
import { TokenTrade } from '@src/components/Token';
import { BaseTextInputCustom } from '@src/components/core/BaseTextInput';
import { COLORS, FONT } from '@src/styles';
import { ListAllTokenSelectable } from './SelectToken';

const styled = StyleSheet.create({
  container: { flex: 1 },
  title: {
    color: COLORS.black,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    fontFamily: FONT.NAME.medium,
    marginBottom: 16,
  },
  input: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
  },
  subText: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.colorGrey3,
  },
  extra: {
    marginTop: 16,
  },
});

const SelectTokenModal = (props) => {
  const { data, onPress } = props;
  console.log(data);
  const onChange = (text) => {
    console.log('text', text);
  };
  if (!data) {
    return null;
  }
  return (
    <View style={styled.container}>
      <Text style={styled.title}>Select coins</Text>
      <BaseTextInputCustom
        inputProps={{
          onChangeText: onChange,
          placeholder: 'Search coins',
          style: styled.input,
        }}
      />
      <View style={styled.extra}>
        <Row>
          <Text style={styled.subText}>Name</Text>
        </Row>
        <ListAllTokenSelectable
          availableTokens={data}
          renderItem={({ item }) => (
            <TokenTrade onPress={() => onPress(item)} tokenId={item?.tokenId} />
          )}
        />
      </View>
    </View>
  );
};

SelectTokenModal.propTypes = {};

export default React.memo(SelectTokenModal);
