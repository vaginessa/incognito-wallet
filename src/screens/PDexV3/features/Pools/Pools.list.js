import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAwareScrollView,
  Text,
} from '@src/components/core';
import { BaseTextInputCustom } from '@src/components/core/BaseTextInput';
import { FONT, COLORS } from '@src/styles';
import { StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Row } from '@src/components';
import Pool from '@screens/PDexV3/features/Pool';
import PropTypes from 'prop-types';
import { isFetchingSelector, listPoolsSelector } from './Pools.selector';
import { actionFetchPools } from './Pools.actions';
import { handleFilterPoolByKeySeach } from './Pools.utils';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: FONT.SIZE.small,
    color: COLORS.colorGrey3,
    fontFamily: FONT.NAME.medium,
  },
});

const HEADER_FACTORIES = [
  {
    text: '#Name / Vol',
    style: {
      flex: 0.7,
      marginRight: 15,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  {
    text: '#APY',
    style: {
      flex: 0.2,
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginRight: 5,
      textAlign: 'right',
    },
  },
  {
    text: ' ',
    style: {
      flex: 0.1,
    },
  },
];

export const PoolsListHeader = React.memo(() => {
  return (
    <Row style={{ marginVertical: 24 }}>
      {HEADER_FACTORIES.map((item) => (
        <Text key={item.text} style={{ ...styled.headerText, ...item.style }}>
          {item.text}
        </Text>
      ))}
    </Row>
  );
});

export const PoolsList = React.memo(({ onPressPool, pools }) => {
  const isFetching = useSelector(isFetchingSelector);
  return (
    <KeyboardAwareScrollView>
      {isFetching && <ActivityIndicator />}
      <FlatList
        data={pools}
        renderItem={({ item }) => (
          <Pool
            poolId={item.poolId}
            onPressPool={() => onPressPool(item.poolId)}
          />
        )}
        keyExtractor={({ poolId }) => poolId}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAwareScrollView>
  );
});

const PoolsListContainer = (props) => {
  const { onPressPool } = props;
  const dispatch = useDispatch();
  const [text, setText] = React.useState(text);
  const [pools, setPools] = React.useState([]);
  const listPools = useSelector(listPoolsSelector);
  const onChange = (text) => {
    setText(text);
    if (!text) {
      return setPools(listPools);
    }
    const tokens = handleFilterPoolByKeySeach({
      data: listPools,
      keySearch: text,
    });
    setPools(tokens);
  };
  React.useEffect(() => {
    setPools(listPools);
    setText('');
  }, [listPools]);
  React.useEffect(() => {
    dispatch(actionFetchPools());
  }, []);
  return (
    <View style={styled.container}>
      <BaseTextInputCustom
        inputProps={{
          onChangeText: onChange,
          placeholder: 'Search coins',
          style: styled.input,
          autFocus: true,
        }}
      />
      <PoolsListHeader />
      <PoolsList onPressPool={onPressPool} pools={pools} />
    </View>
  );
};

PoolsList.propTypes = {
  onPressPool: PropTypes.func.isRequired,
};

export default React.memo(PoolsListContainer);
