import React from 'react';
import { StyleSheet } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import { ScrollViewBorder } from '@components/core';
import { PancakeIcon2 } from '@src/components/Icons';
import { FONT } from '@src/styles';
import { KEYS_PLATFORMS_SUPPORTED } from '@screens/PDexV3/features/Swap';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import Header from '@src/components/Header';
import PrivacyAppsItem from './PrivacyApps.item';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});

const PrivacyApps = (props) => {
  const navigation = useNavigation();
  const onPressItem = (id) => {
    switch (id) {
    case KEYS_PLATFORMS_SUPPORTED.pancake:
      navigation.navigate(routeNames.PrivacyAppsPancake);
      break;
    default:
      break;
    }
  };
  const factories = React.useMemo(() => {
    return [
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.pancake,
        icon: <PancakeIcon2 />,
        headerTitle: 'pPancake',
        headerSub: 'Private pancake',
        groupActions: [
          {
            id: 'BSC',
            title: 'BSC',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard.',
        onPressItem,
      },
    ];
  }, []);
  return (
    <>
      <Header
        title="Privacy apps"
        titleStyled={[{ ...FONT.TEXT.incognitoH4 }]}
        hideBackButton
      />
      <ScrollViewBorder style={styled.scrollview}>
        {factories.map((item) => (
          <PrivacyAppsItem key={item.id} {...item} />
        ))}
      </ScrollViewBorder>
    </>
  );
};

PrivacyApps.propTypes = {};

export default withLayout_2(React.memo(PrivacyApps));
