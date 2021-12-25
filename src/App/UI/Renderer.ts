import Two from "two.js";
import { ConfigInterface } from "../Config/ConfigInterface";


export class Renderer {
  private two;

  constructor(
    private config: ConfigInterface
  ) {
    config.two.width = config.elements.scene.clientWidth;
    this.two = new Two(config.two).appendTo(config.elements.scene);
  }

  render(object: any) {
    this.two.add(object);
  }

  remove(object: any) {
    this.two.remove(object);
  }

  clear() {
    this.two.clear();
  }

  update() {
    this.two.update();
  }

  setSceneSize() {
    this.two.renderer.setSize(this.config.two.width, this.config.two.height);
  }
}
