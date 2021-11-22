import { zeros } from "mathjs";


export class GlobalDisplacements {
  constructor(length) {
    this.matrix = zeros(length).toArray();
  }

  /**
   * @param {Array} unboundedDisplacements 
   * @param {Array} boundaryArray 
   */
  addUnboundedDisplacements(unboundedDisplacements, boundaryArray) {
    boundaryArray.forEach((boundary, index) => {
      if (boundary === 0) {
        this.matrix[index] = unboundedDisplacements.shift();
      }
    });
  }

  getMatrix() {
    return this.matrix;
  }
}
