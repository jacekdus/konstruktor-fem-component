import Two from 'two.js'
import { ConfigInterface } from '../Config/ConfigInterface';
import { Point, PointBuilder } from './Point';

class SceneShapesCreator {
  constructor(
    private config: ConfigInterface,
    private pointBuilder: PointBuilder
  ) {}

  createNode(p: Point) {
    return new Two.Circle(p.x, p.y, this.config.scaleFactor.node);
  }

  createElement(p1: Point, p2: Point) {
    return new Two.Line(p1.x, p1.y, p2.x, p2.y)
  }

  createDisplacedElement(p1: Point, p2: Point) {
    return this.createElement(p1, p2);
  }

  createSupport(p: Point, xFixed: boolean, yFixed: boolean) {
    if (xFixed === false && yFixed === false) {
      throw 'Support has to have at least one direction fixed!'
    }

    if (xFixed === true && yFixed === true) {
      const support = this._createFixedSupport();
      support.translation.set(p.x, p.y);

      return support;
    }

    if (xFixed === false && yFixed === true) {
      const support = this._createSlidingSupport();
      support.translation.set(p.x, p.y);

      return support;
    }

    if (xFixed === true && yFixed === false) {
      const support = this._createSlidingSupport();
      support.rotation = Math.PI / 2;
      support.translation.set(p.x, p.y);

      return support;
    }
  }

  _createFixedSupport() {
    return new Two.Polygon(0, 0, this.config.scaleFactor.support);
  }

  _createSlidingSupport() {
    const baseSupport = this._createFixedSupport()
    const slider = new Two.Line(
      - 1/2 * this.config.scaleFactor.support, + 1.5 * this.config.scaleFactor.support, 
      + 1/2 * this.config.scaleFactor.support, + 1.5 * this.config.scaleFactor.support
    );

    return new Two.Group([baseSupport, slider])
  }


  createVerticalLoad(p: Point, value: number = 0) {
    const load = this._createLoad();

    if (value < 0) {
      load.rotation = Math.PI
    }

    load.translation.set(p.x, p.y);

    return load;
  }
  
  createHorizontalLoad(p: Point, value: number = 0) {
    const load = this._createLoad();

    if (value < 0) {
      load.rotation = - Math.PI / 2
    } else {
      load.rotation =   Math.PI / 2
    }

    load.translation.set(p.x, p.y);

    return load;
  }

  _createLoad() {
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
    const xMax = 20;
    const yMin = 0;
    const yMax = 5;
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

    const label = new Two.Text(id, elementPosition.x, elementPosition.y);

    const labelBackground = new Two.Circle(elementPosition.x - 0, elementPosition.y - 0, 10);

    return new Two.Group([label, labelBackground]);
  }

  createLoadLabel(p: Point, xValue: number, yValue: number) {
    return this._createLabel(p, `(${xValue / 1000}, ${yValue / 1000}) [kN]`)
  }

  createDisplacementLabel(p: Point, value: string) {
    return this._createLabel(p, value);
  }

  createCursor(p: Point) {
    const cursor = []
    const scaleFactor = this.config.scaleFactor.cursor;

    cursor.push(new Two.Line(p.x - scaleFactor, p.y, p.x - scaleFactor/2, p.y));
    cursor.push(new Two.Line(p.x, p.y - scaleFactor, p.x, p.y - scaleFactor/2));
    cursor.push(new Two.Line(p.x + scaleFactor/2, p.y, p.x + scaleFactor, p.y));
    cursor.push(new Two.Line(p.x, p.y + scaleFactor/2, p.x, p.y + scaleFactor));

    return new Two.Group(cursor)
  }

  _createLabel(p: Point, text: string) {
    return new Two.Text(
      text, 
      p.x + this.config.scaleFactor.nodeTextOffset, 
      p.y - this.config.scaleFactor.nodeTextOffset
    );
  }
}