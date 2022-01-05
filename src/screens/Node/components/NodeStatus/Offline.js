import { View } from '@components/core';
import { Text4 } from '@components/core/Text';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './style';

const Offline = ({ isVNode, ip }) => {
  if (isVNode) {
    return (
      <View style={styles.container}>
        <Text4 style={styles.desc}>{`1. Make sure your VPS at IP ${ip} is running`}</Text4>
        <Text4 style={styles.desc}>{'2. SSH into your VPS and enter this command “sudo docker ps” to check if “inc_mainnet” and “eth_mainnet” no longer needed. And run.sh no longer used. If you don’t see any of them, restart the Node with this command “sudo bash run.sh”. \n\nIf this issue persists, reach out to us at go@incognito.org'}</Text4>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text4 style={styles.desc}>1. Make sure the blue light is on</Text4>
      <Text4 style={styles.desc}>2. Make sure that your home Wi-Fi is connected</Text4>
      <Text4 style={styles.desc}>3. Power cycle the Node and wait a few minutes</Text4>
      <Text4 style={styles.desc}>{'\nIf this issue persists, reach out to us at go@incognito.org'}</Text4>
    </View>
  );
};

Offline.propTypes = {
  isVNode: PropTypes.bool.isRequired,
  ip: PropTypes.string.isRequired,
};

export default React.memo(Offline);

