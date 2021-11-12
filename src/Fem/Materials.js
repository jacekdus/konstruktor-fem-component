export class Material {
  constructor(name, youngsModulus, weight) {
    this.name = name;
    this.youngsModulus = youngsModulus;
    this.weight = weight;
  }
}

export const steel = new Material('steel', 210000000000.0, 78500.0);

export const concrete = (concreteClass) => {
  switch (concreteClass) {
    case 'C30/37':
      return new Material('C30/37', 32000000000.0, 25000.0)
    default:
      return new Material('C12/15', 27000000000.0, 25000.0)
  }
}
