import { Load } from "../../Model";
import { matrix, index } from "mathjs";


export class GlobalForces {
  constructor(forces, nodes) {
    this.forces = new Map()
    this._fill(forces, nodes)
  }

  _fill(forces, nodes) {
    nodes.forEach(node => {
      if (forces.has(node)) {
        const force = forces.get(node)

        this.forces.set(node, force)
      } else {
        this.forces.set(node, new Load(0, 0))
      }
    })
  }

  getMatrix() {
    const matrix = []
    this.forces.forEach(force => {
      matrix.push(force.fx, force.fy)
    }) 

    return matrix
  }

  getSubsettedMatrix(subsettedMatrixIndexes) {
    return matrix(this.getMatrix()).subset(index(subsettedMatrixIndexes));
  }
}
