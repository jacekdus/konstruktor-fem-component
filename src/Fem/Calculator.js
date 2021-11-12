import FemElement from "./FemElement";
import { matrix, zeros, multiply, inv, index, round, transpose } from 'mathjs';
import { steel } from "./Materials";
import CrossSection from "./CrossSection";
import { GlobalStiffnessMatrix } from './Matrix/GlobalStiffnessMatrix'
import { GlobalBoundaryMatrix } from "./Matrix/GlobalBoundaryMatrix";
import { GlobalForcesMatrix } from "./Matrix/GlobalForcesMatrix";
import { Model } from './../Model'

export default class FemCalculator {
	/**
	 * @param {Model} femModel
	 */
	constructor(femModel) {
		// this.nodes = [];
		// this.elements = [];
		this.femModel = femModel;
		this.precision = 3;
	}

	init() {
		// this.globalStiffnessMatrix = new GlobalStiffnessMatrix(this.nodes, this.elements)
		this.globalStiffnessMatrix = new GlobalStiffnessMatrix(this.femModel.nodes, this.femModel.elements)
		this.globalStiffnessMatrix.createNodeNumberGlobalIndexMap();
		this.globalStiffnessMatrix.createGlobalStiffnessMatrix();

		this.globalBoundaryMatrix = new GlobalBoundaryMatrix(this.femModel.boundaries, this.femModel.nodes)
		this.globalForcesMatrix = new GlobalForcesMatrix(this.femModel.loads, this.femModel.nodes)
	}

	calculate() {
		this._calculateDisplacementsMatrix();
		this._calculateReactionForces();
		this._calculateInnerForces();
	}


	// createGlobalBoundaryMatrix(matrix) {
	// 	this.globalBoundaryMatrix = matrix;
	// }

	// createGlobalForcesMatrix(matrix) {
	// 	this.globalForcesMatrix = matrix;
	// }

	// addNode(node) {
	// 	if (this._isNodeNumberAvailable(node.number)) {
	// 		this.nodes.push(node);
	// 	}
	// }

	// addElement(firstNode, secondNode) {
	// 	this.elements.push(new FemElement(steel, new CrossSection(0.00103), firstNode, secondNode))
	// }

	_calculateDisplacementsMatrix() {
		const subsetIndexes = [];

		this.globalBoundaryMatrix.get().forEach((value, i) => {
			if (value === 0) {
				subsetIndexes.push(i);
			}
		})
		
		const subsettedGlobalStiffnessMatrix = matrix(this.globalStiffnessMatrix.get()).subset(index(subsetIndexes, subsetIndexes)).toArray();
		const subsettedForcesMatrix = matrix(this.globalForcesMatrix.get()).subset(index(subsetIndexes));
		const displacements = multiply(inv(subsettedGlobalStiffnessMatrix), subsettedForcesMatrix).toArray();

		this.displacements = zeros(this.globalBoundaryMatrix.get().length).toArray();
		this.globalBoundaryMatrix.get().forEach( (value, i) => {
			if (value === 0) {
				this.displacements[i] = displacements.shift();
			}
		})
	}

	_calculateInnerForces() {
		//REFACTOR			
		this.femModel.elements.forEach(element => {

			const elementsGlobalIndexes = this.globalStiffnessMatrix.getElementsGlobalIndexes(element);

			const subsettedDisplacements = matrix(this.displacements).subset(index(elementsGlobalIndexes))
			const elementsLocalForces = multiply(transpose(inv(element.transformationMatrix)), multiply(element.globalStiffnessMatrix, subsettedDisplacements)).toArray();

			element.innerForces = elementsLocalForces;
		});
	}

	_calculateReactionForces() {
		this.globalReactionForcesMatrix = multiply(this.globalStiffnessMatrix.get(), this.displacements);
	}

	// _isNodeNumberAvailable(nodeNumber) {
	// 	this.nodes.forEach(node => {
	// 		if (node.number === nodeNumber) {
	// 			return false
	// 		}
	// 	});

	// 	return true;
	// }

	_consoleLogInnerForcesResults() {
		this.femModel.elements.forEach((element) => {
			console.log(round(element.innerForces, this.precision));
		})
	}

	log() {
		this._consoleLogInnerForcesResults();
		console.log(this.displacements)
		
	}
};
