import React from 'react';
import { View } from 'react-native';
import { ReviewOrder, TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { Hook, styled as extraStyled } from '@screens/PDexV3/features/Extra';
import { Text } from '@src/components/core';
import { orderLimitDataSelector } from './OrderLimit.selector';
import { actionBookOrder } from './OrderLimit.actions';
import { useSubInfo } from './OrderLimit.subInfo';

const Review = () => {
  const dispatch = useDispatch();
  const {
    mainColor,
    ordering,
    rateStr,
    reviewOrderTitle,
    reviewOrderDesc,
    reviewOrderDescValue,
    cfmTitle,
  } = useSelector(orderLimitDataSelector);
  const [subInfoFactories] = useSubInfo();
  const hooksFactories = [
    {
      label: reviewOrderDesc,
      value: reviewOrderDescValue || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      boldLabel: true,
      boldValue: true,
    },
    {
      label: 'Rate',
      value: rateStr || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    ...subInfoFactories,
  ];
  const handleConfirm = async () => {
    try {
      const tx = await dispatch(actionBookOrder());
      if (tx) {
        dispatch(
          actionToggleModal({
            data: <TradeSuccessModal desc={cfmTitle} />,
            visible: true,
          }),
        );
      }
    } catch {
      //
    }
  };
  return (
    <ReviewOrder
      extra={
        <View>
          <Text style={{ ...extraStyled.specialTitle, color: mainColor }}>
            {reviewOrderTitle}
          </Text>
          {hooksFactories.map((hook) => (
            <Hook key={hook.label} {...hook} />
          ))}
        </View>
      }
      handleConfirm={handleConfirm}
      loading={ordering}
      btnColor={mainColor}
    />
  );
};

Review.propTypes = {};

export default React.memo(Review);
