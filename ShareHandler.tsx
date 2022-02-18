import { Linking } from 'react-native';

export interface SharedContent {
    uri: string;
    mimeType: string;
    fileName: string;
    fileSize: number;
}

class ShareHandler {

    public async launchedFromSharedContent(shareContent: (event: { url: string }) => void): Promise<void> {

        const url = await Linking.getInitialURL();

        if (url) {
            shareContent({ url: url });
        }
    }

    public addListener(shareContent: (event: { url: string }) => void): void {

        if (Linking.listenerCount('url') === 0) {
            Linking.addEventListener('url', shareContent)
        }
    }

    public shareContent(sharedContent_: string): SharedContent {

        const contentSeparator = '://sharedContent=';
        const n = sharedContent_.indexOf(contentSeparator) + contentSeparator.length;
        const sharedContentEncoded = sharedContent_.substr(n);
        const sharedContentDecoded = decodeURI(sharedContentEncoded);
        const sharedContent = JSON.parse(sharedContentDecoded) as SharedContent[];

        return sharedContent[0];
    }
}

export default new ShareHandler();
