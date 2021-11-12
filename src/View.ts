import { Renderer } from "./Renderer";
import { ConfigInterface } from "./Config/ConfigInterface";
import { Node, Element, Displacement, Boundary, Load } from "./Model";
import { Point, PointBuilder } from "./Point";

export default class View {
  private renderer: Renderer
  private pointBuilder: PointBuilder

  constructor(config: ConfigInterface) {
    this.pointBuilder = new PointBuilder(config);
    this.renderer = new Renderer(config, this.pointBuilder);
  }

  getRenderer(): Renderer {
    return this.renderer;
  }

  makeDisplacements(eArr: Element[], dArr: Displacement[], scaleFactor: number) {
    eArr.forEach(e => {
      const p1: Point = this.pointBuilder.getPointFromNode(e.node1);
      const p2: Point = this.pointBuilder.getPointFromNode(e.node2);

      const d1 = dArr.find(d => e.node1 === d.node);
      const d2 = dArr.find(d => e.node2 === d.node);

      const dp1 = this.getDisplacedPoint(p1, d1, scaleFactor);
      const dp2 = this.getDisplacedPoint(p2, d2, scaleFactor);

      this.renderer.makeDisplacedElement(dp1, dp2);

      // refactor - labels are overlaping
      this.renderer.makeDisplacementLabel(dp1, `(${(d1.dx * 100).toFixed(1)}, ${(d1.dy * 100).toFixed(1)}) [cm]`);
      this.renderer.makeDisplacementLabel(dp2, `(${(d2.dx * 100).toFixed(1)}, ${(d2.dy * 100).toFixed(1)}) [cm]`);
    });
  }

  private getDisplacedPoint(p: Point, d: Displacement, scaleFactor: number) {
    p.x -= d.dx * scaleFactor;
    p.y -= d.dy * scaleFactor;
    return p
  }

  makeElements(eArr: Element[]) {
    eArr.forEach(e => {
      const p1: Point = this.pointBuilder.getPointFromNode(e.node1);
      const p2: Point = this.pointBuilder.getPointFromNode(e.node2);

      this.renderer.makeElement(p1, p2);
    });
  }

  makeElementsLabels(eArr: Element[]) {
    eArr.forEach(e => {
      const p1: Point = this.pointBuilder.getPointFromNode(e.node1);
      const p2: Point = this.pointBuilder.getPointFromNode(e.node2);

      this.renderer.makeElementLabel(p1, p2, e.opts.id);
    });
  }

  makeNodes(nArr: Node[]) {
    nArr.forEach(n => {
      const p: Point = this.pointBuilder.getPointFromNode(n);

      this.renderer.makeNode(p);
    });
  }

  makeNodesLabels(nArr: Node[]) {
    nArr.forEach(n => {
      const p: Point = this.pointBuilder.getPointFromNode(n);

      this.renderer.makeNodeLabel(p, n.opts.id);
    });
  }

  makeSupports(bArr: Boundary[]) {
    bArr.forEach(b => {
      const p: Point = this.pointBuilder.getPointFromNode(b.node);

      this.renderer.makeSupport(p, b.xFixed, b.yFixed);
    });
  }

  makeLoads(lArr: Load[]) {
    lArr.forEach(l => {
      const p: Point = this.pointBuilder.getPointFromNode(l.node);

      this.renderer.makeLoad(p, l.fx, l.fy);
    });
  }

  makeCoordinateSystemIcon() {    
    const point = this.pointBuilder.getPointFromNode(new Node(0, 0));

    this.renderer.makeGlobalCoordinateSystemIcon(point);
  }

  makeDimensions() {
    this.renderer.makeDimensions();
  }

  makeBorder() {
    this.renderer.makeBorder();
  }

  // REFACTOR: wrong nameming. Point on the screen is not always a node.
  makeCursor(x: number, y: number) {
    return this.renderer.makeCursor(this.pointBuilder.getPointFromModelCoordinateSystem(x, y));
  }

  getNodePositionFromCursorPosition(cursorX: number, cursorY: number) {
    const node = this.pointBuilder.getNodeFromPoint(new Point(cursorX, cursorY));
    node.x = View.roundToNearest(node.x, 1);
    node.y = View.roundToNearest(node.y, 1);

    return node;
  }

  private static roundToNearest = (value: number, int: number) => {
    return Math.round(value/int)*int
  }

  updateView() {
    this.renderer.update();
  }

  clear() {
    this.renderer.clear();
  }

  // makeSth(x: number, y: number) {
  //   const p: Point = new Point(x - scenePosition.x, y - scenePosition.y);
  //   this.renderer.makeNode(p);
  // }
}
