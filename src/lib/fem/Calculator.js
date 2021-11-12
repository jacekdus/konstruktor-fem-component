import FemElement from "./FemElement";
import { matrix, zeros, multiply, inv, index, round, transpose } from 'mathjs';
import { steel } from "./Materials";
import CrossSection from "./CrossSection";
import { GlobalStiffnessMatrix } from './GlobalStiffnessMatrix'

export default class FemCalculator {
	constructor() {
		this.nodes = [];
		this.elements = [];
		this.precision = 3;
	}

	init() {
		this.globalStiffnessMatrix = new GlobalStiffnessMatrix(this.nodes, this.elements)
		this.globalStiffnessMatrix.createNodeNumberGlobalIndexMap();
		this.globalStiffnessMatrix.createGlobalStiffnessMatrix();
	}

	calculate() {
		this._calculateDisplacementsMatrix();
		this._calculateReactionForces();
		this._calculateInnerForces();
	}

	createGlobalBounduaryMatrix(matrix) {
		this.globalBounduaryMatrix = matrix;
	}

	createGlobalForcesMatrix(matrix) {
		this.globalForcesMatrix = matrix;
	}

	addNode(node) {
		if (this._isNodeNumberAvailable(node.number)) {
			this.nodes.push(node);
		}
	}

	addElement(firstNode, secondNode) {
		this.elements.push(new FemElement(steel, new CrossSection(0.00103), firstNode, secondNode))
	}

	_calculateDisplacementsMatrix() {
		const subsetIndexes = [];

		this.globalBounduaryMatrix.forEach((value, i) => {
			if (value === 0) {
				subsetIndexes.push(i);
			}
		})

		const subsettedGlobalStiffnessMatrix = matrix(this.globalStiffnessMatrix.get()).subset(index(subsetIndexes, subsetIndexes)).toArray();
		const subsettedForcesMatrix = matrix(this.globalForcesMatrix).subset(index(subsetIndexes));
		const displacements = multiply(inv(subsettedGlobalStiffnessMatrix), subsettedForcesMatrix).toArray();

		this.displacements = zeros(this.globalBounduaryMatrix.length).toArray();
		this.globalBounduaryMatrix.forEach( (value, i) => {
			if (value === 0) {
				this.displacements[i] = displacements.shift();
			}
		})
	}

	_calculateInnerForces() {
		//REFACTOR
		this.elements.forEach(element => {
			const elementsGlobalIndexes = this.globalStiffnessMatrix.getElementsGlobalIndexes(element);

			const subsettedDisplacements = matrix(this.displacements).subset(index(elementsGlobalIndexes))
			const elementsLocalForces = multiply(transpose(inv(element.transformationMatrix)), multiply(element.globalStiffnessMatrix, subsettedDisplacements)).toArray();

			element.innerForces = elementsLocalForces;
		});
	}

	_calculateReactionForces() {
		this.globalReactionForcesMatrix = multiply(this.globalStiffnessMatrix.get(), this.displacements);
	}

	_isNodeNumberAvailable(nodeNumber) {
		this.nodes.forEach(node => {
			if (node.number === nodeNumber) {
				return false
			}
		});

		return true;
	}

	_consoleLogInnerForcesResults() {
		this.elements.forEach((element) => {
			console.log(round(element.innerForces, this.precision));
		})
	}

	log() {
		this._consoleLogInnerForcesResults();
		console.log(this.displacements)
	}
};
