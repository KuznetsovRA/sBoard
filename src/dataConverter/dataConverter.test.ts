import { isAnglePerpendicular, addOffsetPoint } from './dataConverter';
import { Rect, ConnectionPoint } from '../types';

describe('Data Converter Functions', () => {
	const rect1: Rect = {
		position: { x: 0, y: 0 },
		size: { width: 10, height: 10 },
	};

	const rect2: Rect = {
		position: { x: 20, y: 0 },
		size: { width: 10, height: 10 },
	};

	const cPoint1: ConnectionPoint = {
		point: { x: -5, y: 0 },
		angle: 180,
	};

	const cPoint2: ConnectionPoint = {
		point: { x: 25, y: 0 },
		angle: 0,
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('isAnglePerpendicular should return true for correct angle', () => {
		expect(isAnglePerpendicular(rect1, cPoint1)).toBe(true);
		expect(isAnglePerpendicular(rect2, cPoint2)).toBe(true);
	});

	test('isAnglePerpendicular should return false for incorrect angle', () => {
		const cPointInvalid: ConnectionPoint = { point: { x: 0, y: 5 }, angle: 45 };
		expect(isAnglePerpendicular(rect1, cPointInvalid)).toBe(false);
	});

	test('addOffsetPoint should return offset point for angle 0', () => {
		const offsetPoint = addOffsetPoint(cPoint2);
		expect(offsetPoint).toEqual({ x: 30, y: 0 }); // 25 + 5
	});

	test('addOffsetPoint should return offset point for angle 180', () => {
		const offsetPoint = addOffsetPoint(cPoint1);
		expect(offsetPoint).toEqual({ x: -10, y: 0 }); // -5 - 5
	});
});
