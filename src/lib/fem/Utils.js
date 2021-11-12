import FemNode from "./FemNode";

const sin = Math.sin;
const cos = Math.cos;
const atan = Math.atan;
const pow = Math.pow;

/** @param {number} angle in radians */
export const getTransformationMatrix = angle => [
	[cos(angle), sin(angle), 0, 0],
	[-sin(angle), cos(angle), 0, 0],
	[0, 0, cos(angle), sin(angle)],
	[0, 0, -sin(angle), cos(angle)]
];

/**
 * @param {FemNode} firstNode 
 * @param {FemNode} secondNode 
 */
export const calculateLength = (firstNode, secondNode) => {
	return pow(pow(secondNode.x - firstNode.x, 2) + pow(secondNode.y - firstNode.y, 2), 0.5);
}

/**
 * @param {FemNode} firstNode
 * @param {FemNode} secondNode 
 */
export const calculateAngle = (firstNode, secondNode) => {
	return atan((secondNode.y - firstNode.y) / (secondNode.x - firstNode.x));
}
