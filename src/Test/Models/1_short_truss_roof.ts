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
const material = new Material('Steel', 210000000000.0)
model.sections = [ section ];
model.materials = [ material ]

model.setElement(new Element(model.nodes.get(1), model.nodes.get(2), section, material))
model.setElement(new Element(model.nodes.get(2), model.nodes.get(3), section, material))
model.setElement(new Element(model.nodes.get(3), model.nodes.get(4), section, material))
model.setElement(new Element(model.nodes.get(5), model.nodes.get(2), section, material))
model.setElement(new Element(model.nodes.get(6), model.nodes.get(3), section, material))
model.setElement(new Element(model.nodes.get(7), model.nodes.get(4), section, material))
model.setElement(new Element(model.nodes.get(5), model.nodes.get(6), section, material))
model.setElement(new Element(model.nodes.get(6), model.nodes.get(7), section, material))
model.setElement(new Element(model.nodes.get(5), model.nodes.get(1), section, material))
model.setElement(new Element(model.nodes.get(6), model.nodes.get(2), section, material))
model.setElement(new Element(model.nodes.get(7), model.nodes.get(3), section, material))

model.setBoundary(model.nodes.get(1), new Boundary(true, true))
model.setBoundary(model.nodes.get(5), new Boundary(true, false))

model.setLoad(model.nodes.get(4), new Load(0, -1000000))
