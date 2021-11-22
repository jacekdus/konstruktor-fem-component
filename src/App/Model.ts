import FemElement from "./Fem/FemElement";


export class Model {
  highestNodeId: number;
  highestElementId: number

  _nodes?: Map<number, Node>;
  _elements?: Map<number, Element | FemElement>;
  _boundaries?: Map<Node, Boundary>;
  _loads?: Map<Node, Load>;
  sections: Section[];
  materials: Material[];
  results?: {
    displacements?: Map<Node, Displacement>,
    // forces: Force[]
    // reactions: Reaction[]
  };

  constructor() {
    this.highestNodeId = 0;
    this.highestElementId = 0;

    this._nodes = new Map<number, Node>();
    this._elements = new Map<number, Element>();
    this._boundaries = new Map<Node, Boundary>();
    this._loads = new Map<Node, Load>();
    this.results = {
      displacements: undefined
    }
  }

  set nodes(nodes) {
    this._nodes = nodes
  }

  get nodes() {
    return this._nodes
  }

  set elements(elements: Map<number, Element | FemElement>) {
    this._elements = elements
  }

  get elements(): Map<number, Element | FemElement> {
    return this._elements
  }

  set boundaries(boundaries: Map<Node, Boundary>) {
    this._boundaries = boundaries
  }

  get boundaries(): Map<Node, Boundary> {
    return this._boundaries
  }

  set loads(loads: Map<Node, Load>)  {
    this._loads = loads
  }

  get loads(): Map<Node, Load> {
    return this._loads
  }

  setLoad(node: Node, load: Load) {
    this._loads.set(node, load)
  }

  setBoundary(node: Node, boundary: Boundary): void {
    this._boundaries.set(node, boundary)
  }

  setNode(node: Node): number {
    this.highestNodeId += 1;
    this._nodes.set(this.highestNodeId, node)

    return this.highestNodeId
  }

  deleteNode(nodeId: number) {
    if (this._nodes.has(nodeId)) {
      this._nodes.delete(nodeId)
    }
  }

  getNode(nodeId: number): Node {
    return this._nodes.get(nodeId)
  }

  setElement(element: Element): number {
    this.highestElementId += 1;
    this._elements.set(this.highestElementId, element)

    return this.highestElementId
  }

  deleteElement(elementId: number) {
    if (this._elements.has(elementId)) {
      this._elements.delete(elementId)
    }
  }

  getElement(elementId: number): Element {
    return this._elements.get(elementId)
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
