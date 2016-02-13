'use strict';
import React, {
  AppRegistry,
} from 'react-native';

import { Trackrecord } from './app';

class Wrapper extends React.Component {

  render() {
    return (
      <Trackrecord style={{flex: 1}} os='android' />
    );
  }

}

AppRegistry.registerComponent('trackrecord', () => Wrapper);
