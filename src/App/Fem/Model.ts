import { Model } from '../Model'
import FemElement from './FemElement';


export const getFemModel = (model: Model) => {
  model.elements.forEach((e, elementNumber) => {
    const femElement = new FemElement(e.material, e.section, e.node1, e.node2);

    model.elements.set(elementNumber, femElement)
  });

  return model;
};
