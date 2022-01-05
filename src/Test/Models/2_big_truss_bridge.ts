import { Model, Node, Element, Boundary, Load, Section, Material } from '../../App/Model';

export const model = new Model();

model.setNode(new Node(5 + 0,  0))
model.setNode(new Node(5 + 5,  0))
model.setNode(new Node(5 + 10, 0))
model.setNode(new Node(5 + 15, 0))
model.setNode(new Node(5 + 20, 0))
model.setNode(new Node(5 + 25, 0))
model.setNode(new Node(5 + 30, 0))
model.setNode(new Node(5 + 5,  5))
model.setNode(new Node(5 + 10, 5))
model.setNode(new Node(5 + 15, 5))
model.setNode(new Node(5 + 20, 5))
model.setNode(new Node(5 + 25, 5))

const section = new Section('HEA 100', 0.00212)
const material = new Material('Steel', 210000000000.0, 235000000.0)
model.sections = [ section ];
model.materials = [ material ]

model.setElement(new Element(1,  2,  section, material))
model.setElement(new Element(2,  3,  section, material))
model.setElement(new Element(3,  4,  section, material))
model.setElement(new Element(4,  5,  section, material))
model.setElement(new Element(5,  6,  section, material))
model.setElement(new Element(6,  7,  section, material))
model.setElement(new Element(8,  9,  section, material))
model.setElement(new Element(9,  10, section, material))
model.setElement(new Element(10, 11, section, material))
model.setElement(new Element(11, 12, section, material))
model.setElement(new Element(8,  2,  section, material))
model.setElement(new Element(9,  3,  section, material))
model.setElement(new Element(10, 4,  section, material))
model.setElement(new Element(11, 5,  section, material))
model.setElement(new Element(12, 6,  section, material))
model.setElement(new Element(1,  8,  section, material))
model.setElement(new Element(8,  3,  section, material))
model.setElement(new Element(3,  10, section, material))
model.setElement(new Element(10, 5,  section, material))
model.setElement(new Element(5,  12, section, material))
model.setElement(new Element(12, 7,  section, material))

model.boundaries = new Map([
  [1, new Boundary(true, true)],
  [7, new Boundary(false, true)]
])

model.loads = new Map([
  [2, new Load(0, -100000)],
  [3, new Load(0, -100000)],
  [4, new Load(0, -100000)],
  [5, new Load(0, -100000)],
  [6, new Load(0, -100000)]
])
