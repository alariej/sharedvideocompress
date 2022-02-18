import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface VideoPlayerProps {
    uri: string;
    mimeType: string;
    fileName: string;
}

interface VideoPlayerState {
    html: string | undefined;
}

export default class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {

    constructor(props: VideoPlayerProps) {
        super(props);

        this.state = { html: undefined };
    }

    public componentDidMount(): void {

        console.log('*********************videoplayer.didmount')
        console.log('props.uri', this.props.uri)

        this.setHtml();
    }

    private setHtml = async () => {

        if (!this.props.uri) {
            this.setState({ html: undefined })
            return
        }

        await RNFS.unlink(RNFS.CachesDirectoryPath + '/temp.xyz').catch(_error => null);
        await RNFS.unlink(RNFS.CachesDirectoryPath + '/temp.html').catch(_error => null);

        // const stat1 = await RNFS.stat(this.props.uri.replace('file://', '')).catch(console.log) as RNFS.StatResult;
        // console.log('stat1', stat1)

        const videoPathTemp = RNFS.CachesDirectoryPath + '/temp.xyz';

        const tempExists = await RNFS.exists(videoPathTemp).catch(_err => null);

        if (tempExists) {
            await RNFS.unlink(videoPathTemp).catch(_err => null);
        }

        await RNFS.copyFile(this.props.uri.replace('file://', ''), videoPathTemp)
            .catch(_error => console.log(_error));

        // const stat2 = await RNFS.stat(videoPathTemp).catch(console.log) as RNFS.StatResult;
        // console.log('stat2', stat2)

        const html =
            `
            <!DOCTYPE html>
            <html style="height: 100%; width: 100%">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
                </head>
                <style>
                    *:focus {
                        outline: 0;
                        box-shadow: none;
                    }
                    .videoControls
                        :is(media-play-button, media-mute-button, media-time-display) {
                            opacity: 0.4;
                            height: 32px;
                            padding: 6px;
                            background-color: black;
                        }
                </style>
                <body style="height: 100%; width: 100%; display: flex; padding: 0px; margin: 0px">
                    <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@0.4.3/dist/index.min.js"></script>
                    <media-controller autohide="-1" style="height: 100%; width: 100%">
                        <video
                            slot="media"
                            style="background-color: white"
                            height="100%"
                            width="100%"
                            disablepictureinpicture
                            muted
                            playsinline
                            webkit-playsinline
                        >
                            <source src="${ videoPathTemp }#t=0.001" type="${ this.props.mimeType }">
                        </video>
                        <div style="display: flex; align-self: stretch; justify-content: center;">
                            <media-control-bar class="videoControls">
                                <media-play-button></media-play-button>
                                <media-mute-button></media-mute-button>
                                <media-time-display show-duration></media-time-display>
                            </media-control-bar>
                        </div>
                    </media-controller>
                </body>
            </html>
            `;

        await RNFS.writeFile(RNFS.CachesDirectoryPath + '/temp.html', html, 'utf8')
            .catch(_error => null);

        this.setState({ html: 'file://' + RNFS.CachesDirectoryPath + '/temp.html' })
    }

    public render(): JSX.Element | null {

        let webView: ReactElement | undefined;

        if (this.state.html) {
            webView =
                <WebView
                    scrollEnabled={ false }
                    originWhitelist={ ['*'] }
                    source={{ uri: this.state.html }}
                    mediaPlaybackRequiresUserAction={ false }
                    allowsInlineMediaPlayback={ true }
                    allowsFullscreenVideo={ false }
                    allowFileAccess={ true }
                    javaScriptEnabled={ true }
                    allowingReadAccessToURL={ RNFS.CachesDirectoryPath }
                />
        }

        return (
            <View style={ styles.container }>
                { webView }
            </View>
        );
    }
}
