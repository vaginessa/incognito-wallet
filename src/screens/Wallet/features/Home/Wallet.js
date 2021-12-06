import React from 'react';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';
import Extra from '@screens/Wallet/features/Home/Wallet.extra';
import Followed from '@screens/Wallet/features/Home/Wallet.followed';
import AddToken from '@screens/Wallet/features/Home/Wallet.addToken';
import withNews from '@screens/News/News.enhance';
import { compose } from 'recompose';

const Wallet = React.memo(() => {
  return (
    <>
      <Extra />
      <Followed />
      <AddToken />
    </>
  );
});

export default compose(
  withWallet,
  withNews
)(Wallet);
