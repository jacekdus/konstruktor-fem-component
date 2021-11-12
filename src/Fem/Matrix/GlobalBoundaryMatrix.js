export class GlobalBoundaryMatrix {
  constructor(boundaries, nodes) {
    this.matrix = this._create(boundaries, nodes)
  }

  _create(boundaries, nodes) {
    let matrix = [];
    nodes.forEach(node => {
      if (boundaries.has(node)) {
        const boundary = boundaries.get(node);

        matrix = matrix.concat([ + boundary.xFixed, + boundary.yFixed]);
      } else {
        matrix = matrix.concat([0, 0]);
      }
    });

    return matrix
  }

  get() {
    return this.matrix
  }
}
