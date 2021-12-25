import { Model, Node, Element, Boundary, Load, Section, Material } from '../../App/Model';

export const model = new Model();

const section = new Section('HEA 100', 0.00212)
const material = new Material('Steel', 210000000000.0)
model.sections = [ section ];
model.materials = [ material ]

model.setNode(new Node(4 + -1,   -1 + 1))
model.setNode(new Node(4 +  0.8,   -1 + 4))
model.setNode(new Node(4 +  2,   -1 + 3))
model.setNode(new Node(4 +  9,   -1 + 1))
model.setNode(new Node(4 +  6,   -1 + 3))
model.setNode(new Node(4 +  7.2,   -1 + 4))
model.setNode(new Node(4 +  4,   -1 + 3.5))
model.setNode(new Node(4 +  2,   -1 + 7))
model.setNode(new Node(4 +  6,   -1 + 7))
model.setNode(new Node(4 +  3,   -1 + 11))
model.setNode(new Node(4 +  5,   -1 + 11))
model.setNode(new Node(4 +  3.5, -1 + 15))
model.setNode(new Node(4 +  4.5, -1 + 15))
model.setNode(new Node(4 +  4,   -1 + 21))

model.setElement(new Element(1,  2,  section, material))
model.setElement(new Element(2,  3,  section, material))
model.setElement(new Element(1,  3,  section, material))
model.setElement(new Element(4,  5,  section, material))
model.setElement(new Element(4,  6,  section, material))
model.setElement(new Element(5,  6,  section, material))
model.setElement(new Element(3,  7,  section, material))
model.setElement(new Element(5,  7,  section, material))
model.setElement(new Element(2,  8,  section, material))
model.setElement(new Element(3,  8,  section, material))
model.setElement(new Element(7,  8,  section, material))
model.setElement(new Element(7,  9,  section, material))
model.setElement(new Element(5,  9,  section, material))
model.setElement(new Element(6,  9,  section, material))
model.setElement(new Element(8,  9,  section, material))
model.setElement(new Element(8,  11,  section, material))
model.setElement(new Element(9,  10,  section, material))
model.setElement(new Element(8,  10,  section, material))
model.setElement(new Element(9,  11,  section, material))
model.setElement(new Element(10, 11,  section, material))
model.setElement(new Element(10, 13,  section, material))
model.setElement(new Element(10, 12,  section, material))
model.setElement(new Element(11, 13,  section, material))
model.setElement(new Element(11, 12,  section, material))
model.setElement(new Element(12, 14,  section, material))
model.setElement(new Element(12, 13,  section, material))
model.setElement(new Element(13, 14,  section, material))

model.setLoad(14, new Load(10000, 0))
model.setLoad(12, new Load(10000, 0))
model.setLoad(10, new Load(10000, 0))
model.setLoad(8, new Load(10000, 0))
model.setLoad(2, new Load(10000, 0))

model.setBoundary(1, new Boundary(true, true))
model.setBoundary(4, new Boundary(false, true))