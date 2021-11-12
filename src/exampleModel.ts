import { Material } from './Fem/Materials';
import { Model, Node, Element, Boundary, Load, Displacement, Section } from './Model';

export const model = new Model();

model.nodes = new Map([
  [1, new Node(5 + 0,  0)],
  [2, new Node(5 + 5,  0)],
  [3, new Node(5 + 10, 0)],
  [4, new Node(5 + 15, 0)],
  [5, new Node(5 + 0,  5)],
  [6, new Node(5 + 5,  5)],
  [7, new Node(5 + 10, 5)]
])

const section = new Section('HEA 100', 0.00212)
const material = new Material('Steel', 210000000000.0)
model.sections = [ section ];
model.materials = [ material ]

model.elements = new Map([
  [1 , new Element(model.nodes.get(1), model.nodes.get(2), section, material)],
  [2 , new Element(model.nodes.get(2), model.nodes.get(3), section, material)],
  [3 , new Element(model.nodes.get(3), model.nodes.get(4), section, material)],
  [4 , new Element(model.nodes.get(5), model.nodes.get(2), section, material)],
  [5 , new Element(model.nodes.get(6), model.nodes.get(3), section, material)],
  [6 , new Element(model.nodes.get(7), model.nodes.get(4), section, material)],
  [7 , new Element(model.nodes.get(5), model.nodes.get(6), section, material)],
  [8 , new Element(model.nodes.get(6), model.nodes.get(7), section, material)],
  [9 , new Element(model.nodes.get(5), model.nodes.get(1), section, material)],
  [10, new Element(model.nodes.get(6), model.nodes.get(2), section, material)],
  [11, new Element(model.nodes.get(7), model.nodes.get(3), section, material)]
])

model.boundaries = new Map([
  [model.nodes.get(1), new Boundary(true, true)],
  [model.nodes.get(5), new Boundary(true, false)]
])

model.loads = new Map([
  [model.nodes.get(4), new Load(0, -100)],
  [model.nodes.get(7), new Load(-50, -50)]
])

model.results = {
  displacements: new Map([
    [model.nodes.get(1), new Displacement( 0.0000,  0.0000)],
    [model.nodes.get(2), new Displacement(-0.0045, -0.0093)],
    [model.nodes.get(3), new Displacement(-0.0073, -0.0253)],
    [model.nodes.get(4), new Displacement(-0.0084, -0.0413)],
    [model.nodes.get(5), new Displacement( 0.0000,  0.0000)],
    [model.nodes.get(6), new Displacement( 0.0022, -0.0109)],
    [model.nodes.get(7), new Displacement( 0.0028, -0.0269)]
  ])
}
