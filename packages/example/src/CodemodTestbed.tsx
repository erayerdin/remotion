import React, {useCallback} from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {z} from 'zod';
import {DynamicDuration, dynamicDurationSchema} from './DynamicDuration';

// TODO: This does not yet work because it would require a fragment
function AltCodemodRootNoFragment() {
	return (
		<Composition
			id="three"
			component={DynamicDuration}
			width={1080}
			height={1080}
			fps={30}
			durationInFrames={100}
			schema={dynamicDurationSchema}
			defaultProps={{duration: 50}}
		/>
	);
}
// TODO: This does not yet work because it would require a fragment
function AltCodemodRootFragment() {
	return (
		<>
			<Composition
				id="four"
				component={DynamicDuration}
				width={1080}
				height={1080}
				fps={30}
				durationInFrames={100}
				schema={dynamicDurationSchema}
				defaultProps={{duration: 50}}
			/>
			<Composition
				id="five"
				component={DynamicDuration}
				width={1080}
				height={1080}
				fps={30}
				durationInFrames={100}
				schema={dynamicDurationSchema}
				defaultProps={{duration: 50}}
			/>
		</>
	);
}

// Use this file to test codemods such as renames
export const CodemodRoot: React.FC = () => {
	const calculateMetadata: CalculateMetadataFunction<
		z.infer<typeof dynamicDurationSchema>
	> = useCallback(async ({props}) => {
		return {
			durationInFrames: props.duration,
			fps: 30,
		};
	}, []);

	return (
		<>
			<Composition
				id="one"
				component={DynamicDuration}
				width={1080}
				height={1080}
				fps={30}
				durationInFrames={100}
				calculateMetadata={calculateMetadata}
				schema={dynamicDurationSchema}
				defaultProps={{duration: 50}}
			/>
			<Composition
				id="two"
				component={DynamicDuration}
				width={1080}
				height={1080}
				fps={30}
				durationInFrames={100}
				schema={dynamicDurationSchema}
				defaultProps={{duration: 50}}
			/>
			<AltCodemodRootNoFragment />
			<AltCodemodRootFragment />
		</>
	);
};
