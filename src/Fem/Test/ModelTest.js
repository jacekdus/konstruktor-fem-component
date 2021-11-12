import { model } from '../../exampleModel'
import FemCalculator from '../Calculator';
import { getFemModel } from '../Model';

export function start() {
	Test2();
}

function Test2() {

	const femModel = getFemModel(model)
	// console.log(femModel)


	// const node1 = new FemNode(1, 0.0, 0.0);
	// const node2 = new FemNode(2, 5.0, 0.0);
	// const node3 = new FemNode(3, 10.0, 0.0);
	// const node4 = new FemNode(4, 15.0, 0.0);
	// const node5 = new FemNode(5, 0.0, 5.0);
	// const node6 = new FemNode(6, 5.0, 5.0);
	// const node7 = new FemNode(7, 10.0, 5.0);

	// calculator.addNode(node1);
	// calculator.addNode(node2);
	// calculator.addNode(node3);
	// calculator.addNode(node4);
	// calculator.addNode(node5);
	// calculator.addNode(node6);
	// calculator.addNode(node7);

	// calculator.addElement(node1, node2);
	// calculator.addElement(node2, node3);
	// calculator.addElement(node3, node4);
	// calculator.addElement(node5, node2);
	// calculator.addElement(node6, node3);
	// calculator.addElement(node7, node4);
	// calculator.addElement(node5, node6);
	// calculator.addElement(node6, node7);
	// calculator.addElement(node5, node1);
	// calculator.addElement(node6, node2);
	// calculator.addElement(node7, node3);

	// const globalBounduary = [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
	// const globalForces = [0, 0, 0, 0, 0, 0, 0, -100, 0, 0, 0, 0, -50, -50];

  const calculator = new FemCalculator(femModel);

	// assemble(calculator, globalBounduary, globalForces);
	// assemble(calculator);
	
	calculator.init();
	calculator.calculate();

	calculator.log();
}

// function assemble() {
// 	calculator.init();

// 	// calculator.createGlobalBounduaryMatrix(globalBoundary);
// 	// calculator.createGlobalForcesMatrix(globalForces);

// 	calculator.calculate();
// 	calculator.log();
// }
