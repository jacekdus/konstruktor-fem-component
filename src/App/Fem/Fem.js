import { multiply, inv } from "mathjs";

export class Fem {
  static calculateDisplacements = (globalStiffnessMatrix, forcesMatrix) => {
    const result = multiply(inv(globalStiffnessMatrix), forcesMatrix);

    if (typeof result === 'number') {
      return result;
    }

    return result.toArray();
  }
}
