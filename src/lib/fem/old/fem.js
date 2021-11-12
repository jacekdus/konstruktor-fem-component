import { multiply, inv, pow, transpose } from 'mathjs';

const sin = Math.sin;
const cos = Math.cos;
const atan = Math.atan

const transformationMatrix = (a) => [
	[ cos(a), sin(a),  0, 		 0			],
	[-sin(a), cos(a),  0, 		 0			],
	[ 0,      0,			 cos(a), sin(a) ],
	[	0,			0,		 	-sin(a), cos(a) ]
]

class Node {
  constructor(x, y, number) {
    this.x = x; // [m]
		this.y = y; // [m]
		this.number = number;
  }
}

class Element {
  constructor(E, A, n1, n2) {
		// Young modulus [kPa]
		this.E = E;
		
		// Cross section area [m2]
		this.A = A;
		
		// Node 1 - elements beginning
		this.n1 = n1;
		
		// Node 2 - elements end
		this.n2 = n2;
	}

	calc() {
		// Elements tilt angle [rad]
		this.angle = atan((this.n2.y - this.n1.y) / (this.n2.x - this.n1.x));

		// Transformation matrix to global coordinate system
		this.transformationMatrix = transformationMatrix(this.angle);
		
		// Elements length - calculates from nodes 1 and 2 coordinates
		this.L = pow(pow(this.n2.x - this.n1.x, 2) + pow(this.n2.y - this.n1.y, 2), 0.5);
		
		// Elements stiffness matrix in local coordinate system
		this.sMatrixLoc = multiply(this.E * this.A / this.L ,[
		[ 1, 0, -1, 0],
		[ 0, 0,  0, 0],
		[-1, 0,  1, 0],
		[ 0, 0,  0, 0],
		]);

		// Elements stiffness matrix in global coordinate system
		this.sMatrixGlob = multiply(multiply(transpose(this.transformationMatrix), this.sMatrixLoc), this.transformationMatrix)
	}
}

export class Model {
	constructor() {
		this.nodes = [];
		this.elements = [];
		this.lastNodeNumber = 0;
	}

	createNode(x, y, number = undefined) {
		const node = new Node(x, y , number);

		if (!node.number) {
			this.lastNodeNumber += 1;
			node.number = this.lastNodeNumber;
		} else {
			if (node.number > this.lastNodeNumber) {
				this.lastNodeNumber = number;
			}
		}

		this.nodes.push(node);
	}

	createElement(E, A, n1, n2) {
		const element = new Element(E, A, n1, n2)
		this.elements.push(element);
	}

	changeNodeNumber(oldNumber, newNumber) {
		if(this.nodeNumberAvailable(newNumber)) {
			this.getNode(oldNumber).number = newNumber
			if (newNumber > this.lastNodeNumber) {
				this.lastNodeNumber = newNumber;
			}
		} else {
			console.error('Node number not available');
		}
	}

	// Given node number returns existing node or undefined
	getNode(nodeNumber) {
		return this.nodes.find((node) => node.number === nodeNumber)
	}

	getElement(elementNumber) {
		return this.elements.find((element) => element.number === elementNumber)
	}

	nodeNumberAvailable(nodeNumber) {
		return this.getNode(nodeNumber) === undefined;
	}

	// Calculates models global stifness matrix
	calc() {
		const elements = this.elements;

		const mapp = (n1, n2) => {
			return [n1 ]
		}

		elements.forEach(element => {

		})
	}

	// calc() {

	// 	const createMap = () => {
	// 		const map = new Map();
	// 		let i = 0;
	// 		this.nodes.forEach(node => {
	// 			map.set(node.number, [ i, i+1 ]);
	// 			i += 2;
	// 		});

	// 		return map;
	// 	}

	// 	const map = () => {
	// 		const map = new Map();
	// 		let i = 0;
	// 		this.nodes.forEach(node => {
	// 			map.set(node.number, [ i, i+1 ]);
	// 			i += 2;
	// 		});

	// 		return map;
	// 	}

	// 	this.sMatrixGlob = () => {
	// 		const globalMatrixLength = this.nodes.length * 2;
	// 		const emptyMatrix = new Array(globalMatrixLength);

	// 		for(let i = 0; i < globalMatrixLength; i++) {
	// 			emptyMatrix.push(new Array(globalMatrixLength));
	// 		}

	// 		return emptyMatrix;
	// 	};

	// 	this.elements.forEach(element => {
	// 		for (let i = 0; i < 4; i++) {
	// 			for (let j = 0; j < 4; j++) {
	// 				const nodes = [element.n1, element.n2];
	// 				const bounduary = map.get(nodes[0].number)

	// 			}
	// 		}
	// 	})
	// }
}

export class Fem {

	static test() {
    const model = new Model();
    model.createNode(0, 0, 1);
    model.createNode(0, 2, 2);
    model.createNode(1, 1, 3);
    model.createElement(205000000, 0.116, model.getNode(1), model.getNode(2));
    model.createElement(205000000, 0.116, model.getNode(2), model.getNode(3));
    model.createElement(205000000, 0.116, model.getNode(3), model.getNode(1));
    console.log(model.nodes);
    model.changeNodeNumber(1, 5);
    console.log(model.nodes);
	}
}