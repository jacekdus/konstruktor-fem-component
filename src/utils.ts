import { Node, Element, Boundary, Load, Section, Material, Model } from './App/Model'


export function jsonStringModelToModel(jsonStringModel: string) {
  const jsonModel = JSON.parse(jsonStringModel);

  return jsonModelToModel(jsonModel);
}

export function jsonModelToModel(jsonModel: any) {
  const model = new Model();

  jsonModel.materials.forEach((material: any) => {
    model.materials = [
      new Material(material.name, material.youngsModulus)
    ]
  });

  jsonModel.sections.forEach((section: any) => {
    model.sections = [
      new Section(section.name, section.area)
    ]
  });

  jsonModel.nodes.forEach((node: any) => {
    model.setNode(new Node(node.x, node.y));
  });

  jsonModel.elements.forEach((element: any) => {
    model.setElement(new Element(element.node1Id, element.node2Id, element.section, element.material));
  });

  jsonModel.boundaries.forEach((boundary: any) => {
    model.boundaries.set(boundary.nodeId, new Boundary(boundary.xFixed, boundary.yFixed));
  });

  jsonModel.loads.forEach((load: any) => {
    model.loads.set(load.nodeId, new Load(load.fx, load.fy));
  });

  return model;
}

export function modelToJsonModel(model: Model): JsonModel {
  const jsonModel: JsonModel = new JsonModel();
  
  model.materials.forEach((material: Material, idx) => {
    jsonModel.materials.push({ id: idx, name: material.name, youngsModulus: material.youngsModulus })
  });

  model.sections.forEach((section: Section, idx) => {
    jsonModel.sections.push({ id: idx, name: section.name, area: section.area });
  });

  model.nodes.forEach((node: Node, key) => {
    jsonModel.nodes.push({ id: key, x: node.x, y: node.y })
  })

  model.elements.forEach((element: Element, key) => {
    jsonModel.elements.push({ id: key, node1Id: element.node1Id, node2Id: element.node2Id, section: element.section, material: element.material })
  })

  model.boundaries.forEach((boundary: Boundary, nodeId: number) => {
    jsonModel.boundaries.push({ id: jsonModel.boundaries.length + 1, nodeId: nodeId, xFixed: boundary.xFixed, yFixed: boundary.yFixed})
  })

  model.loads.forEach((load: Load, nodeId) => {
    jsonModel.loads.push({ id: jsonModel.loads.length + 1, nodeId: nodeId, fx: load.fx, fy: load.fy })
  })

  return jsonModel;
}

export class JsonModel {
  materials: any[] = [];
  sections: any[] = [];
  nodes: any[] = [];
  elements: any[] = [];
  boundaries: any[] = [];
  loads: any[] = [];
}