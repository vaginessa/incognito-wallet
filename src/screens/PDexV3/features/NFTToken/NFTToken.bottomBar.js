import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BottomBar } from '@src/components/core';
import { useSelector } from 'react-redux';
import { nftTokenDataSelector } from '@src/redux/selectors/account';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';

const NFTTokenBottomBar = (props) => {
  const navigation = useNavigation();
  const { initNFTToken } = useSelector(nftTokenDataSelector);
  const onNavMintNFTToken = () => navigation.navigate(routeNames.MintNFTToken);
  if (!initNFTToken) {
    return (
      <BottomBar
        text="Mint a nft token to access all features"
        onPress={onNavMintNFTToken}
      />
    );
  }
  return null;
};

NFTTokenBottomBar.propTypes = {};

export default React.memo(NFTTokenBottomBar);
