import { Model, Node, Element, Boundary, Load, Displacement } from './Model';

export const model = new Model();

const n1 = new Node(5 + 0, 0, { id: '1' });
const n2 = new Node(5 + 5, 0, { id: '2' });
const n3 = new Node(5 + 10, 0, { id: '3' });
const n4 = new Node(5 + 15, 0, { id: '4' });
const n5 = new Node(5 + 0, 5, { id: '5' });
const n6 = new Node(5 + 5, 5, { id: '6' });
const n7 = new Node(5 + 10, 5, { id: '7' });

model.nodes = [n1, n2, n3, n4, n5, n6, n7];

model.elements = [
  new Element(n1, n2, { id: 1 }),
  new Element(n2, n3, { id: 2 }),
  new Element(n3, n4, { id: 3 }),
  new Element(n5, n2, { id: 4 }),
  new Element(n6, n3, { id: 5 }),
  new Element(n7, n4, { id: 6 }),
  new Element(n5, n6, { id: 7 }),
  new Element(n6, n7, { id: 8 }),
  new Element(n5, n1, { id: 9 }),
  new Element(n6, n2, { id: 10}),
  new Element(n7, n3, { id: 11})
];

model.boundaries = [
  new Boundary(n1, true, true),
  new Boundary(n4, false, true)
];

model.loads = [
  new Load(n4, 0, -100),
  new Load(n7, -50, -50)
];

model.results = {
  displacements: [
    new Displacement(n1,  0.0000,  0.0000),
    new Displacement(n2, -0.0045, -0.0093),
    new Displacement(n3, -0.0073, -0.0253),
    new Displacement(n4, -0.0084, -0.0413),
    new Displacement(n5,  0.0000,  0.0000),
    new Displacement(n6,  0.0022, -0.0109),
    new Displacement(n7,  0.0028, -0.0269)
  ]
}