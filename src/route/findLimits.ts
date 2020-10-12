export interface ILimits {
  min: number;
  max: number;
  diff: number;
}

export const findLimits = (input: number[]): ILimits => {
  const max = Math.max(...input);
  const min = Math.min(...input);
  const diff = max - min;
  return { max, min, diff };
};
