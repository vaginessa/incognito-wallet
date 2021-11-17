import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

const ListView = React.memo((props) => {
  const { data, visible, styledListToken, renderItem } = props;
  if (!visible || data.length === 0) {
    return null;
  }
  return (
    <View style={styledListToken}>
      {data.map(renderItem)}
    </View>
  );
});

ListView.defaultProps = {
  styledListToken: null,
  data: [],
};

ListView.propTypes = {
  data: PropTypes.array,
  visible: PropTypes.bool.isRequired,
  styledListToken: PropTypes.any,
  renderItem: PropTypes.any.isRequired,
};

export default ListView;

