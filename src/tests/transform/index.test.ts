import path from 'path';
import { assertMigration } from '../helpers';

describe('Actions', () => {
	describe('transform', () => {
		test('should transform file', () => assertMigration(
			{
				'foo.js': 'console.log(\'bar\');',
			},
			({ transform }) => ([
				{
					with: '/foo.js',
					do: [
						transform(path.resolve(__dirname, './fixtures/1.js')),
					],
				},
			]),
		));
	});
});
