import { Text } from '@src/components/core';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { ButtonBasic } from '@src/components/Button';
import { View2 } from '@components/core/View';
import withGetStarted from './GetStarted.enhance';
import style from './style';

const GetStarted = React.memo((props) => {
  const { loading, errorMsg = '', onRetry } = props;
  return (
    <View2 style={style.container}>
      {loading && (
        <View2 style={style.loadingContainer}>
          <ActivityIndicator size="large" color="#828282" />
        </View2>
      )}
      <View2 style={style.getStartedBlock}>
        {!errorMsg && loading && (
          <Text style={[style.title, style.centerText]}>
            {'Entering incognito mode\nfor your crypto...'}
          </Text>
        )}
        {!!errorMsg && !loading && (
          <>
            <Text style={[style.errorMsg, style.centerText]}>{errorMsg}</Text>
            <ButtonBasic
              btnStyle={style.retryBtn}
              title="Retry"
              onPress={onRetry}
            />
          </>
        )}
      </View2>
    </View2>
  );
});

GetStarted.propTypes = {
  errorMsg: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default withGetStarted(GetStarted);
