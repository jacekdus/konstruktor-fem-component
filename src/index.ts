import View from "./App/View";
import { ConfigInterface } from "./App/Config/ConfigInterface";
import { config } from "./App/Config/config";
import Controller from "./App/Controller";
import { Model } from "./App/Model";

// import * as data from './Test/Models/model.json'
import { jsonModelToModel } from "./utils";

import { model } from './Test/Models/0_empty'
// import { model } from './Test/Models/1_short_truss_roof'
// import { model } from './Test/Models/2_big_truss_bridge'
// import { model } from './Test/Models/3_eiffel_tower'

const elements = {
  scene: document.getElementById('scene'),
  calcBtn: document.getElementById('calc-btn'),
  sceneVisibility: document.getElementById('scene-visibility'),
  modes: document.getElementById('mode'),
  two: {
    nodes: undefined as undefined | HTMLElement
  },
  toolbox: {
    element: document.getElementById('element-toolbox'),
    support: document.getElementById('support-toolbox'),
    load: document.getElementById('load-toolbox'),
    fx: document.getElementById('fx-input') as HTMLInputElement,
    fy: document.getElementById('fy-input') as HTMLInputElement,
    xFixed: document.getElementById('support-xFixed-cb') as HTMLInputElement,
    yFixed: document.getElementById('support-yFixed-cb') as HTMLInputElement
  },
}

export class FemComponent {
  private controller: Controller;
  private model: Model;
  private config: ConfigInterface;

  constructor(elements: any, jsonModel?: string) {
    this.config = config;
    this.config.elements = elements;

    if (jsonModel) {
      this.model = jsonModelToModel(jsonModel)
    } else {
      this.model = model;
    }
  }

  init() {
    this.controller = new Controller(this.model, new View(config));
    this.controller.init();
  }

  getJsonModel(): string {
    return this.controller.getJsonModel();
  }

  getThumbnail(): string {
    return config.elements.scene.innerHTML;
  }
}

const femComponent = new FemComponent(elements);
femComponent.init();
