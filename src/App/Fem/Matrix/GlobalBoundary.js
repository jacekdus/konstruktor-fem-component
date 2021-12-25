import { Boundary } from "../../Model";


export class GlobalBoundary {
  constructor(boundaries, nodes) {
    this.boundaries = new Map()
    this._fill(boundaries, nodes)
  }

  _fill(boundaries, nodes) {
    nodes.forEach((node, nodeId) => {
      if (boundaries.has(nodeId)) {
        const boundary = boundaries.get(nodeId)
        this.boundaries.set(nodeId, boundary)
      } else {
        this.boundaries.set(nodeId, new Boundary(false, false))
      }
    })
  }

  getMatrix() {
    const matrix = []
    this.boundaries.forEach(boundary => {
      
      matrix.push( + boundary.xFixed, + boundary.yFixed)
    });

    return matrix
  }

  getUnboundedMatrixIndexes() {
    const unboundedMatrixIndexes = []
    
    this.getMatrix().forEach((val, index) => {
      if (val === 0) {
        unboundedMatrixIndexes.push(index)
      }
    })

    return unboundedMatrixIndexes
  }

  getBoundedMatrixIndexes() {
    const boundedMatrixIndexes = []
    
    this.getMatrix().forEach((val, index) => {
      if (val !== 0) {
        boundedMatrixIndexes.push(index)
      }
    })

    return boundedMatrixIndexes
  }
}
