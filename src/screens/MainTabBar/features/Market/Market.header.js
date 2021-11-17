import React, { memo } from 'react';
import PropTypes from 'prop-types';
import SelectDropdown from 'react-native-select-dropdown';
import { headerStyled } from '@screens/MainTabBar/features/Market/Market.styled';
import { Row } from '@src/components';
import {ArrowDownLine} from '@components/Icons/icon.arrowDown';
import SearchBox from '@components/Header/Header.searchBox';
import {COLORS} from '@src/styles';

const headers = [
  { name: 'Gainer', filterField: 'change', orderField: 'desc' },
  { name: 'Loser', filterField: 'change', orderField: 'asc' }
];

const Header = ({ onFilter }) => {
  return (
    <Row spaceBetween style={{ backgroundColor: COLORS.white }}>
      <SearchBox
        customSearchBox
        style={headerStyled.wrapInput}
        inputProps={{
          style: headerStyled.input
        }}
      />
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
  );
};

Header.propTypes = {
  onFilter: PropTypes.func.isRequired
};


export default memo(Header);
