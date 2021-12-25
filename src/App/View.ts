import { Renderer } from "./UI/Renderer";
import { ConfigInterface } from "./Config/ConfigInterface";
import { Node, Element, Displacement, Boundary, Load } from "./Model";
import { Point, PointBuilder } from "./UI/Point";


export default class View {
  private renderer: Renderer
  private pointBuilder: PointBuilder
  private nodeMap: Map<string, number>

  constructor(config: ConfigInterface) {
    this.pointBuilder = new PointBuilder(config);
    this.renderer = new Renderer(config, this.pointBuilder);
    this.nodeMap = new Map()
  }

  getRenderer(): Renderer {
    return this.renderer;
  }

  makeCurrentlySelected(itemType: string, itemNumber: number | undefined) {
    this.renderer.makeLabel(new Point(20, 20), `Currently selected: ${itemType}[${itemNumber}]`)
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

      this.renderer.makeDisplacementLabel(dp, `(${(Math.round(d.dx * 10000) / 10)}, ${Math.round(d.dy * 10000) / 10})`);
    })
  }

  private getDisplacedPoint(p: Point, d: Displacement, scaleFactor: number) {
    p.x += d.dx * scaleFactor;
    p.y -= d.dy * scaleFactor;
    return p
  }

  makeElements(elements: Map<number, Element>) {
    elements.forEach(element => {
      this.makeElement(element)
    });
  }

  makeElement(e: Element) {
    const p1: Point = this.pointBuilder.getPointFromNode(e.node1);
    const p2: Point = this.pointBuilder.getPointFromNode(e.node2);

    this.renderer.makeElement(p1, p2);
  }

  makeElementsLabels(elements: Map<number, Element>) {
    elements.forEach((e, elementNumber) => {
      this.makeElementLabel(e, elementNumber)
    });
  }

  makeElementLabel(element: Element, elementNumber: number) {
    const p1: Point = this.pointBuilder.getPointFromNode(element.node1);
    const p2: Point = this.pointBuilder.getPointFromNode(element.node2);

    this.renderer.makeElementLabel(p1, p2, elementNumber);
  }

  makeNodes(nodes: Map<number, Node>) {
    nodes.forEach((n, nodeId) => {
      this.makeNode(n, nodeId)
    });
  }

  makeNode(n: Node, nodeId: number) {
    const p: Point = this.pointBuilder.getPointFromNode(n);

    const sceneNodeId = this.renderer.makeNode(p, nodeId);
    this.nodeMap.set(sceneNodeId, nodeId)
  }

  getNodeIdBySceneId(sceneId: string): number {
    return this.nodeMap.get(sceneId);
  }

  makeNodesLabels(nodes: Map<number, Node>) {
    nodes.forEach((n, nodeNumber) => {
      this.makeNodeLabel(n, nodeNumber)
    });
  }

  makeNodeLabel(n: Node, nodeNumber: number) {
    const p: Point = this.pointBuilder.getPointFromNode(n);
    this.renderer.makeNodeLabel(p, nodeNumber);
  }

  makeSupports(boundaries: Map<Node, Boundary>) {
    boundaries.forEach((b, n) => {
      this.makeSupport(b, n)
    });
  }

  makeSupport(b: Boundary, n: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(n);
    this.renderer.makeSupport(p, b.xFixed, b.yFixed);
  }

  makeLoads(loads: Map<Node, Load>) {
    loads.forEach((l, n) => {
      this.makeLoad(l, n)
    });
  }

  makeLoad(l: Load, n: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(n);
    this.renderer.makeLoad(p, l.fx, l.fy);
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
}
