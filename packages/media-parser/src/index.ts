import {createMedia} from './create/create-media';

export {AudioTrack, OtherTrack, Track, VideoTrack} from './get-tracks';
export {parseMedia} from './parse-media';
export {
	AudioSample,
	OnAudioSample,
	OnAudioTrack,
	OnVideoSample,
	OnVideoTrack,
	VideoSample,
} from './webcodec-sample-types';

export type {MediaFn} from './create/create-media';

export const MediaParserInternals = {
	createMedia,
};
