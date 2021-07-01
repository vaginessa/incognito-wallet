import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from '@screens/Home/features/Convert/Convert.styled';
import { ActivityIndicator } from '@components/core';
import { Icon } from 'react-native-elements';
import { COLORS } from '@src/styles';
import { ScreenHeight } from '@utils/devices';
import { useDispatch, useSelector } from 'react-redux';
import { convertCoinsDataSelector, convertGetConvertStepSelector } from '@screens/Home/features/Convert/Convert.selector';
import { ButtonBasic } from '@components/Button';
import { actionConvertCoins } from '@screens/Home/features/Convert/Convert.actions';
import {MESSAGES} from '@screens/Dex/constants';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';

const ConvertStep = () => {
  const dispatch = useDispatch();
  const { convertStep: currentStep, messages, isConverting, isConverted }= useSelector(convertCoinsDataSelector);
  const steps = useSelector(convertGetConvertStepSelector);
  const flatListRef = React.useRef(null);

  const renderStep = (data) => {
    const { key, name, tokenID } = data?.item;
    const status = messages.find((item) => item?.tokenID === tokenID);
    let statusColor = COLORS.black;
    let error;
    if (status) {
      const { errorMessage } = status;
      error = errorMessage;
      statusColor = errorMessage ? COLORS.red : COLORS.green4;
    }
    return (
      <>
        <View style={styles.log} key={key}>
          {currentStep === key ? <ActivityIndicator style={styles.logIcon} size="small" /> : (
            <Icon
              containerStyle={styles.logIcon}
              color={statusColor}
              size={12}
              name="checkbox-blank-circle"
              type="material-community"
            />
          )}
          <Text style={[styles.stepText]}>
            {name}
          </Text>
        </View>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </>
    );
  };

  const handleScrollStep = () => {
    if(!currentStep || !steps || !flatListRef.current) return;
    const index = steps.findIndex(step => step.key === currentStep);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index });
    }
  };

  const handleConvert = () => {
    dispatch(actionConvertCoins());
  };

  React.useEffect(() => {
    handleScrollStep();
  }, [currentStep, steps]);

  return(
    <View style={{ marginTop: 30, flex: 1 }}>
      <View style={[{ maxHeight: ScreenHeight * 0.4 }]}>
        <FlatList
          ref={flatListRef}
          data={steps}
          renderItem={renderStep}
          keyExtractor={(item) => item.key}
        />
      </View>
      <ButtonBasic
        title={isConverted ? 'Converted' : isConverting ? 'Converting...' : 'Convert'}
        btnStyle={{ marginTop: 30, marginBottom: 50 }}
        onPress={handleConvert}
        disabled={isConverting || isConverted}
      />
      {isConverting && (
        <Text style={styles.warning}>{MESSAGES.CONVERT_PROCESS}</Text>
      )}
    </View>
  );
};

ConvertStep.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default memo(ConvertStep);
