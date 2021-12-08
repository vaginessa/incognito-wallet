import React from 'react';
import { StyleSheet, Text, Clipboard } from 'react-native';
import { ButtonBasic } from '@src/components/Button';
import { View } from '@src/components/core';
import { View3 } from '@src/components/core/View';
import { Text4 } from '@src/components/core/Text';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: COLORS.colorGrey,
  },
  text: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    // color: COLORS.colorGreyBold,
    marginHorizontal: 15,
  },
  btnStyle: {
    height: 40,
    paddingHorizontal: 20,
    maxWidth: 100
  },
  titleStyle: {
    fontSize: FONT.SIZE.regular - 1,
  },
});

const CopiableText = props => {
  const { data, textStyle } = props;
  const [copied, setCopied] = React.useState(false);
  const handleCopyText = () => {
    Clipboard.setString(data);
    setCopied(true);
  };
  return (
    <View3 style={styled.container}>
      <Text4 style={[styled.text, textStyle]} numberOfLines={1} ellipsizeMode="middle">
        {data}
      </Text4>
      <ButtonBasic
        btnStyle={styled.btnStyle}
        titleStyle={styled.titleStyle}
        title={copied ? 'Copied' : 'Copy'}
        onPress={handleCopyText}
      />
    </View3>
  );
};

CopiableText.defaultProps = {
  textStyle: undefined
};

CopiableText.propTypes = {
  data: PropTypes.string.isRequired,
  textStyle: PropTypes.any
};

export default CopiableText;
