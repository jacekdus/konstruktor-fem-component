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
        if (typeof unboundedDisplacements === 'number') {
          this.matrix[index] = unboundedDisplacements;
        } else {
          this.matrix[index] = unboundedDisplacements.shift();
        }
      }
    });
  }

  getMatrix() {
    return this.matrix;
  }
}
