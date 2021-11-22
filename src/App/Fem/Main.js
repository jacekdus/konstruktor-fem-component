import FemCalculator from './Calculator';
import { getFemModel } from './Model';

export class Main {
	constructor(model) {
		this.calculator = new FemCalculator(getFemModel(model))
		this.calculator.init();
	}

	calculate() {
		this.calculator.calculate();
		// this.calculator.log();
	}

	getDisplacements() {
		return this.calculator.getResults().displacements;
	}
}
