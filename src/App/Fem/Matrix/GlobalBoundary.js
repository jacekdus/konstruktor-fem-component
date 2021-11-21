import { Boundary } from "../../Model";


export class GlobalBoundary {
  constructor(boundaries, nodes) {
    this.boundaries = new Map()
    this._fill(boundaries, nodes)
  }

  _fill(boundaries, nodes) {
    nodes.forEach(node => {
      if (boundaries.has(node)) {
        const boundary = boundaries.get(node)
        this.boundaries.set(node, boundary)
      } else {
        this.boundaries.set(node, new Boundary(false, false))
      }
    })
  }

  getMatrix() {
    const matrix = []
    this.boundaries.forEach(boundary => {
      matrix.push( + boundary.xFixed, + boundary.yFixed)
    }) 

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
