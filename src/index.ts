import View from "./App/View";
import { config } from "./App/Config/config";
import Controller from "./App/Controller";

// import { model } from './Test/Models/0_empty'
import { model } from './Test/Models/1_short_truss_roof'
// import { model } from './Test/Models/2_big_truss_bridge'

const view = new View(config);
const controller = new Controller(model, view);
controller.init();
