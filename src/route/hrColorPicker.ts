import { Color, MathUtils } from "three";

interface IStep {
  value: number;
  color: Color;
}

export const hrColorPicker = (
  steps: IStep[],
  data: number[]
): ((t: number) => Color) => {
  const sortedSteps = steps.sort((a, b) => a.value - b.value);
  return (t: number): Color => {
    const index = t * (data.length - 1);
    const min = Math.floor(index);
    const max = Math.ceil(index);
    const value = MathUtils.lerp(data[min], data[max], index - min);

    let lower: IStep | null = null;
    let higher: IStep | null = null;

    sortedSteps.forEach((step) => {
      if (value > step.value) {
        lower = step;
      }
      if (value < step.value && !higher) {
        higher = step;
      }
    });

    if (lower && higher) {
      const percentage = (value - lower.value) / (higher.value - lower.value);
      return lower.color.clone().lerp(higher.color, percentage);
    } else if (lower) {
      return lower.color;
    } else {
      return new Color(0x000000);
    }
  };
};
