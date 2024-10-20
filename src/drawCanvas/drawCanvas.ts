import dataConverter, {addError, deleteError} from '../dataConverter/dataConverter.ts';
import {ConnectionPoint, Point, Rect} from '../types.ts';

export const drawRect = (ctx: CanvasRenderingContext2D, rect: Rect, isClose: boolean) => {
	ctx.beginPath();
	ctx.rect(
		rect.position.x - rect.size.width / 2,
		rect.position.y - rect.size.height / 2,
		rect.size.width,
		rect.size.height
	);

	ctx.strokeStyle = isClose ? 'red' : 'black';
	ctx.stroke();
};

export const drawLine = (ctx: CanvasRenderingContext2D, points: Point[]) => {
	if (points.length < 2) return;

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);

	for (let i = 1; i < points.length; i++) {
		ctx.lineTo(points[i].x, points[i].y);
	}

	ctx.stroke();
};

function settingCanvas(rects:Array<Rect>, canvasIn:HTMLCanvasElement) {
	let maxX = 0;
	let maxY = 0;

	rects.forEach((rect) => {
		const rectRight = rect.position.x + rect.size.width / 2;
		const rectBottom = rect.position.y + rect.size.height / 2;

		if (rectRight > maxX) maxX = rectRight;
		if (rectBottom > maxY) maxY = rectBottom;
	});

	canvasIn.width = maxX + 100;
	canvasIn.height = maxY + 100;
}


function checkRectOverlapOrProximity(rect1: Rect, rect2: Rect): boolean {
	const rect1Left = rect1.position.x - rect1.size.width / 2;
	const rect1Right = rect1.position.x + rect1.size.width / 2;
	const rect1Top = rect1.position.y - rect1.size.height / 2;
	const rect1Bottom = rect1.position.y + rect1.size.height / 2;

	const rect2Left = rect2.position.x - rect2.size.width / 2;
	const rect2Right = rect2.position.x + rect2.size.width / 2;
	const rect2Top = rect2.position.y - rect2.size.height / 2;
	const rect2Bottom = rect2.position.y + rect2.size.height / 2;

	const xOverlap = rect1Right >= rect2Left && rect1Left <= rect2Right;
	const yOverlap = rect1Bottom >= rect2Top && rect1Top <= rect2Bottom;

	if (xOverlap && yOverlap) {
		return true;
	}

	const xDistance = Math.max(0, Math.max(rect2Left - rect1Right, rect1Left - rect2Right));
	const yDistance = Math.max(0, Math.max(rect2Top - rect1Bottom, rect1Top - rect2Bottom));

	return xDistance < 5 && yDistance < 5;
}

function validateAngle(angle: number) {
	return angle % 90 === 0;
}

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const drawShapes = () => {
	deleteError();

	const getRectInputValues = (prefix: string):Rect => {
		return {
			position: {
				x: parseFloat((document.getElementById(`${prefix}X`) as HTMLInputElement).value),
				y: parseFloat((document.getElementById(`${prefix}Y`) as HTMLInputElement).value),
			},
			size: {
				width: parseFloat((document.getElementById(`${prefix}Width`) as HTMLInputElement).value),
				height: parseFloat((document.getElementById(`${prefix}Height`) as HTMLInputElement).value),
			}
		};
	};

	const getConnectionPointValues = (prefix: string):ConnectionPoint => {
		return {
			point: {
				x: parseFloat((document.getElementById(`${prefix}X`) as HTMLInputElement).value),
				y: parseFloat((document.getElementById(`${prefix}Y`) as HTMLInputElement).value),
			},
			angle: parseFloat((document.getElementById(`${prefix}Angle`) as HTMLInputElement).value),
		};
	};

	const rect1 = getRectInputValues('rect1');
	const rect2 = getRectInputValues('rect2');

	const cPoint1 = getConnectionPointValues('cPoint1');
	const cPoint2 = getConnectionPointValues('cPoint2');

	const areRectsOverlappingOrClose = checkRectOverlapOrProximity(rect1, rect2);
	if (areRectsOverlappingOrClose) addError(`Прямоугольники слишком близко`);

	if (!validateAngle(cPoint1.angle)) {
		addError("Угол точки присоединения 1 должен быть кратным 90");
	}
	if (!validateAngle(cPoint2.angle)) {
		addError("Угол точки присоединения 2 должен быть кратным 90");
	}

	const points = dataConverter(rect1, rect2, cPoint1, cPoint2);

	if (ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		settingCanvas([rect1, rect2], canvas);
		drawRect(ctx, rect1, areRectsOverlappingOrClose);
		drawRect(ctx, rect2, areRectsOverlappingOrClose);
		drawLine(ctx, points);
	}
};

const drawButton = document.getElementById('drawButton');

if (drawButton) {
	drawButton.addEventListener('click', drawShapes);
} else {
	addError('Кнопка с идентификатором drawButton не найдена.');
}

