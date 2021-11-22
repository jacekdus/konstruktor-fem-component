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
const material = new Material('Steel', 210000000000.0)
model.sections = [ section ];
model.materials = [ material ]

model.setElement(new Element(model.getNode(1),  model.getNode(2),  section, material))
model.setElement(new Element(model.getNode(2),  model.getNode(3),  section, material))
model.setElement(new Element(model.getNode(3),  model.getNode(4),  section, material))
model.setElement(new Element(model.getNode(4),  model.getNode(5),  section, material))
model.setElement(new Element(model.getNode(5),  model.getNode(6),  section, material))
model.setElement(new Element(model.getNode(6),  model.getNode(7),  section, material))
model.setElement(new Element(model.getNode(8),  model.getNode(9),  section, material))
model.setElement(new Element(model.getNode(9),  model.getNode(10), section, material))
model.setElement(new Element(model.getNode(10), model.getNode(11), section, material))
model.setElement(new Element(model.getNode(11), model.getNode(12), section, material))
model.setElement(new Element(model.getNode(8),  model.getNode(2),  section, material))
model.setElement(new Element(model.getNode(9),  model.getNode(3),  section, material))
model.setElement(new Element(model.getNode(10), model.getNode(4),  section, material))
model.setElement(new Element(model.getNode(11), model.getNode(5),  section, material))
model.setElement(new Element(model.getNode(12), model.getNode(6),  section, material))
model.setElement(new Element(model.getNode(1),  model.getNode(8),  section, material))
model.setElement(new Element(model.getNode(8),  model.getNode(3),  section, material))
model.setElement(new Element(model.getNode(3),  model.getNode(10), section, material))
model.setElement(new Element(model.getNode(10), model.getNode(5),  section, material))
model.setElement(new Element(model.getNode(5),  model.getNode(12), section, material))
model.setElement(new Element(model.getNode(12), model.getNode(7),  section, material))

model.boundaries = new Map([
  [model.nodes.get(1), new Boundary(true, true)],
  [model.nodes.get(7), new Boundary(false, true)]
])

model.loads = new Map([
  [model.nodes.get(2), new Load(0, -100000)],
  [model.nodes.get(3), new Load(0, -100000)],
  [model.nodes.get(4), new Load(0, -100000)],
  [model.nodes.get(5), new Load(0, -100000)],
  [model.nodes.get(6), new Load(0, -100000)]
])
