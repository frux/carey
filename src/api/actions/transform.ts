import childProcess from 'child_process';
import { Action } from '../types';

export function transform(transformFile: string) {
	return {
		_handler: handleTransform,
		type: transform,
		payload: {
			transformFile,
		},
	};
}

function handleTransform(action: Action, ctx?: string) {
	return new Promise<void>((resolve, reject) => {
		childProcess.exec(
			`echo "transforming ${ctx} in order to ${action.payload.transformFile}"`,
			(err, stdout) => {
				if (err) {
					reject(err);
					return;
				}

				console.log(stdout);

				resolve();
			},
		);
	});
}
