import fs from 'fs';
import { Action, ActionContext } from '../types';

export function move(destination: string) {
	return {
		_handler: moveHandler,
		type: move,
		payload: {
			destination,
		},
	};
}

function moveHandler(action: Action, ctx?: ActionContext) {
	const from = action.payload.source ?? ctx;
	const to = action.payload.destination;

	return new Promise<void>((resolve, reject) => {
		fs.rename(from, to, (err: Error | null) => {
			if (err) {
				reject(err);
			}

			resolve();
		});
	});
}
