import { Renderer } from "./Renderer";
import { ConfigInterface } from "./Config/ConfigInterface";
import { Node, Element, Displacement, Boundary, Load } from "../Model";
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

  makeDisplacements(elements: Map<number, Element>, displacements: Map<Node, Displacement>, scaleFactor: number) {
    elements.forEach(e => {
      const p1: Point = this.pointBuilder.getPointFromNode(e.node1);
      const p2: Point = this.pointBuilder.getPointFromNode(e.node2);

      const d1 = displacements.get(e.node1);
      const d2 = displacements.get(e.node2);

      const dp1 = this.getDisplacedPoint(p1, d1, scaleFactor);
      const dp2 = this.getDisplacedPoint(p2, d2, scaleFactor);

      this.renderer.makeDisplacedElement(dp1, dp2);
    });
  }

  makeDisplacementLabels(displacements: Map<Node, Displacement>, scaleFactor: number) {
    displacements.forEach((d: Displacement, node: Node) => {
      const p: Point = this.pointBuilder.getPointFromNode(node)
      const dp = this.getDisplacedPoint(p, d, scaleFactor)

      this.renderer.makeDisplacementLabel(dp, `dx=${d.dx}, dy=${d.dy}`)
    })
  }

  private getDisplacedPoint(p: Point, d: Displacement, scaleFactor: number) {
    p.x -= d.dx * scaleFactor;
    p.y -= d.dy * scaleFactor;
    return p
  }

  makeElements(elements: Map<number, Element>) {
    elements.forEach(e => {
      const p1: Point = this.pointBuilder.getPointFromNode(e.node1);
      const p2: Point = this.pointBuilder.getPointFromNode(e.node2);

      this.renderer.makeElement(p1, p2);
    });
  }

  makeElementsLabels(elements: Map<number, Element>) {
    elements.forEach((e, nodeNumber) => {
      const p1: Point = this.pointBuilder.getPointFromNode(e.node1);
      const p2: Point = this.pointBuilder.getPointFromNode(e.node2);

      this.renderer.makeElementLabel(p1, p2, nodeNumber);
    });
  }

  makeNodes(nodes: Map<number, Node>) {
    nodes.forEach(n => {
      const p: Point = this.pointBuilder.getPointFromNode(n);

      this.renderer.makeNode(p);
    });
  }

  makeNodesLabels(nodes: Map<number, Node>) {
    nodes.forEach((n, nodeNumber) => {
      const p: Point = this.pointBuilder.getPointFromNode(n);

      this.renderer.makeNodeLabel(p, nodeNumber);
    });
  }

  makeSupports(boundaries: Map<Node, Boundary>) {
    boundaries.forEach((b, node) => {
      const p: Point = this.pointBuilder.getPointFromNode(node);

      this.renderer.makeSupport(p, b.xFixed, b.yFixed);
    });
  }

  makeLoads(loads: Map<Node, Load>) {
    loads.forEach((l, node) => {
      const p: Point = this.pointBuilder.getPointFromNode(node);

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
