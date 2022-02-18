/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { ReactElement, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Compressor from './Compressor';
import ShareHandler, { SharedContent } from './ShareHandler';
import VideoPlayer from './VideoPlayer';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const sharedVideoInit: SharedContent = {
    uri: '',
    mimeType: '',
    fileName: '',
    fileSize: 0,
  }

  let [sharedVideo, setSharedVideo] = useState(sharedVideoInit);

  const shareContent = (event: { url: string }) => {

    console.log('*********************app.sharecontent')
    console.log('event', event)

    const sharedVideo_ = ShareHandler.shareContent(event.url);

    if (sharedVideo.fileName !== sharedVideo_.fileName) {
      setSharedVideo(sharedVideoInit);
      setTimeout(() => {
        setSharedVideo(sharedVideo_);
      }, 250);
    }
  }

  ShareHandler.launchedFromSharedContent(shareContent);

  ShareHandler.addListener(shareContent);

  let videoPlayer: ReactElement | undefined;
  let compressor: ReactElement | undefined;
  if (sharedVideo.uri) {
    videoPlayer = (
      <VideoPlayer
        uri={ sharedVideo.uri }
        mimeType={ sharedVideo.mimeType }
        fileName={ sharedVideo.fileName }
      />
    )
    compressor = (
      <Compressor
        uri={ sharedVideo.uri!}
        mimeType={ sharedVideo.mimeType }
        fileName={ sharedVideo.fileName }
        fileSize={ sharedVideo.fileSize }
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.containerText}>
          <Text
            style={styles.text}>
            Shared Video Compressor
          </Text>
        </View>
        <View style={styles.containerVideo}>
          { videoPlayer }
        </View>
        <View style={styles.containerCompressor}>
          { compressor }
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
  containerText: {
    flex: 1,
    margin: 4,
    justifyContent: 'center',
    backgroundColor: 'lime'
  },
  containerVideo: {
    flex: 8,
    margin: 4,
  },
  containerCompressor: {
    flex: 4,
    margin: 4,
    backgroundColor: 'cyan'
  },
});

export default App;
