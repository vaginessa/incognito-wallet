import React from 'react';
import { Switch as RNComponent } from 'react-native';
import { COLORS } from '@src/styles';

const Switch = (props) => <RNComponent trackColor={{ true: COLORS.blue5, false: '#757575' }} style={{ transform: [{ scaleX: .9 }, { scaleY: .8 }] }} {...props} />;

export default Switch;
