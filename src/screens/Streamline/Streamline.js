import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault, ButtonBasic } from '@src/components/Button';
import srcQuestion from '@src/assets/images/icons/question_gray.png';
import { LoadingContainer, ScrollView } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import PropTypes from 'prop-types';
import { MaxInputNumberForDefragment } from '@screens/Streamline/Streamline.selector';
import withStreamline from './Streamline.enhance';
import { useStreamLine } from './Streamline.useStreamline';
import { styled } from './Streamline.styled';

const Hook = React.memo((props) => {
  const { title, desc, disabled = false } = props?.data;
  if (disabled) {
    return null;
  }
  return (
    <View style={styled.hook}>
      <Text style={styled.hookTitle}>{title}</Text>
      <Text style={styled.hookDesc}>{desc}</Text>
    </View>
  );
});

const Extra = () => {
  const {
    handleDefragmentNativeCoin,
    hookFactories,
    shouldDisabledForm,
    noUTXOS,
  } = useStreamLine();

  return (
    <>
      <Text style={[styled.tooltip, { marginBottom: 30 }]}>
        Consolidate your UTXOs to ensure successful transactions of any amount.
      </Text>
      <Text style={styled.tooltip}>
        There are {noUTXOS} UTXOs in this keychain. You can consolidate{' '}
        {noUTXOS} UTXOs at a time.
      </Text>
      <ButtonBasic
        btnStyle={styled.btnStyle}
        title="Consolidate"
        onPress={handleDefragmentNativeCoin}
        disabled={shouldDisabledForm}
      />
      {hookFactories.map((item, id) => (
        <Hook data={item} key={id} />
      ))}
    </>
  );
};

const Empty = React.memo(() => {
  return (
    <View style={styled.emptyContainer}>
      <Text style={styled.emptyTitle}>Consolidation complete.</Text>
      <Text style={styled.emptyText}>
        You’re now running at peak efficiency.
      </Text>
    </View>
  );
});

const Pending = React.memo(() => {
  const { noUTXOS } = useStreamLine();

  if (noUTXOS > MaxInputNumberForDefragment) {
    return (
      <View style={styled.pendingContainer}>
        <Text style={styled.emptyTitle}>Consolidation in process.</Text>
        <Text style={styled.emptyText}>
          Your remaining UTXOS {noUTXOS}. Please make another
          consolidation after this one is complete.
        </Text>
      </View>
    );
  }

  return <Empty />;
});

const Streamline = (props) => {
  const {
    hasExceededMaxInputPRV,
    handleNavigateWhyStreamline,
    isFetching,
    isPending
  } = useStreamLine();
  const { refresh, handleFetchData, loading } = props;
  const renderMain = () => {
    if (loading) {
      return <LoadingContainer />;
    }
    if (!hasExceededMaxInputPRV) {
      return <Empty />;
    }
    if (isPending) {
      return <Pending />;
    }
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleFetchData} />
        }
        style={styled.scrollview}
      >
        <Extra {...props} />
        {isFetching && <LoadingTx />}
      </ScrollView>
    );
  };
  return (
    <View style={styled.container}>
      <Header
        title="Consolidate"
        customHeaderTitle={(
          <BtnQuestionDefault
            style={styled.questionIcon}
            icon={srcQuestion}
            onPress={handleNavigateWhyStreamline}
          />
        )}
      />
      {renderMain()}
    </View>
  );
};

Streamline.propTypes = {
  handleFetchData: PropTypes.func.isRequired,
  refresh: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withStreamline(Streamline);
