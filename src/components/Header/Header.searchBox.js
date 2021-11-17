import { TextInput } from '@src/components/Input';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createForm } from '@components/core/reduxForm';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {BaseTextInputCustom} from '@components/core/BaseTextInput';
import {ScreenWidth} from '@utils/devices';

const styled = StyleSheet.create({
  searchBox: {
    flex: 1,
  },
  searchBoxNormal: {
    marginRight: 20,
    width: ScreenWidth * 0.62,
    height: 30,
  }
});
export const searchBoxConfig = {
  form: 'searchFormHeader',
  searchBox: 'search',
};
const Form = createForm(searchBoxConfig.form);
const SearchBox = (props) => {
  const { isNormalSearch, customSearchBox, style } = props;
  if (isNormalSearch) {
    return (
      <TextInput
        style={styled.searchBoxNormal}
        containerInputStyle={styled.searchBoxNormal}
        onChangeText={props?.onChange}
        onBlur={props?.onSubmit}
        autoFocus
        placeholder={props?.placeHolder || ''}
        onSubmitEditting={props?.onSubmit}
      />
    );
  }
  return (
    <Form style={styled.searchBox}>
      <Field
        name={searchBoxConfig.searchBox}
        component={componentProps => {
          const { input, ...rest } = componentProps;
          if (customSearchBox) {
            return (
              <BaseTextInputCustom
                onBlur={input?.onBlur}
                onFocus={input?.onFocus}
                value={input?.value}
                autoFocus
                placeholder={props?.title || ''}
                inputProps={{
                  onChangeText: input?.onChange,
                  placeholder: 'Search an asset',
                  autFocus: true,
                }}
                style={style}
                {...rest}
              />
            );
          }
          return (
            <TextInput
              onChangeText={input?.onChange}
              onBlur={input?.onBlur}
              onFocus={input?.onFocus}
              value={input?.value}
              autoFocus
              placeholder={props?.title || ''}
              {...rest}
            />
          );
        }}
      />
    </Form>
  );
};

SearchBox.defaultProps = {
  isNormalSearch: false,
  customSearchBox: false,
  style: null
};
SearchBox.propTypes = {
  isNormalSearch: PropTypes.bool,
  title: PropTypes.string.isRequired,
  customSearchBox: PropTypes.bool,
  style: PropTypes.any
};
export default React.memo(SearchBox);
