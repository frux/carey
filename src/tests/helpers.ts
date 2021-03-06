import { vol, createFsFromVolume } from 'memfs';
import { NestedDirectoryJSON } from 'memfs/lib/volume';
import * as _careyModule from '../api';

function requireCarey(files: NestedDirectoryJSON, mocks: Record<string, () => unknown>) {
	vol.reset();
	vol.fromNestedJSON(files, '/');
	jest.doMock('fs', () => createFsFromVolume(vol));
	jest.doMock('fs/promises', () => createFsFromVolume(vol).promises);

	Object.getOwnPropertyNames(mocks).forEach(moduleName => {
		jest.doMock(moduleName, mocks[moduleName], { virtual: true });
	});

	const mockedCarey = require('../api') as typeof _careyModule;

	return [mockedCarey, vol] as const;
}

export function assertMigration(files: NestedDirectoryJSON, getMigration: (mockedCareyModule: typeof _careyModule) => _careyModule.Migration) {
	const [mockedCareyModule, fs] = requireCarey(files, {});

	return new Promise<void>((resolve, reject) => {
		const migration = getMigration(mockedCareyModule);

		mockedCareyModule.carey(migration)
			.on('error', (err: Error) => {
				reject(err);
			})
			.on('end', () => {
				expect(fs.toJSON()).toMatchSnapshot();

				resolve();
			});
	});
}
