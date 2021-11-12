import { Model } from "./Model";
import View from "./View";

class Controller {
  constructor(
    private model: Model, 
    private view: View
  ) {}

  addNode() {
    // 1. Get Node from UI

    // 2. Add Node to Model

    // 3. Create point on Scene

    // 4. Update scene

  }

  deleteNode() {
    // 1. Get Node from UI

    // 2. Remove Node from Model

    // 3. Remove point on Scene

    // 4. Update scene

  }

  addElement() {
    // TODO
  }

  deleteElement() {
    // TODO
  }

  addSupport() {
    // TODO
  }

  deleteSupport() {
    // TODO
  }

  addLoad() {
    // TODO
  }

  deleteLoad() {
    // TODO
  }

  toggleNodes() {
    // TODO
  }

  toggleElements() {
    // TODO
  }

  toggleSupports() {
    // TODO
  }

  toggleLoads() {
    // TODO
  }

  toggleDisplacements() {
    // TODO
  }

  toggleInnerForces() {
    // TODO
  }

  toggleReactions() {
    // TODO
  }

  calculate() {
    // TODO
  }
}