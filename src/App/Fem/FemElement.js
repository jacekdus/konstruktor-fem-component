import { calculateAngle, calculateLength, getTransformationMatrix } from "./Utils";
import { multiply, transpose } from 'mathjs';
import { Node, Section, Material } from "../Model";

export default class FemElement {
	/**
	* @param {Material} material
	* @param {Section} section
	* @param {Node} node1 
	* @param {Node} node2 
	*/
	constructor(material, section, node1, node2) {
		this.material = material;
		this.section = section;
		this.node1 = node1;
		this.node2 = node2;
		this.length = calculateLength(this.node1, this.node2);
		this.angle = calculateAngle(this.node1, this.node2);
		this.transformationMatrix = getTransformationMatrix(this.angle);
		this.localStiffnessMatrix = this.createLocalStiffnessMatrix();
		this.globalStiffnessMatrix = this.createGlobalStiffnessMatrix();
		this.innerForces = [];
	}

	createLocalStiffnessMatrix() {
		return multiply(this.material.youngsModulus * this.section.area
			/ this.length, [
			[ 1, 0, -1, 0],
			[ 0, 0,  0, 0],
			[-1, 0,  1, 0],
			[ 0, 0,  0, 0]
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
