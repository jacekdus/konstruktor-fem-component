import { Renderer } from "./UI/Renderer";
import { ConfigInterface } from "./Config/ConfigInterface";
import { Node, Element, Displacement, Boundary, Load, Force, Reaction } from "./Model";
import { Point, PointBuilder } from "./UI/Point";
import { TwoGroups } from "./UI/TwoGroups";
import SceneShapesCreator from "./UI/SceneShapesCreator";
import ResultsUtils from "./UI/ResultsUtils";


export default class View {
  private config: ConfigInterface
  private pointBuilder: PointBuilder
  private renderer: Renderer
  private rendererGroups: TwoGroups
  private sceneShapesCreator: SceneShapesCreator

  sceneNodeIdToNodeId: Map<string, number>;
  private sceneElementIdToElementId: Map<string, number>;

  constructor(config: ConfigInterface) {
    this.config = config;
    this.pointBuilder = new PointBuilder(this.config);
    this.renderer = new Renderer(this.config);
    this.rendererGroups = new TwoGroups();
    this.sceneShapesCreator = new SceneShapesCreator(this.config, this.pointBuilder);
    
    this.sceneNodeIdToNodeId = new Map<string, number>()
    this.sceneElementIdToElementId = new Map<string, number>()
  }

  resizeScene() {
    this.renderer.setSceneSize();
  }

  setNodes(nodes: Map<number, Node>) {
    nodes.forEach((n, nodeId) => {
      this.setNode(n, nodeId)
    });
  }

  setElements(elements: Map<number, Element>, nodes: Map<number, Node>) {
    elements.forEach((element, elementId) => {
      const node1 = nodes.get(element.node1Id);
      const node2 = nodes.get(element.node2Id);

      this.setElement(elementId, node1, node2)
    });
  }

  setSupports(boundaries: Map<number, Boundary>, nodes: Map<number, Node>) {
    boundaries.forEach((b, nodeId) => {
      this.setSupport(b, nodes.get(nodeId))
    });
  }

  setLoads(loads: Map<number, Load>, nodes: Map<number, Node>) {
    loads.forEach((l, nodeId) => {
      this.setLoad(l, nodes.get(nodeId))
    });
  }

  setReactions(reactions: Map<number, Reaction>, nodes: Map<number, Node>) {
    reactions.forEach((r, nodeId) => {
      this.setReaction(r, nodes.get(nodeId))
    });
  }

  setDisplacements(elements: Map<number, Element>, displacements: Map<number, Displacement>, nodes: Map<number, Node>) {
    elements.forEach(e => {
      const node1 = nodes.get(e.node1Id);
      const node2 = nodes.get(e.node2Id);

      const p1: Point = this.pointBuilder.getPointFromNode(node1);
      const p2: Point = this.pointBuilder.getPointFromNode(node2);

      const d1 = displacements.get(e.node1Id);
      const d2 = displacements.get(e.node2Id);

      const dp1 = this.getDisplacedPoint(p1, d1);
      const dp2 = this.getDisplacedPoint(p2, d2);

      const displacement = this.sceneShapesCreator.createDisplacedElement(dp1, dp2);
      this.rendererGroups.displacements.add(displacement);
    });

    nodes.forEach((node, nodeId) => {
      const displacement = displacements.get(nodeId);
      this.setDisplacementLabel(displacement, node);
    })
  }

  clearResults() {
    this.rendererGroups.displacements.remove(this.rendererGroups.displacements.children);
    this.rendererGroups.innerForces.remove(this.rendererGroups.innerForces.children);
    this.rendererGroups.innerForcesLegend.remove(this.rendererGroups.innerForcesLegend.children);
    this.rendererGroups.displacementsLabels.remove(this.rendererGroups.displacementsLabels.children);
    this.rendererGroups.reactions.remove(this.rendererGroups.reactions.children);
    this.rendererGroups.reactionsLabels.remove(this.rendererGroups.reactionsLabels.children);
  }

  setInnerForces(elements: Map<number, Element>, innerForces: Map<number, number>, nodes: Map<number, Node>) {
    ResultsUtils.setExtremalAxialForces(innerForces, this.config);

    elements.forEach((element, elementId) => {
      const node1 = nodes.get(element.node1Id);
      const node2 = nodes.get(element.node2Id);

      const currentInnerForce = innerForces.get(elementId);

      const rgbColor = ResultsUtils.getInnerForceRgbColor(currentInnerForce, this.config.results.axialForce);

      this.setInnerForceElement(node1, node2, rgbColor)
    });

    // for testing purposes
    // console.log(Array.from(innerForces).map(([key, value]) => ({ element: key, value: (value / 1000).toFixed(1) })));
  }

  setInnerForceElement(node1: Node, node2: Node, rgbColor: string) {
    const p1: Point = this.pointBuilder.getPointFromNode(node1);
    const p2: Point = this.pointBuilder.getPointFromNode(node2);
    const innerForceElement = this.sceneShapesCreator.createInnerForceElement(p1, p2, rgbColor);
    this.rendererGroups.innerForces.add(innerForceElement);

    this.renderer.update();
  }

  setNode(n: Node, nodeId: number) {
    const p: Point = this.pointBuilder.getPointFromNode(n);
    const sceneNode = this.sceneShapesCreator.createNode(p);
    this.rendererGroups.nodes.add(sceneNode);
    this.sceneNodeIdToNodeId.set(sceneNode.id, nodeId);

    this.setNodeLabel(n, nodeId);

    this.renderer.update();
  }

  setElement(elementId: number, node1: Node, node2: Node) {
    const p1: Point = this.pointBuilder.getPointFromNode(node1);
    const p2: Point = this.pointBuilder.getPointFromNode(node2);
    const sceneElement = this.sceneShapesCreator.createElement(p1, p2);
    this.rendererGroups.elements.add(sceneElement);
    this.sceneElementIdToElementId.set(sceneElement.id, elementId);

    this.setElementLabel(elementId, node1, node2);

    this.renderer.update();
  }

  setSupport(b: Boundary, n: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(n);
    const support = this.sceneShapesCreator.createSupport(p, b.xFixed, b.yFixed);
    this.rendererGroups.supports.add(support)

    this.renderer.update();
  }

  setLoad(l: Load, n: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(n);
    
    if (l.fx) {
      const load = this.sceneShapesCreator.createHorizontalLoad(p, l.fx)
      this.rendererGroups.loads.add(load)
    }

    if (l.fy) {
      const load = this.sceneShapesCreator.createVerticalLoad(p, l.fy)
      this.rendererGroups.loads.add(load)
    }

    this.setLoadLabel(l, n)

    this.renderer.update();
  }

  setReaction(r: Reaction, n: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(n);
    
    if (r.fx) {
      const load = this.sceneShapesCreator.createHorizontalReaction(p, r.fx)
      this.rendererGroups.reactions.add(load)
    }

    if (r.fy) {
      const load = this.sceneShapesCreator.createVerticalReaction(p, r.fy)
      this.rendererGroups.reactions.add(load)
    }

    this.setReactionLabel(r, n)

    this.renderer.update();
  }

  setCoordinateSystemIcon() {    
    const point = this.pointBuilder.getPointFromNode(new Node(0, 0));

    const gcsi = this.sceneShapesCreator.createGlobalCoordinateSystemIcon(point);
    this.rendererGroups.other.add(gcsi);

    this.renderer.update();
  }

  setDimensions() {
    const dimensions = this.sceneShapesCreator.createDimensions();
    this.rendererGroups.other.add(dimensions);

    this.renderer.update();
  }

  setBorder() {
    const border = this.sceneShapesCreator.createBorder();
    this.rendererGroups.other.add(border);

    this.renderer.update();
  }

  private setNodeLabel(n: Node, nodeId: number) {
    const p: Point = this.pointBuilder.getPointFromNode(n);

    const nodeLabel = this.sceneShapesCreator.createNodeLabel(p, nodeId);
    this.rendererGroups.nodesLabels.add(nodeLabel);

    this.renderer.update();
  }

  private setElementLabel(elementId: number, node1: Node, node2: Node) {
    const p1: Point = this.pointBuilder.getPointFromNode(node1);
    const p2: Point = this.pointBuilder.getPointFromNode(node2);

    const elementLabel = this.sceneShapesCreator.createElementLabel(p1, p2, elementId)
    this.rendererGroups.elementsLabels.add(elementLabel);

    this.renderer.update();
  }

  private setLoadLabel(load: Load, node: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(node)

    const loadLabel = this.sceneShapesCreator.createLoadLabel(p, load.fx, load.fy);
    this.rendererGroups.loadsLabels.add(loadLabel);

    this.renderer.update();
  }

  private setReactionLabel(reaction: Reaction, node: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(node)

    const reactionLabel = this.sceneShapesCreator.createReactionLabel(p, reaction.fx, reaction.fy);
    this.rendererGroups.reactionsLabels.add(reactionLabel);

    this.renderer.update();
  }

  private setDisplacementLabel(displacement: Displacement, node: Node) {
    const p: Point = this.pointBuilder.getPointFromNode(node);
    
    const label = this.sceneShapesCreator.createDisplacementLabel(p, displacement.dx, displacement.dy)
    this.rendererGroups.displacementsLabels.add(label);

    this.renderer.update();
  }

  private getDisplacedPoint(p: Point, d: Displacement) {
    p.x += d.dx * this.config.scaleFactor.displacements;
    p.y -= d.dy * this.config.scaleFactor.displacements;
    return p
  }

  render() {
    this.renderer.clear();

    if (this.config.isVisible.supports) {
      this.renderer.render(this.rendererGroups.supports);
    }

    if (this.config.isVisible.elements) {
      this.renderer.render(this.rendererGroups.elements);

      if (this.config.isVisible.labels.all) {
        this.renderer.render(this.rendererGroups.elementsLabels);
      }
    }

    if (this.config.isVisible.nodes) {
      this.renderer.render(this.rendererGroups.nodes);
      
      if (this.config.isVisible.labels.all) {
        this.renderer.render(this.rendererGroups.nodesLabels);
      }
    }

    if (this.config.isVisible.loads) {
      this.renderer.render(this.rendererGroups.loads);
      
      if (this.config.isVisible.labels.all) {
        this.renderer.render(this.rendererGroups.loadsLabels);
      }
    }

    if (this.config.isVisible.results.displacements) {
      this.renderer.render(this.rendererGroups.displacements);
      this.renderer.render(this.rendererGroups.displacementsLabels);
    }

    if (this.config.isVisible.results.innerForces) {
      this.renderer.render(this.rendererGroups.innerForces);
      this.renderer.render(this.rendererGroups.innerForcesLegend);
    }

    if (this.config.isVisible.results.reactions) {
      this.renderer.render(this.rendererGroups.reactions);
      this.renderer.render(this.rendererGroups.reactionsLabels);
    }
    
    this.renderer.render(this.rendererGroups.other);
    this.renderer.render(this.rendererGroups.cursor);
    this.renderer.render(this.rendererGroups.cursorLabel);

    this.renderer.update();

    this.config.elements.two.nodes = this.rendererGroups.nodes._renderer.elem;
  }

  clearSceneObjects() {
    this.rendererGroups.clear();
  }

  remove(twoObj: any) {
    this.renderer.remove(twoObj);
  }

  setCursor() {
    const cursor = this.sceneShapesCreator.createCursor();
    const cursorLabel = this.sceneShapesCreator.createCursorLabel();

    this.rendererGroups.cursor = cursor;
    this.rendererGroups.cursorLabel = cursorLabel;
  }

  moveCursor(nodeX: number, nodeY: number) {
    const currentPointPosition = this.pointBuilder.getPointFromModelCoordinateSystem(nodeX, nodeY)
    
    this.rendererGroups.cursor.position.x = currentPointPosition.x
    this.rendererGroups.cursor.position.y = currentPointPosition.y

    this.renderer.update();
  }

  updateCursorPositionLabel() {
    this.rendererGroups.cursorLabel.children[0].value = this.config.cursor.message;

    this.renderer.update();
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

  highlightNode(sceneNodeId: string) {
    this.rendererGroups.nodes.getById(sceneNodeId).fill = 'blue';

    this.renderer.update();
  }

  unHighlightNode(sceneNodeId: string) {
    this.rendererGroups.nodes.getById(sceneNodeId).fill = 'white';

    this.renderer.update();
  }

  setInnerForceLegend() {
    const {max, min} = this.config.results.axialForce
    const innerForceLegend = this.sceneShapesCreator.createInnerForceLegend(max, min);

    this.rendererGroups.innerForcesLegend.add(innerForceLegend);
    this.setInnerForcesLegendPosition();
  }

  setInnerForcesLegendPosition() {
    if (this.rendererGroups.innerForcesLegend.children.length > 0) {
      this.rendererGroups.innerForcesLegend.children[0].position.x = this.config.two.width - 100;
      this.rendererGroups.innerForcesLegend.children[0].position.y = this.config.two.height - 125;

      this.renderer.update();
    }
  }
}
