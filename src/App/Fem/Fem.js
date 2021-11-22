import { multiply, inv } from "mathjs";

export class Fem {
  static calculateDisplacements = (globalStiffnessMatrix, forcesMatrix) => {
    return multiply(inv(globalStiffnessMatrix), forcesMatrix).toArray();
  }
}
