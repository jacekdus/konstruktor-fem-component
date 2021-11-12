import { zeros } from 'mathjs';

export class GlobalStiffnessMatrix {
  constructor(femNodes, femElements) {
    this.femNodes = femNodes;
    this.femElements = femElements
  }

	_initGlobalStiffnessMatrixWithZeros() {
		const valuesPerNode = 2;
		const len = valuesPerNode * this.femNodes.length;
		this.matrix = zeros(len, len).toArray();
	}

  createGlobalStiffnessMatrix() {
		this._initGlobalStiffnessMatrixWithZeros();

		this.femElements.forEach(element => {
			const globalIndex = this.nodeNumberGlobalIndexMap.get(element.startNode.number).concat(this.nodeNumberGlobalIndexMap.get(element.endNode.number))
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
			this.nodeNumberGlobalIndexMap.set(node.number, [index, index + 1])
			index += 2;
		})
	}

  getElementsGlobalIndexes(element) {
		const temp = this._getGlobalIndexArray(element.startNode.number);
		const elementsGlobalIndexes = temp.concat(this._getGlobalIndexArray(element.endNode.number));
		
		return elementsGlobalIndexes;
	}

	_getGlobalIndexArray(nodeNumber) {
		return this.nodeNumberGlobalIndexMap.get(nodeNumber);
	}

  get() {
    return this.matrix;
  }
}
