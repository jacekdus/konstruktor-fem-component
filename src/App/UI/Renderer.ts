import Two from "two.js";
import { ConfigInterface } from "../Config/ConfigInterface";

import { Point, PointBuilder } from "./Point";

export class Renderer {
  private scenePosition: {x: number, y: number};
  private two;
  private twoResults;
  public twoNodeGroup; 

  constructor(
    private config: ConfigInterface = config,
    private pointBuilder: PointBuilder = pointBuilder
  ) {
    config.two.width = config.elements.container.clientWidth;
    this.two = new Two(config.two).appendTo(config.elements.container);
    this.twoNodeGroup = this.two.makeGroup();
    this.twoResults = this.two.makeGroup()
    this.update();

    config.elements.two.nodes = this.twoNodeGroup._renderer.elem;
    // this.createEventListeners();
    // this.scenePosition = this.updateScenePosition();
    // this.createEventListeners();
  }

  setSceneSize() {
    this.two.renderer.setSize(this.config.two.width, this.config.two.height);
  }

  getConfig() {
    return this.config;
  }

  // updateScenePosition() {
  //   console.log(this.two.renderer.domElement.getBoundingClientRect().x)
  //   return {
  //     x: this.two.renderer.domElement.getBoundingClientRect().x,
  //     y: this.two.renderer.domElement.getBoundingClientRect().y
  //   }
  // }

  makeLoad(p: Point, xValue: number, yValue: number) {
    if (yValue) {
      const vLoad = this.makeVerticalLoad(p, yValue);
      vLoad.stroke = this.config.color.load;
      vLoad.fill = this.config.color.load;
      vLoad.linewidth = 3;
      this.two.add(vLoad);
    }

    if (xValue) {
      const hLoad = this.makeHorizontalLoad(p, xValue);
      hLoad.stroke = this.config.color.load;
      hLoad.fill = this.config.color.load;
      this.two.add(hLoad);
    }

    const label = this.getLabel(p, `(${xValue / 1000}, ${yValue / 1000}) [kN]`);
    label.stroke = this.config.color.load;
    label.alignment = 'left';
    this.two.add(label);
  }

  makeVerticalLoad(p: Point, value: number = 0) {
    const force = this.makeLoadSymbol();

    if (value < 0) {
      force.rotation = Math.PI
    }

    force.translation.set(p.x, p.y);

    return force;
  }
  
  makeHorizontalLoad(p: Point, value: number = 0) {
    const force = this.makeLoadSymbol();

    if (value < 0) {
      force.rotation = - Math.PI / 2
    } else {
      force.rotation =   Math.PI / 2
    }

    force.translation.set(p.x, p.y);

    return force;
  }

  makeLoadSymbol() {
    return new Two.Path([
      new Two.Anchor(0, + 2.0 * this.config.scaleFactor.load),
      new Two.Anchor(0, 0),
      new Two.Anchor(- 0.1 * this.config.scaleFactor.load, + 0.5 * this.config.scaleFactor.load),
      new Two.Anchor(+ 0.1 * this.config.scaleFactor.load, + 0.5 * this.config.scaleFactor.load),
      new Two.Anchor(0, 0),
    ], true
    );
  }

  makeNode(p: Point): string {
    const node = this.two.makeCircle(p.x, p.y, this.config.scaleFactor.node);
    this.twoNodeGroup.add(node)
    this.update()

    return node._renderer.elem.id
  }

  makeNodeLabel(p: Point, id: number) {
    const label = this.getLabel(p, id.toString());
    this.two.add(label);
  }

  enlargeNode(nodeId: number) {
    const node = this.twoNodeGroup.getById(nodeId);
    node.fill = 'blue'
  }

  restoreDefaultNodeSize(nodeId: number) {
    const node = this.twoNodeGroup.getById(nodeId);
    node.fill = '#FFF'
  }

  makeDisplacementLabel(p: Point, value: string) {
    const label = this.getLabel(p, value);
    label.stroke = this.config.color.displacement;
    this.twoResults.add(label);
  }

  getLabel(p: Point, value: string) {
    return new Two.Text(
      value, 
      p.x + this.config.scaleFactor.nodeTextOffset, 
      p.y - this.config.scaleFactor.nodeTextOffset
    );
  }

  makeLabel(p: Point, value: string) {
    const label = this.getLabel(p, value);
    label.alignment = 'left'
    this.two.add(label);
  }

  makeElement(p1: Point, p2: Point) {
    const e = this.two.makeLine(p1.x, p1.y, p2.x, p2.y);
    e.stroke = this.config.color.element;

    return e;
  }

  makeDisplacedElement(p1: Point, p2: Point) {
    const de = this.makeElement(p1, p2);
    this.twoResults.add(de)
    de.stroke = this.config.color.displacement;
  }

  makeElementLabel(p1: Point, p2: Point, id: number) {
    const elementPosition = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    }

    const label = new Two.Text(id, elementPosition.x, elementPosition.y);

    const labelBackground = this.two.makeCircle(
      elementPosition.x - 0, elementPosition.y - 0,
      10
    );
    labelBackground.noStroke();
    labelBackground.fill = '#f6fbff'

    const group = this.two.makeGroup(labelBackground, label);
    this.two.add(group);
  }

  makeSupport(p: Point, xFixed: boolean, yFixed: boolean) {
    if (xFixed === false && yFixed === false) {
      throw 'Support has to have at least one direction fixed!'
    }

    const triangle = this.two.makePath(
      0, 0, 
      - 1/2 * this.config.scaleFactor.support, 1 * this.config.scaleFactor.support, 
      + 1/2 * this.config.scaleFactor.support, 1 * this.config.scaleFactor.support
    );
    triangle.stroke = this.config.color.support;
    
    if (xFixed === true && yFixed === true) {
      const support = this.two.makeGroup(triangle);
      support.translation.set(p.x, p.y);
      return support;
    }

    const line = this.two.makeLine(
      - 1/2 * this.config.scaleFactor.support, + 1.5 * this.config.scaleFactor.support, 
      + 1/2 * this.config.scaleFactor.support, + 1.5 * this.config.scaleFactor.support
    );
    line.stroke = this.config.color.support;

    if (xFixed === false && yFixed === true) {
      const support = this.two.makeGroup(triangle, line);
      support.translation.set(p.x, p.y);
      return support;
    }

    if (xFixed === true && yFixed === false) {
      const support = this.two.makeGroup(triangle, line);
      support.rotation = Math.PI / 2;
      support.translation.set(p.x, p.y);
      return support;
    }
  }

  makeDimensions() {
    const xMin = 0;
    const xMax = 20;
    const yMin = 0;
    const yMax = 5;
    const interval = 5;

    let curr = xMin;

    while (curr <= xMax) {
      this.makeDimensionX(curr.toFixed(1), this.pointBuilder.getPointFromModelCoordinateSystem(curr, 0));
      curr += interval;
    } 

    curr = yMin;

    while (curr <= yMax) {
      this.makeDimensionY(curr.toFixed(1), this.pointBuilder.getPointFromModelCoordinateSystem(0, curr));
      curr += interval;
    } 
  }

  makeDimensionX(value: string, p: Point) {
    const sceneHeight = this.config.two.height;

    this.two.makeLine(p.x, sceneHeight - 15, p.x, sceneHeight - 30);
    const text = new Two.Text(value, p.x, sceneHeight - 5);
    this.two.add(text);
  }

  makeDimensionY(value: string, p: Point) {
    this.two.makeLine(30, p.y, 45, p.y);
    const text = new Two.Text(value, 15, p.y);
    this.two.add(text);
  }

  makeBorder() {
    const sceneWidth = this.config.two.width;
    const sceneHeight = this.config.two.height;

    this.two.makeLine(0, 0, sceneWidth, 0);
    this.two.makeLine(sceneWidth, 0, sceneWidth, sceneHeight);
    this.two.makeLine(0, sceneHeight, sceneWidth, sceneHeight);
    this.two.makeLine(0, sceneHeight, 0, 0);
  }

  makeGlobalCoordinateSystemIcon(p: Point) {
    const xLine = this.two.makeLine(p.x + this.config.scaleFactor.csIcon.icon , p.y, p.x, p.y,)
    const yLine = this.two.makeLine(p.x, p.y, p.x, p.y - this.config.scaleFactor.csIcon.icon)

    const xLabel = new Two.Text(
      'x', 
      p.x + this.config.scaleFactor.csIcon.icon + this.config.scaleFactor.csIcon.textOffset, 
      p.y
    );

    const yLabel = new Two.Text(
      'y', 
      p.x, 
      p.y - ( this.config.scaleFactor.csIcon.icon + this.config.scaleFactor.csIcon.textOffset ) 
    );

    const group = this.two.makeGroup(xLine, yLine, xLabel, yLabel)
    this.two.add(group);

    group.stroke = 'red';
  }

  makeCursor(p: Point) {
    const scaleFactor = this.config.scaleFactor.cursor;

    const p1 = this.two.makeLine(p.x - scaleFactor, p.y, p.x - scaleFactor/2, p.y);
    const p2 = this.two.makeLine(p.x, p.y - scaleFactor, p.x, p.y - scaleFactor/2);
    
    const p3 = this.two.makeLine(p.x + scaleFactor/2, p.y, p.x + scaleFactor, p.y);
    const p4 = this.two.makeLine(p.x, p.y + scaleFactor/2, p.x, p.y + scaleFactor);

    return this.two.makeGroup(p1, p2, p3, p4)
  }

  remove(object: Object) {
    this.two.remove(object);
  }

  clearResults() {
    this.remove(this.twoResults);
    this.twoResults = this.two.makeGroup();
  }

  clear() {
    this.two.clear();
  }

  update() {
    this.two.update();
  }
}
