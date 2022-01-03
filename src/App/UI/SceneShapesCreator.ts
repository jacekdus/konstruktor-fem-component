import Two from 'two.js'
import { ConfigInterface } from '../Config/ConfigInterface';
import { Point, PointBuilder } from './Point';

export default class SceneShapesCreator {
  constructor(
    private config: ConfigInterface,
    private pointBuilder: PointBuilder
  ) {}

  createNode(p: Point) {
    return new Two.Circle(p.x, p.y, this.config.scaleFactor.node);
  }

  createElement(p1: Point, p2: Point) {
    const element = new Two.Line(p1.x, p1.y, p2.x, p2.y)
    element.stroke = this.config.color.element;

    return element;
  }

  createDisplacedElement(p1: Point, p2: Point) {
    const de = this.createElement(p1, p2);
    de.stroke = this.config.color.displacement;
    
    return de
  }

  createInnerForceElement(p1: Point, p2: Point, rgbColor: string) {
    const innerForceElement = this.createElement(p1, p2);
    innerForceElement.stroke = rgbColor;
    innerForceElement.linewidth = 5;

    return innerForceElement;
  }

  createSupport(p: Point, xFixed: boolean, yFixed: boolean) {
    if (xFixed === false && yFixed === false) {
      throw 'Support has to have at least one direction fixed!'
    }

    if (xFixed === true && yFixed === true) {
      const support = this.createBaseSupport();
      support.translation.set(p.x, p.y);

      support.stroke = this.config.color.support
      return support;
    }

    if (xFixed === false && yFixed === true) {
      const support = this.createSlidingSupport();
      support.translation.set(p.x, p.y);

      support.stroke = this.config.color.support
      return support;
    }

    if (xFixed === true && yFixed === false) {
      const support = this.createSlidingSupport();
      support.rotation = Math.PI / 2;
      support.translation.set(p.x, p.y);

      support.stroke = this.config.color.support
      return support;
    }
  }

  private createBaseSupport() {
    const support = new Two.Polygon(0, this.config.scaleFactor.support, this.config.scaleFactor.support);
    return new Two.Group(support);
  }

  private createSlidingSupport() {
    const baseSupport = this.createBaseSupport()
    const slider = new Two.Line(
      - 1.0 * this.config.scaleFactor.support, + 2.0 * this.config.scaleFactor.support, 
      + 1.0 * this.config.scaleFactor.support, + 2.0 * this.config.scaleFactor.support
    );

    return new Two.Group([baseSupport, slider])
  }

  createVerticalLoad(p: Point, value: number = 0) {
    const force = this.createVerticalForce(p, value);
    this.setLoadStyle(force);

    return force;
  }
  
  createHorizontalLoad(p: Point, value: number = 0) {
    const force = this.createHorizontalForce(p, value);
    this.setLoadStyle(force);

    return force;
  }

  createVerticalReaction(p: Point, value: number = 0) {
    const force = this.createVerticalForce(p, value);
    this.setReactionStyle(force);

    return force;
  }
  
  createHorizontalReaction(p: Point, value: number = 0) {
    const force = this.createHorizontalForce(p, value);
    this.setReactionStyle(force);

    return force;
  }

  private createVerticalForce(p: Point, value: number = 0) {
    const force = this._createForce();

    if (value < 0) {
      force.rotation = Math.PI
    }

    force.translation.set(p.x, p.y);

    return force;
  }

  private createHorizontalForce(p: Point, value: number = 0) {
    const force = this._createForce();

    if (value < 0) {
      force.rotation = - Math.PI / 2
    } else {
      force.rotation =   Math.PI / 2
    }

    force.translation.set(p.x, p.y);

    return force;
  }

  private setLoadStyle(load: any) {
    load.stroke = this.config.color.load;
    load.fill = this.config.color.load;
    load.linewidth = 3;
  }

  private setReactionStyle(load: any) {
    load.stroke = this.config.color.reaction;
    load.fill = this.config.color.reaction;
    load.linewidth = 3;
  }

  _createForce() {
    return new Two.Path([
      new Two.Anchor(0, + 2.0 * this.config.scaleFactor.load),
      new Two.Anchor(0, 0),
      new Two.Anchor(- 0.1 * this.config.scaleFactor.load, + 0.5 * this.config.scaleFactor.load),
      new Two.Anchor(+ 0.1 * this.config.scaleFactor.load, + 0.5 * this.config.scaleFactor.load),
      new Two.Anchor(0, 0),
    ], true
    );
  }

  createGlobalCoordinateSystemIcon(p: Point) {
    const xLine = new Two.Line(p.x + this.config.scaleFactor.csIcon.icon , p.y, p.x, p.y,)
    const yLine = new Two.Line(p.x, p.y, p.x, p.y - this.config.scaleFactor.csIcon.icon)
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

    const gcsiGroup = new Two.Group([xLine, yLine, xLabel, yLabel])
    gcsiGroup.stroke = 'red';

    return gcsiGroup;
  }

  createDimensions() {
    const dimensions = []

    const xMin = 0;
    const xMax = 50;
    const yMin = 0;
    const yMax = 10;
    const interval = 5;

    let curr = xMin;

    while (curr <= xMax) {
      dimensions.push(this._createDimensionX(curr.toFixed(1), this.pointBuilder.getPointFromModelCoordinateSystem(curr, 0)));
      curr += interval;
    } 

    curr = yMin;

    while (curr <= yMax) {
      dimensions.push(this._createDimensionY(curr.toFixed(1), this.pointBuilder.getPointFromModelCoordinateSystem(0, curr)));
      curr += interval;
    }

    return new Two.Group(dimensions);
  }

  _createDimensionX(value: string, p: Point) {
    const sceneHeight = this.config.two.height;

    const line = new Two.Line(p.x, sceneHeight - 15, p.x, sceneHeight - 30);
    const text = new Two.Text(value, p.x, sceneHeight - 5);

    return new Two.Group([line, text])
  }

  _createDimensionY(value: string, p: Point) {
    const line = new Two.Line(30, p.y, 45, p.y);
    const text = new Two.Text(value, 15, p.y);

    return new Two.Group([line, text]);
  }

  createBorder() {
    const border = []
    const sceneWidth = this.config.two.width;
    const sceneHeight = this.config.two.height;

    border.push(new Two.Line(0, 0, sceneWidth, 0));
    border.push(new Two.Line(sceneWidth, 0, sceneWidth, sceneHeight));
    border.push(new Two.Line(0, sceneHeight, sceneWidth, sceneHeight));
    border.push(new Two.Line(0, sceneHeight, 0, 0));

    return new Two.Group(border)
  }

  createNodeLabel(p: Point, id: number) {
    return this._createLabel(p, id.toString());
  }

  createElementLabel(p1: Point, p2: Point, id: number) {
    const elementPosition = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    }

    const labelBackground = new Two.Circle(elementPosition.x - 0, elementPosition.y - 0, 10);
    const label = new Two.Text(id, elementPosition.x, elementPosition.y);

    labelBackground.noStroke();
    labelBackground.fill = '#f6fbff'
    
    return new Two.Group([labelBackground, label]);
  }

  createLoadLabel(p: Point, xValue: number, yValue: number) {
    const loadLabel = this._createLabel(p, `(${xValue / 1000}, ${yValue / 1000}) [kN]`)
    this.styleLoadLabel(loadLabel);

    return loadLabel
  }

  createReactionLabel(p: Point, xValue: number, yValue: number) {
    const reactionLabel = this._createLabel(p, `(${(xValue / 1000).toFixed(1)}, ${(yValue / 1000).toFixed(1)}) [kN]`)
    this.styleReactionLabel(reactionLabel);

    return reactionLabel
  }

  private styleLoadLabel(loadLabel: any) {
    loadLabel.stroke = this.config.color.load;
    loadLabel.alignment = 'left';
    loadLabel.position.y -= 2 * this.config.scaleFactor.nodeTextOffset;
  }

  private styleReactionLabel(reactionLabel: any) {
    reactionLabel.stroke = this.config.color.reaction;
    reactionLabel.alignment = 'left';
    reactionLabel.position.y += 3 * this.config.scaleFactor.nodeTextOffset;
  }

  createDisplacementLabel(p: Point, dx: number, dy: number) {
    p.x += dx * this.config.scaleFactor.displacements;
    p.y -= dy * this.config.scaleFactor.displacements;

    const label = this._createLabel(p, `(${(Math.round(dx * 10000) / 10)}, ${Math.round(dy * 10000) / 10})`);
    label.stroke = this.config.color.displacement;

    return label;
  }

  createCursor() {
    const cursor = new Two.Group()
    const scaleFactor = this.config.scaleFactor.cursor;

    cursor.add(new Two.Line(- scaleFactor, 0.0, - scaleFactor/2, 0.0));
    cursor.add(new Two.Line(0.0, scaleFactor, 0.0, scaleFactor/2));
    cursor.add(new Two.Line(scaleFactor/2, 0.0, scaleFactor, 0.0));
    cursor.add(new Two.Line(0.0, - scaleFactor/2,  0.0, - scaleFactor));

    return cursor
  }

  createCursorLabel() {
    const positionX = 10;
    const positionY = this.config.two.height - 10;

    const label = this._createLabel(new Point(positionX, positionY), this.config.cursor.message);
    label.alignment = 'left';
    label.stroke = 'blue'

    return new Two.Group(label);
  }

  private _createLabel(p: Point, text: string) {
    return new Two.Text(
      text, 
      p.x + this.config.scaleFactor.nodeTextOffset, 
      p.y - this.config.scaleFactor.nodeTextOffset
    );
  }

  createInnerForceLegend(max: number, min: number) {
    const label = new Two.Text(`LEGEND:`, 0.0, 0.0 - 115);
    label.stroke = 'blue'

    const text1 = new Two.Text(`${(max / 1000).toFixed(1)} kN`, 0.0, 0.0 - 95);
    const text2 = new Two.Text(`${(min / 1000).toFixed(1)} kN`, 0.0, 0.0 + 95);

    const color1 = 'rgb(0, 255, 255)';
    const color2 = 'rgb(255, 0, 0)';

    text1.stroke = color1;
    text2.stroke = color2;

    const rect = new Two.Rectangle(0.0, 0.0, 50, 150);
    const gradient = new Two.LinearGradient(0, -75, 0, 75, [
      new Two.Stop(0, color1),
      new Two.Stop(1, color2)
    ]);
    rect.fill = gradient;
    rect.noStroke();

    return new Two.Group([label, text1, text2, rect]);
  }
}
