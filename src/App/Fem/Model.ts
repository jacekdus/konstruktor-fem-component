import { Model } from '../Model'
import FemElement from './FemElement';


export const getFemModel = (model: Model) => {
  model.femElements.clear();

  model.elements.forEach((e, elementNumber) => {
    const node1 = model.nodes.get(e.node1Id);
    const node2 = model.nodes.get(e.node2Id);
    
    const femElement = new FemElement(e.material, e.section, node1, node2);

    model.setFemElement(femElement, elementNumber)
  });

  return model;
};
