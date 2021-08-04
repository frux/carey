import EventEmitter from 'events';
import { Action, ActionContext, MigrationItem } from './types';

export * from './actions/file-system';
export * from './actions/transform';
export * from './types';

export function carey(migration: MigrationItem[]) {
	const eventEmitter = new EventEmitter();
	const execMigration = migrationGenerator(migration);

	(async () => {
		let actionStep = execMigration.next();

		while (!actionStep.done) {
			const [action, ctx, result] = await actionStep.value;

			eventEmitter.emit('actionStarted', action, ctx);

			try {
				eventEmitter.emit('actionFinished', action, ctx, await result);
			} catch (err) {
				eventEmitter.emit('error', err, action);
			}

			actionStep = execMigration.next();
		}

		eventEmitter.emit('end');
	})();

	return eventEmitter;
}

function * migrationGenerator(
	migration: MigrationItem[],
	ctx: ActionContext | null = null,
): Generator<[Action, ActionContext | null, Promise<void>], void, void> {
	for (const action of migration) {
		if ('_handler' in action) {
			yield [action, ctx, action._handler(action, ctx)];
		} else {
			yield * migrationGenerator(action.do, action.with);
		}
	}
}
