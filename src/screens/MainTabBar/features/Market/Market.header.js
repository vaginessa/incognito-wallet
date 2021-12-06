import React, { memo } from 'react';
import PropTypes from 'prop-types';
import SelectDropdown from 'react-native-select-dropdown';
import { headerStyled } from '@screens/MainTabBar/features/Market/Market.styled';
import { Row } from '@src/components';
import {ArrowDownLine} from '@components/Icons/icon.arrowDown';
import SearchBox from '@components/Header/Header.searchBox';
import { View } from 'react-native';
import {StarIcon} from '@components/Icons';
import {COLORS} from '@src/styles';
import {useDispatch, useSelector} from 'react-redux';
import {actionToggleMarketTab, marketTabSelector} from '@screens/Setting';
import styled from 'styled-components/native';
import globalStyled from '@src/theme/theme.styled';
import { Text, TouchableOpacity } from '@components/core';

const headers = [
  { name: 'Gainers', filterField: 'change', orderField: 'desc' },
  { name: 'Losers', filterField: 'change', orderField: 'asc' },
];

export const MarketTabs = {
  ALL: 'all',
  FAVORITE: 'favorite'
};

const StyledHeader = styled(Row)`
  background-color: ${({ theme }) => theme.background2};
`;

const StyledTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.btnBG2};
`;

const Header = ({ onFilter }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(marketTabSelector);
  const onChangeTab = (tab) => {
    dispatch(actionToggleMarketTab(tab));
  };

  return (
    <View>
      <StyledHeader spaceBetween style={[headerStyled.wrapSearch, globalStyled.defaultPadding]}>
        <SearchBox
          customSearchBox
          style={headerStyled.wrapInput}
          inputProps={{
            style: headerStyled.input
          }}
        />
      </StyledHeader>
      <Row
        centerVertical
        spaceBetween
        style={[headerStyled.wrapFilter, globalStyled.defaultPadding, globalStyled.defaultBorderSection]}
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
          dropdownStyle={headerStyled.dropdownStyle}
          onSelect={(selectedItem) => {
            onFilter && onFilter({ filterField: selectedItem.filterField, orderField: selectedItem.orderField });
          }}
          buttonTextAfterSelection={(selectedItem) => selectedItem.name}
          rowTextForSelection={(item) => item.name}
          rowTextStyle={headerStyled.rowTextStyle}
          rowStyle={headerStyled.rowStyle}
          buttonStyle={headerStyled.buttonStyle}
          buttonTextStyle={headerStyled.buttonTextStyle}
          renderDropdownIcon={() => {
            return (
              <ArrowDownLine />
            );
          }}
        />
      </Row>
    </View>
  );
};

Header.propTypes = {
  onFilter: PropTypes.func.isRequired,
};


export default memo(Header);
