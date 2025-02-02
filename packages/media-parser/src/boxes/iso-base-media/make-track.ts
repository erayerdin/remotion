import {
	getAudioCodecStringFromTrak,
	getNumberOfChannelsFromTrak,
	getSampleRate,
} from '../../get-audio-codec';
import {
	getTimescaleAndDuration,
	trakBoxContainsAudio,
	trakBoxContainsVideo,
} from '../../get-fps';
import {
	applyAspectRatios,
	applyTkhdBox,
	getDisplayAspectRatio,
	getSampleAspectRatio,
	getVideoSample,
} from '../../get-sample-aspect-ratio';
import type {AudioTrack, OtherTrack, VideoTrack} from '../../get-tracks';
import {getVideoCodecString} from '../../get-video-codec';
import {getTkhdBox, getVideoDescriptors} from '../../traversal';
import type {TrakBox} from './trak/trak';

export const makeBaseMediaTrack = (
	trakBox: TrakBox,
): VideoTrack | AudioTrack | OtherTrack | null => {
	const tkhdBox = getTkhdBox(trakBox);

	const videoDescriptors = getVideoDescriptors(trakBox);
	const timescaleAndDuration = getTimescaleAndDuration(trakBox);

	if (!tkhdBox) {
		throw new Error('Expected tkhd box in trak box');
	}

	if (!timescaleAndDuration) {
		throw new Error('Expected timescale and duration in trak box');
	}

	if (trakBoxContainsAudio(trakBox)) {
		const numberOfChannels = getNumberOfChannelsFromTrak(trakBox);
		if (numberOfChannels === null) {
			throw new Error('Could not find number of channels');
		}

		const sampleRate = getSampleRate(trakBox);
		if (sampleRate === null) {
			throw new Error('Could not find sample rate');
		}

		const {codecString, description} = getAudioCodecStringFromTrak(trakBox);

		return {
			type: 'audio',
			trackId: tkhdBox.trackId,
			timescale: timescaleAndDuration.timescale,
			codec: codecString,
			numberOfChannels,
			sampleRate,
			description,
			trakBox,
		};
	}

	if (!trakBoxContainsVideo(trakBox)) {
		return {
			type: 'other',
			trackId: tkhdBox.trackId,
			timescale: timescaleAndDuration.timescale,
			trakBox,
		};
	}

	const videoSample = getVideoSample(trakBox);
	if (!videoSample) {
		throw new Error('No video sample');
	}

	const sampleAspectRatio = getSampleAspectRatio(trakBox);

	const aspectRatioApplied = applyAspectRatios({
		dimensions: videoSample,
		sampleAspectRatio,
		displayAspectRatio: getDisplayAspectRatio({
			sampleAspectRatio,
			nativeDimensions: videoSample,
		}),
	});

	const {displayAspectHeight, displayAspectWidth, height, rotation, width} =
		applyTkhdBox(aspectRatioApplied, tkhdBox);

	const codec = getVideoCodecString(trakBox);

	if (!codec) {
		throw new Error('Could not find video codec');
	}

	const track: VideoTrack = {
		type: 'video',
		trackId: tkhdBox.trackId,
		description: videoDescriptors ?? undefined,
		timescale: timescaleAndDuration.timescale,
		codec,
		sampleAspectRatio: getSampleAspectRatio(trakBox),
		width,
		height,
		codedWidth: videoSample.width,
		codedHeight: videoSample.height,
		// Repeating those keys because they get picked up by VideoDecoder
		displayAspectWidth,
		displayAspectHeight,
		rotation,
		trakBox,
	};
	return track;
};
