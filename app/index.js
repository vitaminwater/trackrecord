/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import _ from 'lodash';
import moment from 'moment';

import React, {
  Picker,
  Component,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Navigator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import * as helper from './sheethelper';

class InitialLoading extends Component {

  render() {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.bigText}>
          Checking spreadsheet
        </Text>
        <Text style={commonStyles.bigText}>
          Please wait...
        </Text>
      </View>
    );
  }

}

const NEUTRAL_TAG = 'Add a tag';
class NoTracking extends Component {

  constructor(props) {
    super(props);
    this.state = {description: '', tag: NEUTRAL_TAG};
  }

  render() {
    const tags = _.map([NEUTRAL_TAG].concat(this.props.tags), (tag) => {
      return (<Picker.Item key={tag} label={tag} value={tag} />);
    });

    return (
      <View style={commonStyles.container}>
        <TextInput style={noTrackingStyles.input}
                   onChangeText={(description) => this.setState({description})}
                   value={this.state.description}
                   placeholder='What are you doing ?'
                   placeholderTextColor='white' />
        <View style={noTrackingStyles.pickerContainer}>
          <Text style={noTrackingStyles.input}>
            {this.state.tag}
          </Text>
          <Picker style={noTrackingStyles.picker}
                  selectedValue={this.state.tag}
                  onValueChange={(tag) => {
                    this.setState({tag})
                    TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
                  }}>
            {tags}
          </Picker>
        </View>
        <TouchableOpacity onPress={() => this._handleStartButton()}>
          <Image source={require('./assets/start-button.png')}/>
        </TouchableOpacity>
      </View>
    );
  }

  _handleStartButton() {
    if (!this.state.description || !this.state.tag == NEUTRAL_TAG) {
      return;
    }
    this.props.onPushTrack(this.state.description, this.state.tag);
  }

}

const noTrackingStyles = StyleSheet.create({
  pickerContainer: {
    height: 70,
  },
  picker: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    opacity: 0,
  },
  input: {
    color: 'white',
    height: 90,
    opacity: 0.8,
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

class TrackingButton extends Component {

  render() {
    return (
      <View style={[this.props.style, commonStyles.container]}>
        <Image source={this.props.source}/>
        <Text style={trackingButtonStyles.title}>{this.props.title}</Text>
      </View>
    );
  }

}

const trackingButtonStyles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 15,
  },
});

class Tracking extends Component {

  constructor(props) {
    super(props);
    this.state = {hr:0, min:0, sec:0};
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const duration = new Date() - new Date(this.props.currentTrack.start);
      const hr = moment.duration(duration).hours();
      const min = moment.duration(duration).minutes();
      const sec = moment.duration(duration).seconds();
      this.setState({hr, min, sec});
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <View style={commonStyles.container}>
        <View style={trackingStyles.container}>
          <View style={trackingStyles.topContainer}>
            <Text style={[commonStyles.bigText, commonStyles.bigBigText]}>{this.props.currentTrack.description}</Text>
            <Text style={commonStyles.bigText}>{this.props.currentTrack.tag}</Text>
            <Text style={commonStyles.bigText}>{this.to2digits(this.state.hr)}:{this.to2digits(this.state.min)}:{this.to2digits(this.state.sec)}</Text>
            <TouchableOpacity onPress={this.props.onEndLast} style={trackingStyles.stopButtonContainer}>
              <Image style={trackingStyles.stopButton} resizeMode={Image.resizeMode.contains} source={require('./assets/stop-button.png')}/>
            </TouchableOpacity>
          </View>
          <View style={trackingStyles.scrollViewParent}>
            <ScrollView style={trackingStyles.scrollView}
                        contentContainerStyle={trackingStyles.scrollViewContainer}>
              <TouchableOpacity onPress={this.props.onResumePrevious}>
                <TrackingButton style={trackingStyles.button}
                                title='resume'
                                source={require('./assets/resume-button.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.onPushTrack('Clope', 'pause')}>
                <TrackingButton style={trackingStyles.button}
                                title='clope'
                                source={require('./assets/clope-button.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.onPushTrack('Bouffer', 'bouffer')}>
                <TrackingButton style={trackingStyles.button}
                                title='eat'
                                source={require('./assets/eat-button.png')} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  to2digits(number) {
    return number < 10 ? '0' + number : number;
  }

}

const trackingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  topContainer: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  stopButtonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewParent: {
    height: 95,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    marginRight: 10,
    marginLeft: 10,
  },
});

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    opacity: 0.9,
    textAlign: 'center',
  },
  bigBigText: {
    fontSize: 40,
  }
});

export class Trackrecord extends Component {

  constructor(props) {
    super(props);

    var {width, height} = Dimensions.get('window');
    this.state = {width, height, currentTrack: null, initialLoading: true, tags: [], loading: false};
  }

  componentWillMount() {
    this._refreshBG();
  }

  componentDidMount() {
    this._refreshCurrentTrack().then(() => {
      if (this.state.loading) {
        return;
      }
      this.setState({initialLoading: false});
    });
    this._refreshTags();

    setInterval(() => {
      if (this.state.loading) {
        return;
      }
      this._refreshCurrentTrack();
      this._refreshBG();
    }, 20000);
    setInterval(this._refreshTags.bind(this), 60000);
  }

  render() {
    let currentPage;

    if (this.state.initialLoading) {
      currentPage = (
        <InitialLoading />
      );
    } else if (this.state.currentTrack && this.state.currentTrack.isTracking) {
      currentPage = (
        <Tracking
          currentTrack={this.state.currentTrack}
          onEndLast={() => this._handleEndLast()}
          onResumePrevious={() => this._handleResumePrevious()}
          onPushTrack={(description, tag) => this._handlePushTrack(description, tag)} />
      );
    } else {
      currentPage = (
        <NoTracking onPushTrack={(description, tag) => this._handlePushTrack(description, tag)}
                    tags={this.state.tags} />
      );
    }

    let loading;
    if (this.state.loading && !this.state.initialLoading) {
      loading = (
        <View style={styles.loading}>
          <Text style={commonStyles.bigText}>Refreshing...</Text>
        </View>
      );
    }

    return (
      <View onLayout={(e) => this.setState({width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height})} style={styles.container}>
        <Image style={[styles.background, {width: this.state.width, height: this.state.height}]}
               source={this.state.bg}
               resizeMode={Image.resizeMode.cover} />
        {currentPage}
        <TouchableOpacity style={styles.refresh} onPress={() => {
          this._refreshCurrentTrack();
          this._refreshTags();
        }}>
          <Image source={require('./assets/refresh-button.png')} />
        </TouchableOpacity>
        {loading}
      </View>
    );
  }

  _handleEndLast() {
    this.setState({loading: true});
    helper.endLast().then(() => this._refreshCurrentTrack(), () => this._notLoading());
  }

  _handleResumePrevious() {
    this.setState({loading: true});
    helper.resumePrevious().then(() => this._refreshCurrentTrack(), () => this._notLoading());
  }

  _handlePushTrack(description, tag) {
    this.setState({loading: true});
    helper.pushNewTrack(description, tag).then(() => this._refreshCurrentTrack(), () => this._notLoading());
  }

  _refreshCurrentTrack() {
    this.setState({loading: true});
    return helper.getLastTrack().then((track) => {
      this.setState({currentTrack: track, loading: false});
    }, () => this._notLoading());
  }

  _refreshTags() {
    return helper.getTags().then((tags) => {
      this.setState({tags: tags.tags});
    });
  }

  _notLoading() {
    this.setState({loading: false});
  }

  _refreshBG() {
    const bgs = [
      require('./backgrounds/bg1.jpg'),
      require('./backgrounds/bg2.jpg'),
      require('./backgrounds/bg3.jpg'),
      require('./backgrounds/bg4.jpg'),
      require('./backgrounds/bg5.jpg'),
      require('./backgrounds/bg6.jpg'),
      require('./backgrounds/bg7.jpg'),
      require('./backgrounds/bg8.jpg'),
      require('./backgrounds/bg9.jpg'),
    ];
    this.setState({bg: bgs[parseInt(Math.random() * bgs.length)]});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    opacity: 0.8,
  },
  loading: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  refresh: {
    position: 'absolute',
    top: 10, right: 10,
  },
});

