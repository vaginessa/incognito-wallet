import React, { memo } from 'react';
import PropTypes from 'prop-types';
import SelectDropdown from 'react-native-select-dropdown';
import { headerStyled } from '@screens/MainTabBar/features/Market/Market.styled';
import { Header, Row } from '@src/components';
import { ArrowDownLine } from '@components/Icons/icon.arrowDown';
import { SearchIcon, StarIcon } from '@components/Icons';
import {COLORS} from '@src/styles';
import {useDispatch, useSelector} from 'react-redux';
import {actionToggleMarketTab, marketTabSelector} from '@screens/Setting';
import styled from 'styled-components/native';
import globalStyled from '@src/theme/theme.styled';
import { Text, TouchableOpacity, View } from '@components/core';
import { colorsSelector } from '@src/theme/theme.selector';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';

const headers = [
  { name: 'Gainers', filterField: 'change', orderField: 'desc' },
  { name: 'Losers', filterField: 'change', orderField: 'asc' },
];

export const MarketTabs = {
  ALL: 'all',
  FAVORITE: 'favorite'
};

const StyledTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.btnBG2};
`;

const HeaderView = ({ onFilter }) => {
  const dispatch = useDispatch();
  const colors = useSelector(colorsSelector);
  const activeTab = useSelector(marketTabSelector);
  const navigation = useNavigation();
  const onChangeTab = (tab) => {
    dispatch(actionToggleMarketTab(tab));
  };

  return (
    <>
      <Header
        title="Privacy Markets"
        titleStyled={headerStyled.title}
        hideBackButton
        rightHeader={(
          <TouchableOpacity style={{ width: 40, alignItems: 'flex-end' }} onPress={() => navigation.navigate(routeNames.MarketSearchCoins)}>
            <SearchIcon color={COLORS.lightGrey36} />
          </TouchableOpacity>
        )}
      />
      <View borderTop>
        <Row
          centerVertical
          spaceBetween
          style={[headerStyled.wrapFilter, globalStyled.defaultPaddingHorizontal, globalStyled.defaultBorderSection]}
        >
          <Row centerVertical>
            <StyledTouchableOpacity style={headerStyled.wrapTab} onPress={() => onChangeTab(MarketTabs.ALL)}>
              <Text style={[headerStyled.tabText, activeTab === MarketTabs.ALL && { color: COLORS.blue5 }]}>All</Text>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity style={headerStyled.wrapTab} onPress={() => onChangeTab(MarketTabs.FAVORITE)}>
              <StarIcon isBlue={activeTab === MarketTabs.FAVORITE} />
            </StyledTouchableOpacity>
          </Row>
          <SelectDropdown
            data={headers}
            defaultValueByIndex={0}
            dropdownStyle={[headerStyled.dropdownStyle, { backgroundColor: colors.btnBG2 }]}
            onSelect={(selectedItem) => {
              onFilter && onFilter({ filterField: selectedItem.filterField, orderField: selectedItem.orderField });
            }}
            buttonTextAfterSelection={(selectedItem) => selectedItem.name}
            rowTextForSelection={(item) => item.name}
            rowTextStyle={[headerStyled.rowTextStyle, { color: colors.text1 }]}
            rowStyle={[{ backgroundColor: colors.btnBG2, borderBottomWidth: 0.5, borderBottomColor: colors.border4 }]}
            buttonStyle={[headerStyled.buttonStyle, { backgroundColor: colors.btnBG2 }]}
            buttonTextStyle={[headerStyled.buttonTextStyle, { color: colors.text1 }]}
            renderDropdownIcon={() => {
              return (
                <ArrowDownLine />
              );
            }}
          />
        </Row>
      </View>
    </>
  );
};

HeaderView.propTypes = {
  onFilter: PropTypes.func.isRequired,
};


export default memo(HeaderView);
