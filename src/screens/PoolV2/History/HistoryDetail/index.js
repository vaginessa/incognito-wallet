import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, ScrollViewBorder } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import { colorsSelector } from '@src/theme';
import { useSelector } from 'react-redux';
import styles from './style';
import withData from './data.enhance';

const HistoryDetail = ({ history }) => {
  const colors = useSelector(colorsSelector);
  return (
    <>
      <Header title="Provider history" />
      <ScrollViewBorder>
        <View style={styles.historyItem}>
          <Text style={styles.buttonTitle}>{history.type}</Text>
          <Text style={styles.content}>{history.description}</Text>
        </View>
        <ExtraInfo
          style={[styles.extra, {color: colors.text3}]}
          rightStyle={[styles.info, {color: colors.text1}]}
          left="ID"
          right={history.id}
        />
        <ExtraInfo
          style={[styles.extra, {color: colors.text3}]}
          rightStyle={[styles.info, {color: colors.text1}]}
          left="Time"
          right={history.time}
        />
        <ExtraInfo
          style={[styles.extra, {color: colors.text3}]}
          rightStyle={[styles.info, { color: history.statusColor }]}
          left="Status"
          right={history.status}
        />
        <ExtraInfo
          style={[styles.extra, {color: colors.text3}]}
          rightStyle={[styles.info, {color: colors.text1}]}
          left="Account"
          right={history.account}
        />
        {history?.locked && (
          <>
            <ExtraInfo
              style={[styles.extra, {color: colors.text3}]}
              rightStyle={[styles.info, {color: colors.text1}]}
              left="Lock term"
              right={history?.lockTime + ' Months'}
            />
            <ExtraInfo
              style={[styles.extra, {color: colors.text3}]}
              rightStyle={[styles.info, {color: colors.text1}]}
              left="Term ends"
              right={history?.unlockDate}
            />
          </>
        )}
      </ScrollViewBorder>
    </>
  );
};

HistoryDetail.propTypes = {
  history: PropTypes.object.isRequired,
};

HistoryDetail.defaultProps = {};

export default compose(
  withLayout_2,
  withData,
)(HistoryDetail);
