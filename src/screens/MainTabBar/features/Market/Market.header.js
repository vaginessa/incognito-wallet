import React, { memo } from 'react';
import PropTypes from 'prop-types';
import SelectDropdown from 'react-native-select-dropdown';
import { headerStyled } from '@screens/MainTabBar/features/Market/Market.styled';
import { Row } from '@src/components';
import {ArrowDownLine} from '@components/Icons/icon.arrowDown';
import SearchBox from '@components/Header/Header.searchBox';
import {Text, TouchableOpacity, View} from 'react-native';
import {StarIcon} from '@components/Icons';
import {COLORS} from '@src/styles';
import {useDispatch, useSelector} from 'react-redux';
import {actionToggleMarketTab, marketTabSelector} from '@screens/Setting';

const headers = [
  { name: 'Gainer', filterField: 'change', orderField: 'desc' },
  { name: 'Loser', filterField: 'change', orderField: 'asc' },
];

export const MarketTabs = {
  ALL: 'all',
  FAVORITE: 'favorite'
};

const Header = ({ onFilter }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(marketTabSelector);
  const onChangeTab = (tab) => {
    dispatch(actionToggleMarketTab(tab));
  };

  return (
    <View>
      <Row spaceBetween style={headerStyled.wrapSearch}>
        <SearchBox
          customSearchBox
          style={headerStyled.wrapInput}
          inputProps={{
            style: headerStyled.input
          }}
        />
      </Row>
      <Row centerVertical spaceBetween>
        <Row centerVertical>
          <TouchableOpacity style={headerStyled.wrapTab} onPress={() => onChangeTab(MarketTabs.ALL)}>
            <Text style={[headerStyled.tabText, activeTab === MarketTabs.ALL && { color: COLORS.blue5 }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={headerStyled.wrapTab} onPress={() => onChangeTab(MarketTabs.FAVORITE)}>
            <StarIcon isBlue={activeTab === MarketTabs.FAVORITE} />
          </TouchableOpacity>
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
