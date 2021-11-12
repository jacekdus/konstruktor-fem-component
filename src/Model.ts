import FemElement from "./Fem/FemElement";

export class Model {
  nodes?: Map<number, Node>;
  elements?: Map<number, Element | FemElement>;
  boundaries?: Map<Node, Boundary>;
  loads?: Map<Node, Load>;
  sections: Section[];
  materials: Material[];
  results?: {
    displacements: Map<Node, Displacement>,
    // forces: Force[]
    // reactions: Reaction[]
  }
}

export class Node {
  constructor(
    public x: number, 
    public y: number
  ) {}
}

export class Boundary {
  constructor(
    public xFixed: boolean,
    public yFixed: boolean
  ) {}
}

export class Force {
  constructor(
    public fx: number,
    public fy: number
  ) {}
}

export class Load extends Force {}

export class Reaction extends Force {}

export class Material {
  constructor(
    public name: string,
    public youngsModulus: number
  ) {}
}

export class Section {
  constructor(
    public name: string,
    public area: number
  ) {}
}

export class Element {
  constructor(
    public node1: Node,
    public node2: Node,
    public section: Section,
    public material: Material
  ) {}
}

export class Displacement {
  constructor(
    public dx: number,
    public dy: number
  ) {};
}
