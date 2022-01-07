import { matrix, multiply, index, round, subtract } from 'mathjs';
import { GlobalStiffness } from './Matrix/GlobalStiffness'
import { GlobalBoundary } from './Matrix/GlobalBoundary';
import { GlobalLoads } from "./Matrix/GlobalLoads";
import { Model, Displacement, Reaction } from '../Model'
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
		this.globalStiffness = new GlobalStiffness(this.femModel.nodes, this.femModel.femElements);
		this.globalStiffness.createNodeGlobalIndexMap();
		this.globalStiffness.createGlobalStiffnessMatrix();

		this.globalBoundary = new GlobalBoundary(this.femModel.boundaries, this.femModel.nodes);
		this.globalLoads = new GlobalLoads(this.femModel.loads, this.femModel.nodes);
	}

	calculate() {
		this._calculateDisplacementsMatrix();
		this._calculateInnerForces();
		this._calculateReactionForces();
	}

	_calculateDisplacementsMatrix() {
		const unboundedMatrixIndexes = this.globalBoundary.getUnboundedMatrixIndexes();

		const unboundedGlobalStiffnessMatrix = this.globalStiffness.getSubsettedMatrix(unboundedMatrixIndexes);
		const unboundedForcesMatrix = this.globalLoads.getSubsettedMatrix(unboundedMatrixIndexes);
		const unboundedDisplacements = Fem.calculateDisplacements(unboundedGlobalStiffnessMatrix, unboundedForcesMatrix);

		const displacements = new GlobalDisplacements(this.globalBoundary.getMatrix().length);
		displacements.addUnboundedDisplacements(unboundedDisplacements, this.globalBoundary.getMatrix());

		this.displacements = displacements.getMatrix();

		results.displacements = new Map();
		this.femModel.nodes.forEach((node, index) => {
			results.displacements.set(index, new Displacement(this.displacements[2 * (index - 1)], this.displacements[2 * (index - 1) + 1]));
		})
	}

	_calculateInnerForces() {
		results.innerForces = new Map();

		this.femModel.femElements.forEach((element, id) => {
			const elementsGlobalIndexes = this.globalStiffness.getElementsGlobalIndexes(element);
			
			const subsettedDisplacements = matrix(this.displacements).subset(index(elementsGlobalIndexes));

			const elementsLocalForces = multiply(
				element.localStiffnessMatrix,
				multiply(
					element.transformationMatrix,
					subsettedDisplacements
				)
			).toArray();

			const localForce = elementsLocalForces[2] // for [2] tension with +, for [0] with -

			results.innerForces.set(id, localForce);
		});
	}

	_calculateReactionForces() {
		const forces = this.globalForcesMatrix = multiply(this.globalStiffness.getMatrix(), this.displacements);
		const reactions = subtract(forces, this.globalLoads.getMatrix());

		results.reactions = new Map();
		this.femModel.nodes.forEach((node, index) => {
			const rfx = this._roundToThreeDecimalPlaces(reactions[2 * (index - 1)]);
			const rfy = this._roundToThreeDecimalPlaces(reactions[2 * (index - 1) + 1]);

			if (rfx !== 0 || rfy !== 0) {
				results.reactions.set(index, new Reaction(rfx, rfy));
			}
		})
	}

	_roundToThreeDecimalPlaces(value) {
		return Math.round(value * 1000) / 1000; 
	}

	_consoleLogInnerForcesResults() {
		this.femModel.femElements.forEach((element) => {
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
