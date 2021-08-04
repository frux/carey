/* eslint-disable quotes */
import { assertMigration } from '../helpers';

describe('Actions', () => {
	describe('transform', () => {
		test('should transform file', () => assertMigration(
			{
				'foo.js': `console.log('bar');`,
			},
			({ transform }) => ([
				{
					with: '/foo.js',
					do: [
						transform(() => `console.log('baz');`),
					],
				},
			]),
		));
	});
});
