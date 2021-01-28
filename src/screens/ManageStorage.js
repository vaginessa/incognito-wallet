import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import _ from 'lodash';
import MainLayout from '@components/MainLayout';
import { Text, TouchableOpacity, RoundCornerButton } from '@components/core';
import { THEME } from '@src/styles';
import AsyncStorage from '@react-native-community/async-storage';
import Row from '@components/Row';
import clipboard from '@services/clipboard';
import Storage from '@services/storage';

const styles = StyleSheet.create({
  item: {
    ...THEME.text.mediumTextStyle,
    marginBottom: 20,
  },
});

const ManageStorage = () => {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const newItems = [];
    for (const key of keys) {
      const data = await AsyncStorage.getItem(key);
      newItems.push({
        key,
        data: data?.length,
        rawData: data,
      });
    }

    setItems(_.orderBy(newItems, item => item.data, 'desc'));
  };

  const handleRemove = (key) => {
    AsyncStorage.removeItem(key);

    const newItems = _.remove(items, item => item.key !== key);
    setItems(newItems);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSpamData = async () => {
    const randomKey = 'SPAM';
    const randomData = new Array(5e5).fill('1').join('');

    let spamData = await Storage.getItem(randomKey);

    if (!spamData) {
      spamData = '';
    }

    spamData += randomData;

    await Storage.setItem(randomKey, spamData);
    await loadItems();
  };

  return (
    <MainLayout header="Manage storage" scrollable>
      <RoundCornerButton title="Spam data" onPress={handleSpamData} />
      {items.map(item => (
        <Row spaceBetween center style={styles.item} key={item.key}>
          <Text style={{ width: 200 }}>{item.key} ({item.data})</Text>
          <Row>
            <TouchableOpacity onPress={() => handleRemove(item.key)} style={{ marginRight: 20 }}>
              <Text>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => clipboard.set(JSON.stringify(item.rawData), { copiedMessage: `${item.key} copied.` })}>
              <Text>Copy</Text>
            </TouchableOpacity>
          </Row>
        </Row>
      ))}
    </MainLayout>
  );
};

export default ManageStorage;
