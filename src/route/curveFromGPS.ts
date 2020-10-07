import { Curve, MathUtils, Vector3 } from "three";
import {
  convertLatLngToPosition,
  IConvertLatLngToPosition,
} from "./convertLatLngToPosition";

// Convert latlng and altitude to 3D space

export class CurveFromGPS extends Curve<Vector3> {
  private points: Vector3[];
  private positionData: IConvertLatLngToPosition;

  constructor(latlngs: number[][], altitudes: number[]) {
    super();
    if (latlngs.length !== altitudes.length) {
      throw new Error("LatLng and Altitude data is not in sync");
    }

    this.positionData = convertLatLngToPosition(latlngs, altitudes);
    const xOffset = 0 - this.positionData.xLimits.diff / 2;
    const yOffset = 0 - this.positionData.yLimits.diff / 2;
    const zOffset = this.positionData.zLimits.min; // 0 - this.positionData.zLimits.diff / 2;
    this.points = this.positionData.positions.map(({ x, y, z }) => {
      return new Vector3(x + xOffset, y + yOffset, z);
    });
  }

  public getPoint(t: number): Vector3 {
    const index = t * (this.points.length - 1);
    const min = Math.floor(index);
    const max = Math.ceil(index);
    return new Vector3(
      MathUtils.lerp(this.points[min].x, this.points[max].x, index - min),
      MathUtils.lerp(this.points[min].y, this.points[max].y, index - min),
      MathUtils.lerp(this.points[min].z, this.points[max].z, index - min)
    );
  }

  public get width(): number {
    return this.positionData ? this.positionData.xLimits.diff : -1;
  }

  public get height(): number {
    return this.positionData ? this.positionData.yLimits.diff : -1;
  }
}
