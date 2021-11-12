import { ConfigInterface } from './Config/ConfigInterface';
import { Node } from './Model';

export class Point {
  constructor(
    public x: number, 
    public y: number
  ) {}
}

export class PointBuilder {
  constructor(private config: ConfigInterface) {}

  getPointFromModelCoordinateSystem(x: number, y: number): Point {
    return new Point(this.getPointXfromNodeX(x), this.getPointYfromNodeY(y));
  }
  
  getPointFromNode(n: Node) {
    return new Point(this.getPointXfromNodeX(n.x), this.getPointYfromNodeY(n.y));
  }

  getNodeFromPoint(p: Point) {
    return new Node(this.getNodeXfromPointX(p.x), this.getNodeYfromPointY(p.y));
  }

  private getNodeXfromPointX(x: number): number {
    return this.scalePointToNode(x - this.config.translationValue) ;
  }

  private getNodeYfromPointY(y: number) {
    return this.scalePointToNode(this.config.two.height - y - this.config.translationValue);
  }

  private getPointXfromNodeX(x: number): number {
    return this.scaleNodeToPoint(x) + this.config.translationValue;
  }

  private getPointYfromNodeY(y: number): number {
    return this.config.two.height - ( this.scaleNodeToPoint(y) + this.config.translationValue );
  }

  private scaleNodeToPoint(value: number) {
    return value * this.config.scaleFactor.model;
  }

  private scalePointToNode(value: number) {
    return value / this.config.scaleFactor.model;
  }
}