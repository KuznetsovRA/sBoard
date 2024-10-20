import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom', // Измените на 'jsdom' для поддержки DOM
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'js'],
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

export default config;
