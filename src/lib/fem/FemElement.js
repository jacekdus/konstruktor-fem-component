import { calculateAngle, calculateLength, getTransformationMatrix } from "./Utils";
import { multiply, transpose } from 'mathjs';
import CrossSection from "./CrossSection";
import { Material } from './Materials';

export default class FemElement {
	/**
	* @param {Material} material
	* @param {CrossSection} crossSection
	* @param {Node} startNode 
	* @param {Node} endNode 
	*/
	constructor(material, crossSection, startNode, endNode) {
		this.material = material;
		this.crossSection = crossSection;
		this.startNode = startNode;
		this.endNode = endNode;
		this.length = calculateLength(this.startNode, this.endNode);
		this.angle = calculateAngle(this.startNode, this.endNode);
		this.transformationMatrix = getTransformationMatrix(this.angle);
		this.localStiffnessMatrix = this.createLocalStiffnessMatrix();
		this.globalStiffnessMatrix = this.createGlobalStiffnessMatrix();
		this.innerForces = [];
	}

	createLocalStiffnessMatrix() {
		return multiply(this.material.youngsModulus * this.crossSection.area
			/ this.length, [
			[1, 0, -1, 0],
			[0, 0, 0, 0],
			[-1, 0, 1, 0],
			[0, 0, 0, 0]
		]);
	}

	createGlobalStiffnessMatrix() {
		return multiply(
			multiply(
				transpose(this.transformationMatrix), this.localStiffnessMatrix
			),
			this.transformationMatrix
		)
	}
};
