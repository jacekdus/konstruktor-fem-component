import { Model, Node, Element, Boundary, Load, Section, Material } from '../../App/Model';

export const model = new Model();

model.setNode(new Node(5 + 0,  0))
model.setNode(new Node(5 + 5,  0))
model.setNode(new Node(5 + 10, 0))
model.setNode(new Node(5 + 15, 0))
model.setNode(new Node(5 + 0,  5))
model.setNode(new Node(5 + 5,  5))
model.setNode(new Node(5 + 10, 5))

const section = new Section('HEA 100', 0.00212)
const material = new Material('Steel', 210000000000.0, 235000000.0)
model.sections = [ section ];
model.materials = [ material ]

model.setElement(new Element(1, 2, section, material))
model.setElement(new Element(2, 3, section, material))
model.setElement(new Element(3, 4, section, material))
model.setElement(new Element(5, 2, section, material))
model.setElement(new Element(6, 3, section, material))
model.setElement(new Element(7, 4, section, material))
model.setElement(new Element(5, 6, section, material))
model.setElement(new Element(6, 7, section, material))
model.setElement(new Element(5, 1, section, material))
model.setElement(new Element(6, 2, section, material))
model.setElement(new Element(7, 3, section, material))

model.setBoundary(1, new Boundary(true, true))
model.setBoundary(5, new Boundary(true, false))

model.setLoad(4, new Load(0, -1000000))
