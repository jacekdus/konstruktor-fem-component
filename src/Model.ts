export class Model {
  nodes: Node[] = [];
  elements: Element[] = [];
  boundaries: Boundary[] = [];
  loads: Load[] = [];
  results: {
    displacements: Displacement[],
    // forces: Force[]
    // reactions: Reaction[]
  }
  // geometry: Geometry[];
  // materials: Reaction[];
}

export class Node {
  constructor(
    public x: number, 
    public y: number,
    public opts?: { id: string }
  ) {}
}

export class Boundary {
  constructor(
    public node: Node,
    public xFixed: boolean,
    public yFixed: boolean
  ) {}
}

export class Force {
  constructor(
    public node: Node,
    public fx: number,
    public fy: number
  ) {}
}

export class Load extends Force {}

export class Reaction extends Force {}

export class Material {
  elements: Element[];
  youngsModulus: number;
}

export class Geometry {
  public elements: Element[];
  public crossSectionArea: number;
}

export class Element {
  constructor(
    public node1: Node,
    public node2: Node, 
    public opts?: { id: number }
  ) {}
}

export class Displacement {
  constructor(
    public node: Node,
    public dx: number,
    public dy: number
  ) {};
}
