import { zeros, matrix, index } from 'mathjs';

export class GlobalStiffness {
  constructor(femNodes, femElements) {
    this.femNodes = femNodes;
    this.femElements = femElements
  }

	_initGlobalStiffnessMatrixWithZeros() {
		const valuesPerNode = 2;
		const len = valuesPerNode * this.femNodes.size;
		
		this.matrix = zeros(len, len).toArray();
	}

  createGlobalStiffnessMatrix() {
		this._initGlobalStiffnessMatrixWithZeros();

		this.femElements.forEach(element => {
			const globalIndex = this.nodeGlobalIndexMap.get(element.node1).concat(this.nodeGlobalIndexMap.get(element.node2))

			element.globalStiffnessMatrix.forEach((row, rowIndex) => {
				row.forEach((value, columnIndex) => {
					this.matrix[globalIndex[rowIndex]][globalIndex[columnIndex]] += value
				});
			});
		});
	}

	createNodeGlobalIndexMap() {
		this.nodeGlobalIndexMap = new Map();
		let index = 0;
		this.femNodes.forEach(node => {
			this.nodeGlobalIndexMap.set(node, [index, index + 1])
			index += 2;
		})
	}

  getElementsGlobalIndexes(element) {
		const temp = this._getGlobalIndexArray(element.node1);
		const elementsGlobalIndexes = temp.concat(this._getGlobalIndexArray(element.node2));
		
		return elementsGlobalIndexes;
	}

	_getGlobalIndexArray(node) {
		return this.nodeGlobalIndexMap.get(node);
	}

	getSubsettedMatrix(subsettedMatrixIndexes) {
		const result = matrix(this.matrix).subset(index(subsettedMatrixIndexes, subsettedMatrixIndexes));

		if (typeof result === 'number') {
			return result
		}

		return result.toArray();
	}

  getMatrix() {
    return this.matrix;
  }
}