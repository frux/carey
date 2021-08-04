import { assertMigration } from '../helpers';

describe('Actions', () => {
	describe('move', () => {
		test('should rename file', () => assertMigration(
			{
				foo: {
					'bar.txt': 'test',
				},
			},
			({ move }) => ([
				{
					with: '/foo/bar.txt',
					do: [
						move('/foo/baz.txt'),
					],
				},
			]),
		));

		// Skipped because of https://github.com/streamich/memfs/issues/397
		test.skip('should move file', () => assertMigration(
			{
				foo: {
					'bar.txt': 'test',
				},
			},
			({ move }) => ([
				{
					with: '/foo/bar.txt',
					do: [
						move('/bar.tsx'),
					],
				},
			]),
		));
	});
});
