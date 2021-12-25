import Two from 'two.js'


export class TwoGroups {
  supports = new Two.Group();
  nodes = new Two.Group();
  nodesLabels = new Two.Group();
  elements = new Two.Group();
  elementsLabels = new Two.Group();
  loads = new Two.Group();
  loadsLabels = new Two.Group();
  displacements = new Two.Group();
  displacementsLabels = new Two.Group();
  innerForces = new Two.Group();
  innerForcesLegend = new Two.Group();
  reactions = new Two.Group();
  reactionsLabels = new Two.Group();
  cursor = new Two.Group();
  cursorLabel = new Two.Group();
  other = new Two.Group();
  // nodesAndLabels = new Two.Group();
  // elementsAndLabels = new Two.Group();

  clear() {
    for (const prop in this) {
      if (this[prop] instanceof Two.Group) {
        this.clearChildrenInGroup(this[prop]);
      }
    }
  }

  private clearChildrenInGroup(group: any) {
    group.remove(group.children);
  }
}
