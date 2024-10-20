import {ConnectionPoint, Point, Rect} from '../types.ts';

const warning = document.getElementById(`warning`)
const errorStore:Array<string>= []

export function addError(str:string) {
	errorStore.push(str)
	const message:string = errorStore.reduce((acc, cur) => acc + cur + `, `, ``)
	if (warning) {
		warning.textContent = message;
	}
	console.error(message);
}

export function deleteError() {
	if (warning) {
		warning.textContent = ``;
	}
	errorStore.length = 0;
}

export const isPointOnRectEdge = (rect: Rect, point: Point): boolean => {
	const { position, size } = rect;
	const left = position.x - size.width / 2;
	const right = position.x + size.width / 2;
	const top = position.y - size.height / 2;
	const bottom = position.y + size.height / 2;

	const onVerticalEdge = (point.x === left || point.x === right) && point.y >= top && point.y <= bottom;
	const onHorizontalEdge = (point.y === top || point.y === bottom) && point.x >= left && point.x <= right;

	return onVerticalEdge || onHorizontalEdge;
};

export const isAnglePerpendicular = (rect: Rect, connection: ConnectionPoint): boolean => {
	const { position, size } = rect;
	const { point, angle } = connection;

	if (point.x === position.x - size.width / 2 && angle === 180) return true; // слева
	if (point.x === position.x + size.width / 2 && angle === 0) return true; // справа
	if (point.y === position.y - size.height / 2 && angle === 270) return true; // сверху
	if (point.y === position.y + size.height / 2 && angle === 90) return true; // снизу

	return false;
};

export const addOffsetPoint = (cPoint: ConnectionPoint): Point => {
	const { point, angle } = cPoint;

	if (angle === 0 || angle === 180) {
		const offsetX = angle === 0 ? 5 : -5;
		return { x: point.x + offsetX, y: point.y };
	} else {
		const offsetY = angle === 90 ? 5 : -5;
		return { x: point.x, y: point.y + offsetY };
	}
};

const dataConverter = (
	rect1: Rect,
	rect2: Rect,
	cPoint1: ConnectionPoint,
	cPoint2: ConnectionPoint
): Point[] => {
	if (!isPointOnRectEdge(rect1, cPoint1.point)) {
		console.log(rect1, cPoint1.point);
		addError("Точка подсоединения не лежит на грани прямоугольника 1")
	}
	if (!isPointOnRectEdge(rect2, cPoint2.point)) {

		addError("Точка подсоединения не лежит на грани прямоугольника 2");
	}

	if (!isAnglePerpendicular(rect1, cPoint1)) {
		console.log(rect1, cPoint1.point);
		addError("Угол подсоединения прямоугольника 1 не перпендикулярен или не направлен наружу");
	}
	if (!isAnglePerpendicular(rect2, cPoint2)) {
		addError("Угол подсоединения прямоугольника 2 не перпендикулярен или не направлен наружу");
	}

	const startPoint = cPoint1.point;
	const endPoint = cPoint2.point;

	const points: Point[] = [startPoint];

	const offsetPoint1 = addOffsetPoint(cPoint1);
	points.push(offsetPoint1);

	const offsetPoint2 = addOffsetPoint(cPoint2);

	if (offsetPoint1.y === offsetPoint2.y) {
		points.push({ x: offsetPoint2.x, y: offsetPoint1.y });
	} else if (offsetPoint1.x === offsetPoint2.x) {
		points.push({ x: offsetPoint1.x, y: offsetPoint2.y });
	} else {
		points.push({ x: offsetPoint1.x, y: (offsetPoint1.y + offsetPoint2.y) / 2 });
		points.push({ x: offsetPoint2.x, y: (offsetPoint1.y + offsetPoint2.y) / 2 });
	}

	points.push(offsetPoint2);
	points.push(endPoint);

	return points;
};


export default dataConverter;
