import { matrix, multiply, inv, index, round, transpose } from 'mathjs';
import { GlobalStiffness } from './Matrix/GlobalStiffness'
import { GlobalBoundary } from './Matrix/GlobalBoundary';
import { GlobalForces } from "./Matrix/GlobalForces";
import { Model, Displacement } from '../Model'
import { Fem } from './Fem';
import { GlobalDisplacements } from './Matrix/GlobalDisplacement';
import { results } from './Results';


export default class FemCalculator {
	/**
	 * @param {Model} femModel
	 */
	constructor(femModel) {
		this.femModel = femModel;
		this.precision = 3;
	}

	init() {
		this.globalStiffness = new GlobalStiffness(this.femModel.nodes, this.femModel.elements);
		this.globalStiffness.createNodeGlobalIndexMap();
		this.globalStiffness.createGlobalStiffnessMatrix();

		this.globalBoundary = new GlobalBoundary(this.femModel.boundaries, this.femModel.nodes);
		this.globalForces = new GlobalForces(this.femModel.loads, this.femModel.nodes);
	}

	calculate() {
		this._calculateDisplacementsMatrix();
		this._calculateReactionForces();
		this._calculateInnerForces();
	}

	_calculateDisplacementsMatrix() {
		const unboundedMatrixIndexes = this.globalBoundary.getUnboundedMatrixIndexes();

		const unboundedGlobalStiffnessMatrix = this.globalStiffness.getSubsettedMatrix(unboundedMatrixIndexes);
		const unboundedForcesMatrix = this.globalForces.getSubsettedMatrix(unboundedMatrixIndexes);
		const unboundedDisplacements = Fem.calculateDisplacements(unboundedGlobalStiffnessMatrix, unboundedForcesMatrix);

		const displacements = new GlobalDisplacements(this.globalBoundary.getMatrix().length);
		displacements.addUnboundedDisplacements(unboundedDisplacements, this.globalBoundary.getMatrix());

		this.displacements = displacements.getMatrix();

		results.displacements = new Map();
		this.femModel.nodes.forEach((node, index) => {
			results.displacements.set(node, new Displacement(this.displacements[2 * (index - 1)], this.displacements[2 * (index - 1) + 1]));
		})
	}

	_calculateInnerForces() {
		//REFACTOR			
		this.femModel.elements.forEach(element => {

			const elementsGlobalIndexes = this.globalStiffness.getElementsGlobalIndexes(element);

			const subsettedDisplacements = matrix(this.displacements).subset(index(elementsGlobalIndexes))
			const elementsLocalForces = multiply(transpose(inv(element.transformationMatrix)), multiply(element.globalStiffnessMatrix, subsettedDisplacements)).toArray();
			console.log(elementsGlobalIndexes)
			console.log(subsettedDisplacements)
			console.log(elementsLocalForces)
			element.innerForces = elementsLocalForces;
		});
	}

	_calculateReactionForces() {
		this.globalReactionForcesMatrix = multiply(this.globalStiffness.getMatrix(), this.displacements);
	}

	_consoleLogInnerForcesResults() {
		this.femModel.elements.forEach((element) => {
			console.log(round(element.innerForces, this.precision));
		})
	}

	getResults() {
		return results;
	}

	log() {
		// this._consoleLogInnerForcesResults();
		// console.log(this.displacements);
		// console.log(this.getResults());
	}
};
