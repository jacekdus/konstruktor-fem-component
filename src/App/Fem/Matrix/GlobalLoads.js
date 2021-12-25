import { Load } from "../../Model";
import { matrix, index } from "mathjs";


export class GlobalLoads {
  constructor(loads, nodes) {
    this.loads = new Map()
    this._fill(loads, nodes)
  }

  _fill(loads, nodes) {
    nodes.forEach((node, nodeId) => {
      if (loads.has(nodeId)) {
        const load = loads.get(nodeId)

        this.loads.set(nodeId, load)
      } else {
        this.loads.set(nodeId, new Load(0, 0))
      }
    })
  }

  getMatrix() {
    const matrix = []
    this.loads.forEach(load => {
      matrix.push(load.fx, load.fy)
    }) 

    return matrix
  }

  getSubsettedMatrix(subsettedMatrixIndexes) {
    return matrix(this.getMatrix()).subset(index(subsettedMatrixIndexes));
  }
}
