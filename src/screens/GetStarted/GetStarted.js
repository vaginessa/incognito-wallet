import { Text, View } from '@src/components/core';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { ButtonBasic } from '@src/components/Button';
import withGetStarted from './GetStarted.enhance';
import style from './style';

const GetStarted = React.memo((props) => {
  const { loading, errorMsg = '', onRetry } = props;
  return (
    <View style={style.container}>
      {loading && (
        <View style={style.loadingContainer}>
          <ActivityIndicator size="large" color="#828282" />
        </View>
      )}
      <View style={style.getStartedBlock}>
        {!errorMsg && loading && (
          <Text style={[style.title, style.centerText]}>
            {'Entering incognito mode\nfor your crypto...'}
          </Text>
        )}
        {!!errorMsg && (
          <>
            <Text style={[style.errorMsg, style.centerText]}>{errorMsg}</Text>
            <ButtonBasic
              btnStyle={style.retryBtn}
              title="Retry"
              onPress={onRetry}
            />
          </>
        )}
      </View>
    </View>
  );
});

GetStarted.propTypes = {
  errorMsg: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default withGetStarted(GetStarted);
