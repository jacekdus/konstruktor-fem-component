import { Node } from "../Model";

const sin = Math.sin;
const cos = Math.cos;
const atan = Math.atan;
const pow = Math.pow;

/** @param {number} angle in radians */
export const getTransformationMatrix = angle => [
	[ cos(angle), sin(angle), 0, 0],
	[-sin(angle), cos(angle), 0, 0],
	[0, 0,  cos(angle), sin(angle)],
	[0, 0, -sin(angle), cos(angle)]
];

/**
 * @param {Node} firstNode 
 * @param {Node} secondNode 
 */
export const calculateLength = (firstNode, secondNode) => {
	return pow(pow(secondNode.x - firstNode.x, 2) + pow(secondNode.y - firstNode.y, 2), 0.5);
}

/**
 * @param {Node} firstNode
 * @param {Node} secondNode 
 */
export const calculateAngle = (firstNode, secondNode) => {
	return Math.atan2(secondNode.y - firstNode.y, secondNode.x - firstNode.x);
}
