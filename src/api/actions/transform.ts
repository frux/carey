import fs from 'fs/promises';
import jscodeshift, { Transform } from 'jscodeshift';
import { Action } from '../types';

interface TransformPayload {
	transform: Transform;
}

export function transform(transformFn: Transform) {
	return {
		_handler: handleTransform,
		type: transform,
		payload: {
			transform: transformFn,
		},
	};
}

async function handleTransform(action: Action<TransformPayload>, ctx: string) {
	const source = await fs.readFile(ctx);

	if (!source) {
		throw new Error(`Source file not found at ${ctx}`);
	}

	const transformedContent = action.payload.transform(
		{ path: ctx, source: String(source) },
		{
			jscodeshift,
			j: jscodeshift,
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			report() {},
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			stats() {},
		},
		{},
	);

	if (typeof transformedContent !== 'string') {
		throw new Error('No data to write to file. Expected string.');
	}

	return fs.writeFile(ctx, transformedContent);
}
