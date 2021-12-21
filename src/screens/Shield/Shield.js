import React from 'react';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import PropTypes from 'prop-types';
import {ListAllToken, TokenFollow} from '@src/components/Token';
import { View } from '@components/core';
import { styled } from './Shield.styled';
import withShield from './Shield.enhance';

const Shield = (props) => {
  const { handleShield, handleWhyShield, hideBackButton, ...rest } = props;
  return (
    <>
      <Header
        title="Search coins"
        canSearch
        hideBackButton={hideBackButton}
        rightHeader={<BtnQuestionDefault style={{ marginLeft: 8 }} onPress={handleWhyShield} customStyle={{ height: 24, width: 24 }} />}
      />
      <View borderTop style={styled.container}>
        <ListAllToken
          {...rest}
          renderItem={({ item }) => (
            <TokenFollow
              item={item}
              key={item.tokenId}
              hideStar
              externalSymbol
              onPress={() => handleShield(item)}
            />
          )}
        />
      </View>
    </>
  );
};

Shield.defaultProps = {
  hideBackButton: false
};

Shield.propTypes = {
  handleWhyShield: PropTypes.func.isRequired,
  handleShield: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
  hideBackButton: PropTypes.bool
};

export default withShield(Shield);
