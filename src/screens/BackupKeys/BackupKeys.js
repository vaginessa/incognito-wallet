/* eslint-disable import/no-cycle */
import { ScrollView, TouchableOpacity } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import CopiableText from '@src/components/CopiableText';
import { View, Text } from 'react-native';
import Header from '@src/components/Header';
import IconCopy from '@src/components/Icons/icon.copy';
import { ButtonBasic, BtnQRCode } from '@src/components/Button';
import srcQrCodeLight from '@src/assets/images/icons/qr_code_light.png';
import srcQrCode from '@src/assets/images/icons/qr_code.png';
import { ArrowRightGreyIcon } from '@src/components/Icons';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import style from './BackupKeys.styled';
import withBackupKeys from './BackupKeys.enhance';

const BackupKeys = (props) => {
  const { onSaveAs, onCopyAll, backupData, getNameKey, onNext, onBack, backupDataStr} = props;
  const navigation = useNavigation();
  
  const onNavigateToQrPage = (label, value) => {
    navigation.navigate(routeNames.ExportAccountModal, {
      params: {
        value,
        label,
      },
    });
  };

  const renderAccountItem = (name, key) => {
    return (
      <CopiableText
        key={name}
        text={`${name}: ${key}`}
        copiedMessage={`"${name}" private key was copied`}
        style={style.accountItemContainer}
      >
        <View style={style.accountItemHeader}>
          <Text style={style.title}>{name}</Text>
          <BtnQRCode
            style={style.qrCode}
            onPress={()=> onNavigateToQrPage(name, key)}
            source={srcQrCodeLight}
          />
          <IconCopy />
        </View>
        <Text style={style.desc}>
          {key}
        </Text>
      </CopiableText>
    );
  };

  const handleCopy = () => {
    onCopyAll();

    if (onNext) {
      onNext();
    }
  };

  return (
    <View style={style.container}>
      <Header title="Back up private keys" onGoBack={onBack} />
      <View style={style.wrapper}>
        <ScrollView>
          <View style={style.topGroup}>
            {backupData?.map((pair) => {
              const [name, key] = getNameKey(pair);
              return renderAccountItem(name, key);
            })}
          </View>
          <View>
            <Text style={style.title}>Back up all keys</Text>
            <TouchableOpacity onPress={onSaveAs}>
              <View style={style.saveAsBtn}>
                <Text style={style.desc}>Choose back up option</Text>
                <ArrowRightGreyIcon />
              </View>
            </TouchableOpacity>
            <View style={style.bottomGroup}>
              <BtnQRCode
                style={style.btnQRCode}
                onPress={()=> onNavigateToQrPage('Back up private keys', backupDataStr)}
                source={srcQrCode}
              />
              <ButtonBasic
                btnStyle={[style.copyAllButton, onNext && style.copyNext]}
                title={onNext ? 'Copy all keys and\n\ncontinue to new update' : 'Copy all keys'}
                onPress={handleCopy}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

BackupKeys.defaultProps = {
  backupDataStr: '',
  backupData: [],
  onNext: undefined,
  onBack: undefined,
};

BackupKeys.propTypes = {
  backupDataStr: PropTypes.string,
  backupData: PropTypes.arrayOf(PropTypes.object),
  onSaveAs: PropTypes.func.isRequired,
  onCopyAll: PropTypes.func.isRequired,
  getNameKey: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

export default withBackupKeys(BackupKeys);
