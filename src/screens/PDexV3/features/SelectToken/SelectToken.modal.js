import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@components/core';
import { Row, Header } from '@src/components';
import {
  handleFilterTokenByKeySearch,
  TokenTrade,
} from '@src/components/Token';
import { BaseTextInputCustom } from '@src/components/core/BaseTextInput';
import { COLORS, FONT } from '@src/styles';
import { withLayout_2 } from '@src/components/Layout';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { ListAllTokenSelectable } from './SelectToken';

const styled = StyleSheet.create({
  container: { flex: 1 },
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
    flex: 1,
  },
  header: {
    marginBottom: 10,
  },
});

const SelectTokenModal = (props) => {
  const data = useNavigationParam('data');
  const onPress = useNavigationParam('onPress');
  const { goBack } = useNavigation();
  const [text, setText] = React.useState(text);
  const [availableTokens, setAvailableTokens] = React.useState([]);
  const onChange = (text) => {
    setText(text);
    if (!text) {
      return setAvailableTokens(data);
    }
    const tokens = handleFilterTokenByKeySearch({
      tokens: data,
      keySearch: text,
    });
    setAvailableTokens(tokens);
  };
  React.useEffect(() => {
    setAvailableTokens(data);
    setText('');
  }, [data]);
  if (!data) {
    return null;
  }
  return (
    <View style={styled.container}>
      <Header title="Select coins" style={styled.header} />
      <BaseTextInputCustom
        inputProps={{
          onChangeText: onChange,
          placeholder: 'Search coins',
          style: styled.input,
          autFocus: true,
        }}
      />
      <View style={styled.extra}>
        <Row>
          <Text style={styled.subText}>Name</Text>
        </Row>
        <ListAllTokenSelectable
          availableTokens={availableTokens}
          renderItem={({ item }) => (
            <TokenTrade
              onPress={() => {
                if (typeof onPress === 'function') {
                  onPress(item);
                }
                goBack();
              }}
              tokenId={item?.tokenId}
            />
          )}
        />
      </View>
    </View>
  );
};

SelectTokenModal.propTypes = {};

export default withLayout_2(React.memo(SelectTokenModal));
