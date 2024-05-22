import React, { useState, useEffect } from 'react';

import { StyleSheet, Platform } from 'react-native';

import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

import { getBrand, getSystemVersion } from 'react-native-device-info'

import { useIsFocused } from '@react-navigation/native'

import {
  topic,
  reduceData,
  getWidth,
  isSizeChanged,
  shouldUpdate,
} from './utils';

const AutoHeightWebView = React.memo(
  props => {
    const {
      style,
      onMessage,
      onSizeUpdated,
      scrollEnabledWithZoomedin,
      scrollEnabled,
    } = props;

    const [size, setSize] = useState({
      height: style && style.height ? style.height : 0,
      width: getWidth(style),
    });

    const isFocused = useIsFocused()

    // 是否设置透明图修复闪退bug -1获取中 0不设置 1设置
    const [showOpacity, setShowOpacity] = useState(-1)

    useEffect(() => {
      Promise.all([
        getBrand(),
        getSystemVersion()
      ]).then(res => {
        setShowOpacity(res[0] === 'HUAWEI' && res[1] === '10' ? 0 : 1)
      }).catch(() => {
        setShowOpacity(1)
      })
    }, [])

    const [scrollable, setScrollable] = useState(false);
    const handleMessage = (event) => {
      if (event.nativeEvent) {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.topic !== topic) {
            onMessage && onMessage(event);
            return;
          }
          const { height, width, zoomedin } = data;
          !scrollEnabled &&
            scrollEnabledWithZoomedin &&
            setScrollable(!!zoomedin);
          const { height: previousHeight, width: previousWidth } = size;
          isSizeChanged({ height, previousHeight, width, previousWidth })
            && Math.abs(height - size.height) > 5
            && setSize({
              height,
              width,
            });
        } catch (error) {
          onMessage && onMessage(event);
        }
      } else {
        onMessage && onMessage(event);
      }
    };

    const currentScrollEnabled =
      scrollEnabled === false && scrollEnabledWithZoomedin
        ? scrollable
        : scrollEnabled;

    const { currentSource, script } = reduceData(props);

    const { width, height } = size;
    useEffect(() => {
      onSizeUpdated &&
        onSizeUpdated({
          height,
          width,
        });
    }, [width, height, onSizeUpdated])

    if (!isFocused || showOpacity === -1) {
      return null
    }

    return <WebView
      {...props}
      onMessage={handleMessage}
      style={[
        styles.webView,
        {
          width,
          height: height,
          // opacity: 0.99 // 增加此属性会导致华为手机在高度超过4096时闪烁
        },
        showOpacity ? { opacity: 0.99 } : {},
        style,
      ]}
      injectedJavaScript={script}
      source={currentSource}
      scrollEnabled={currentScrollEnabled}
    />
  },
  (prevProps, nextProps) => !shouldUpdate({ prevProps, nextProps }),
);

AutoHeightWebView.propTypes = {
  onSizeUpdated: PropTypes.func,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      type: PropTypes.string,
      rel: PropTypes.string,
    }),
  ),
  style: ViewPropTypes.style,
  customScript: PropTypes.string,
  customStyle: PropTypes.string,
  viewportContent: PropTypes.string,
  scrollEnabledWithZoomedin: PropTypes.bool,
  // webview props
  originWhitelist: PropTypes.arrayOf(PropTypes.string),
  onMessage: PropTypes.func,
  scalesPageToFit: PropTypes.bool,
  source: PropTypes.object,
};

let defaultProps = {
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  originWhitelist: ['*'],
};

Platform.OS === 'android' &&
  Object.assign(defaultProps, {
    scalesPageToFit: false,
  });

Platform.OS === 'ios' &&
  Object.assign(defaultProps, {
    viewportContent: 'width=device-width',
  });

AutoHeightWebView.defaultProps = defaultProps;

const styles = StyleSheet.create({
  webView: {
    backgroundColor: 'transparent',
  },
});

export const RichText = ({
  nodes,
  style
}) => {

  return <AutoHeightWebView
    style={{ width: '100%', ...style }}
    source={{ html: nodes }}
    viewportContent='width=device-width, user-scalable=no'
  />
};
