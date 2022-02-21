import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getVideoMetaData, Video } from 'react-native-compressor';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4
    },
    containerIn: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    containerControl: {
        flex: 1,
        flexDirection: 'row',
        padding: 4,
        alignItems: 'center',
    },
    button: {
        flex: 1,
        padding: 8,
        backgroundColor: 'yellow',
        borderRadius: 8,
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2
    },
    progress: {
        flex: 1,
        padding: 4,
        textAlign: 'center',
    },
    containerOut: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    containerText: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    }
});

interface CompressorProps {
    uri: string;
    mimeType: string;
    fileName: string;
    fileSize: number;
}

interface CompressorState {
    progress: number;
    metaIn: any;
    metaOut: any;
}

export default class Compressor extends React.Component<CompressorProps, CompressorState> {


    constructor(props: CompressorProps) {
        super(props);

        this.state = { progress: 0, metaIn: undefined, metaOut: undefined };
    }

    public componentDidMount(): void {

        console.log('*********************compressor.didmount')
        console.log('props.uri', this.props.uri)

        getVideoMetaData(this.props.uri)
            .then((meta: any) => {
                console.log('metaData-In', meta)
                this.setState({ metaIn: meta });
            })
            .catch(console.log);
    }

    private onButtonPress = async () => {

        console.log('*********************compressor.buttonpress')

        this.setState({
            progress: 0,
            metaOut: undefined
        });

        const compressionProgress = (progress: number) => {
            this.setState({ progress: progress })
        };

        const compressUri = await Video.compress(
            this.props.uri,
            {
                compressionMethod: 'auto',
                maxSize: 1024,
                minimumFileSizeForCompress: 5,
            },
            compressionProgress
        )
            .catch(console.log);

        console.log('compressUri', compressUri)

        getVideoMetaData(compressUri)
            .then((meta: any) => {
                console.log('metaData-Out', meta)
                this.setState({
                    progress: 1,
                    metaOut: meta
                });
            })
            .catch(console.log);
    }

    public render(): JSX.Element | null {

        return (
            <View style={ styles.container }>

                <View style={ styles.containerIn }>

                    <View style={ styles.containerText }>
                        <Text style={ styles.text }>
                            File In:
                        </Text>
                    </View>

                    <View style={ styles.containerText }>
                        <Text style={ styles.text }>
                            { 'Extension: ' + this.state.metaIn?.extension }
                        </Text>
                        <Text style={ styles.text }>
                            { 'Height: ' + Math.round(this.state.metaIn?.height) }
                        </Text>
                        <Text style={ styles.text }>
                            { 'Width: ' + Math.round(this.state.metaIn?.width) }
                        </Text>
                        <Text style={ styles.text }>
                            { 'Size: ' + Math.round(this.state.metaIn?.size / 10000) / 100 + ' MB' }
                        </Text>
                    </View>

                </View>

                <View style={ styles.containerControl }>

                    <Pressable
                        style={ styles.button }
                        onPress={ this.onButtonPress }
                    >
                        <Text style={ styles.text }>
                            Compress
                        </Text>
                    </Pressable>

                    <Text style={ styles.progress }>
                        { 'Progress: ' + Math.round(this.state.progress * 100) + '%' }
                    </Text>

                </View>

                <View style={ styles.containerOut }>

                    <View style={ styles.containerText }>
                        <Text style={ styles.text }>
                            File Out:
                        </Text>
                    </View>

                    <View style={ styles.containerText }>
                        <Text style={ styles.text }>
                            { 'Extension: ' + this.state.metaOut?.extension }
                        </Text>
                        <Text style={ styles.text }>
                            { 'Height: ' + Math.round(this.state.metaOut?.height) }
                        </Text>
                        <Text style={ styles.text }>
                            { 'Width: ' + Math.round(this.state.metaOut?.width) }
                        </Text>
                        <Text style={ styles.text }>
                            { 'Size: ' + Math.round(this.state.metaOut?.size / 10000) / 100 + ' MB' }
                        </Text>
                    </View>

                </View>

            </View>
        );
    }
}
