import { JsonModel, modelToJsonModel } from "../utils";
import FemElement from "./Fem/FemElement";


export class Model {
  highestNodeId: number;
  highestElementId: number

  _nodes: Map<number, Node>;
  _elements: Map<number, Element>;
  _boundaries: Map<number, Boundary>;
  _loads: Map<number, Load>;
  sections: Section[];
  materials: Material[];
  results?: {
    displacements?: Map<number, Displacement>,
    innerForces?: Map<number, number>
    reactions?: Map<number, Reaction>
  };
  
  _femElements: Map<number, FemElement>;

  constructor() {
    this.highestNodeId = 0;
    this.highestElementId = 0;

    this._nodes = new Map<number, Node>();
    this._elements = new Map<number, Element>();
    this._boundaries = new Map<number, Boundary>();
    this._loads = new Map<number, Load>();
    this.sections = [];
    this.materials = [];
    this.results = {
      displacements: undefined,
      innerForces: undefined,
      reactions: undefined
    };

    this._femElements = new Map<number, FemElement>();
  }

  get nodes() {
    return this._nodes
  }

  set elements(elements: Map<number, Element>) {
    this._elements = elements
  }

  get elements(): Map<number, Element> {
    return this._elements
  }

  set boundaries(boundaries: Map<number, Boundary>) {
    this._boundaries = boundaries
  }

  get boundaries(): Map<number, Boundary> {
    return this._boundaries
  }

  set loads(loads: Map<number, Load>)  {
    this._loads = loads
  }

  get loads(): Map<number, Load> {
    return this._loads
  }

  get femElements(): Map<number, FemElement> {
    return this._femElements;
  }

  setLoad(nodeId: number, load: Load) {
    this._loads.set(nodeId, load)
  }

  setBoundary(nodeId: number, boundary: Boundary): void {
    this._boundaries.set(nodeId, boundary)
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

  setFemElement(femElement: FemElement, elementId: number) {
    this._femElements.set(elementId, femElement);
  }

  deleteElement(elementId: number) {
    if (this._elements.has(elementId)) {
      this._elements.delete(elementId)
    }
  }

  getElement(elementId: number): Element {
    return this._elements.get(elementId)
  }

  getJsonModel(): JsonModel {
    return modelToJsonModel(this);
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
    public youngsModulus: number,
    public resistance: number
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
    public node1Id: number,
    public node2Id: number,
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
