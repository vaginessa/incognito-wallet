import React from 'react';
import { useSelector } from 'react-redux';
import { nftTokenDataSelector } from '@src/redux/selectors/account';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { ButtonBasic } from '@src/components/Button';

const NFTTokenBottomBar = () => {
  const navigation = useNavigation();
  const { initNFTToken, nftTokenAvailable, titleStr } = useSelector(
    nftTokenDataSelector,
  );
  const onNavMintNFTToken = () => navigation.navigate(routeNames.MintNFTToken);
  if (!initNFTToken || !nftTokenAvailable) {
    return (
      <ButtonBasic
        btnStyle={{
          marginVertical: 16,
        }}
        title={titleStr}
        onPress={onNavMintNFTToken}
      />
    );
  }
  return null;
};

NFTTokenBottomBar.propTypes = {};

export default React.memo(NFTTokenBottomBar);
