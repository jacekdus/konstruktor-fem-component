import { zeros } from 'mathjs';

export class GlobalStiffnessMatrix {
  constructor(femNodes, femElements) {
    this.femNodes = femNodes;
    this.femElements = femElements
  }

	_initGlobalStiffnessMatrixWithZeros() {
		const valuesPerNode = 2;
		const len = valuesPerNode * this.femNodes.size;
		
		this.matrix = zeros(len, len).toArray();
		console.log(this.matrix)
	}

  createGlobalStiffnessMatrix() {
		this._initGlobalStiffnessMatrixWithZeros();

		this.femElements.forEach(element => {
			const globalIndex = this.nodeNumberGlobalIndexMap.get(element.node1).concat(this.nodeNumberGlobalIndexMap.get(element.node2))
			element.globalStiffnessMatrix.forEach((row, rowIndex) => {
				row.forEach((value, columnIndex) => {
					this.matrix[globalIndex[rowIndex]][globalIndex[columnIndex]] += value
				});
			});
		});
	}

	createNodeNumberGlobalIndexMap() {
		this.nodeNumberGlobalIndexMap = new Map();
		let index = 0;
		this.femNodes.forEach(node => {
			this.nodeNumberGlobalIndexMap.set(node, [index, index + 1])
			index += 2;
		})
	}

  getElementsGlobalIndexes(element) {
		const temp = this._getGlobalIndexArray(element.node1);
		const elementsGlobalIndexes = temp.concat(this._getGlobalIndexArray(element.node2));

		return elementsGlobalIndexes;
	}

	_getGlobalIndexArray(node) {

		return this.nodeNumberGlobalIndexMap.get(node);
	}

  get() {
    return this.matrix;
  }
}
