import React, { memo } from 'react';
import PropTypes from 'prop-types';
import SelectDropdown from 'react-native-select-dropdown';
import { headerStyled } from '@screens/MainTabBar/features/Market/Market.styled';
import { Row } from '@src/components';
import { BaseTextInputCustom } from '@components/core/BaseTextInput';
import {ArrowDownLine} from '@components/Icons/icon.arrowDown';
import SearchBox from '@components/Header/Header.searchBox';

const headers = ['Gainer', 'Loser', 'Vol(24h)'];

const Header = ({ onChange }) => {
  return (
    <Row spaceBetween>
      {/*<BaseTextInputCustom*/}
      {/*  style={headerStyled.wrapInput}*/}
      {/*  inputProps={{*/}
      {/*    onChangeText: onChange,*/}
      {/*    placeholder: 'Search an asset',*/}
      {/*    style: headerStyled.input,*/}
      {/*    autFocus: true,*/}
      {/*  }}*/}
      {/*/>*/}
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
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        buttonTextAfterSelection={(selectedItem) => selectedItem}
        rowTextForSelection={(item) => item}
        rowTextStyle={headerStyled.rowTextStyle}
        rowStyle={headerStyled.rowStyle}
        buttonStyle={headerStyled.buttonStyle}
        buttonTextStyle={headerStyled.buttonTextStyle}
        renderDropdownIcon={() => {
          return (
            <ArrowDownLine name="chevron-down" color="#444" size={18} />
          );
        }}
      />
    </Row>
  );
};

Header.propTypes = {
  onChange: PropTypes.func.isRequired
};


export default memo(Header);
