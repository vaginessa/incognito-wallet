import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Header from '@src/components/Header';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import { RoundCornerButton, ScrollViewBorder, Text } from '@components/core';
import ic_radio from '@src/assets/images/icons/ic_radio.png';
import ic_radio_check from '@src/assets/images/icons/ic_radio_check.png';
import withBridgeConnect from '@src/screens/Wallet/features/BridgeConnect/WalletConnect.enhance';
import { ExHandler } from '@services/exception';
import { compose } from 'recompose';

const TermOfUseShield = (props) => {
  const { onNextPress, handleConnect, onSelected, selectedTerm, handleShield, selectedPrivacy } = props;
  const [isPressed, setIsPressed] = React.useState(false);
  const terms = [
    'Generate a deposit address',
    `Connect your ${selectedPrivacy?.rootNetworkName} wallet`
  ];

  const handlePressNext = () => {
    if (!isPressed) {
      setIsPressed(true);
      setTimeout(
        () => {setIsPressed(false);},
        500
      );
      if (typeof onNextPress === 'function') {
        // selected shield decentralize
        if (selectedTerm === (terms.length - 1)) {
          if (typeof handleConnect === 'function') {
            ( async () =>{
              try {
                const isConnected = await handleConnect();
                if (!isConnected) {
                  new ExHandler(null, 'WalletConnect connection rejected').showErrorToast();
                  return;
                }
              } catch (e) {
                new ExHandler(e).showErrorToast();
                return;
              }
              onNextPress();
            })();
          }
        } else {
          handleShield();
          onNextPress();
        }
      }
    }
  };

  const handlePress = (index) => {
    onSelected(index);
  };

  return (
    <>
      <Header title="Deposit" />
      <ScrollViewBorder style={styled.scrollview}>
        <Text style={[styled.text, { marginBottom: 22 }]}>
          {`To anonymize your coins, you'll need to send funds to Incognito. You can simply generate a deposit address, or connect directly with the bridge smart contract using your ${selectedPrivacy?.rootNetworkName} wallet.`}
        </Text>
        {terms && terms.map((item, index) => {
          return (
            <TouchableOpacity
              style={index === selectedTerm ? styled.selectedButton : styled.unSelectedButon}
              key={`key-${index}`}
              onPress={() => handlePress(index)}
            >
              <View style={styled.contentView}>
                <Image style={styled.icon} source={index === selectedTerm ? ic_radio_check : ic_radio} />
                <Text style={[styled.text, { marginRight: 20, color: index === selectedTerm ? COLORS.black : COLORS.colorGreyBold }]}>{item}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <RoundCornerButton
          style={styled.button}
          title={`${selectedTerm !== (terms.length - 1) ? 'Next' : 'Launch my wallet'}`}
          disabled={isPressed || selectedTerm === undefined}
          onPress={handlePressNext}
        />
        {selectedTerm === (terms.length - 1) && (
          <Text style={styled.warningText}>Your wallet will launch and prompt you to approve the connection. Simply follow the instructions to complete the deposit process.</Text>
        )}
      </ScrollViewBorder>
    </>
  );
};

TermOfUseShield.propTypes = {
  onNextPress: PropTypes.func.isRequired,
  handleConnect: PropTypes.func.isRequired,
  onSelected: PropTypes.func.isRequired,
  selectedTerm: PropTypes.array.isRequired,
  handleShield: PropTypes.func.isRequired,
};

export default compose(
  withBridgeConnect,
)(TermOfUseShield);

const styled = StyleSheet.create({
  scrollview: {
  },
  text: {
    fontFamily: FONT.NAME.specialMedium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.medium + 4,
  },
  icon: {
    marginTop: 2,
    marginRight: 8,
  },
  contentView: {
    flexDirection: 'row',
  },
  selectedButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 0,
    marginBottom: 16,
    backgroundColor: '#EFEFEF',
  },
  unSelectedButon: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.colorGreyLight,
    marginBottom: 16
  },
  button: {
    marginTop: 30,
  },
  warningText: {
    ...FONT.STYLE.medium,
    textAlign: 'center',
    marginTop: 30,
    fontSize: FONT.SIZE.agvSmall,
    lineHeight: FONT.SIZE.medium + 4,
    color: COLORS.green5,
  },
});
