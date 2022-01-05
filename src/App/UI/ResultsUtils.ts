import { ConfigInterface } from "../Config/ConfigInterface";
import { Displacement } from "../Model";

export default class ResultsUtils {
  private static maxDisplacementSizeInPx: number = 50;

  static setDisplacementsScaleFactor(displacements: Map<number, Displacement>, config: ConfigInterface) {
    const maxAbsDisplacementValue: number = ResultsUtils.getMaxAbsDisplacementValue(displacements);
    config.scaleFactor.displacements = ResultsUtils.maxDisplacementSizeInPx / maxAbsDisplacementValue;
  }

  private static getMaxAbsDisplacementValue(displacements: Map<number, Displacement>) {
    let absMax = 0;
    
    displacements.forEach(d => {
      if (absMax < Math.abs(d.dx)) {
        absMax = Math.abs(d.dx);
      }

      if (absMax < Math.abs(d.dy)) {
        absMax = Math.abs(d.dy);
      }
    });

    return absMax;
  }

  static setExtremalAxialForces(values: Map<number, number>, config: ConfigInterface) {
    const extremalValues = { max: 0, min: 0 };

    for (const [id, value] of values) {
      if (value > extremalValues.max) {
        extremalValues.max = value;
      }

      if (value < extremalValues.min) {
        extremalValues.min = value;
      }
    }

    config.results.axialForce = extremalValues;
  }

  static getInnerForceRgbColor(currentValue: number, extremeValues: {max: number, min: number}) {
    const {max, min} = extremeValues;

    const val1 = 255 / (max - min) * ( currentValue - min )
    const val2 = 255 - val1;

    return ResultsUtils.getRgbStringFromNumbers(val2.toFixed(1), val1.toFixed(1), val1.toFixed(1))
  }

  private static getRgbStringFromNumbers(red: string, green: string, blue: string) {
    return `rgb(${red}, ${green}, ${blue})`;
  }
}
