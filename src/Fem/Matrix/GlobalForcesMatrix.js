export class GlobalForcesMatrix {
  constructor(forces, nodes) {
    this.matrix = this._create(forces, nodes)
  }

  _create(forces, nodes) {
    let matrix = [];
    nodes.forEach(node => {
      if (forces.has(node)) {
        const force = forces.get(node);

        matrix = matrix.concat([force.fx, force.fy]);
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
