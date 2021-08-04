export default {
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testRegex: '.*\\.test\\.ts$',
	moduleFileExtensions: ['ts', 'js', 'json'],
	clearMocks: true,
};
