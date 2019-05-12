import { Color, Vector3 } from 'three';
import { Voxels } from 'vrengine';

class Plant extends Voxels {
  constructor() {
    const size = 32;
    const radius = size * 0.5;
    const map = new Uint32Array(size * size * size);
    const count = 64;
    const voxel = new Vector3();
    const direction = new Vector3();
    const color = new Color();
    for (let v = 0; v < count; v += 1) {
      voxel.set(
        radius - 5 + (Math.random() * 11),
        0,
        radius - 5 + (Math.random() * 11)
      );
      direction.set(
        Math.random() * 2 - 1,
        Math.random() * 0.5 + 0.25,
        Math.random() * 2 - 1
      ).normalize();
      color.setHSL(
        0.3 + Math.random() * 0.1,
        0.8 - Math.random() * 0.4,
        0.4 - Math.random() * 0.2
      );
      while (true) { // eslint-disable-line no-constant-condition
        let { x, y, z } = voxel;
        x = Math.round(x);
        y = Math.round(y);
        z = Math.round(z);
        if (
          x < size * 0.2
          || x >= size * 0.8
          || y < 0
          || y > size - 1
          || z < size * 0.2
          || z >= size * 0.8
        ) {
          break;
        }
        const index = z * size * size + y * size + x;
        map[index] = (
          (0x01 << 24)
          | (((color.r * 0xFF) & 0xFF) << 16)
          | (((color.g * 0xFF) & 0xFF) << 8)
          | ((color.b * 0xFF) & 0xFF)
        );
        voxel.addScaledVector(direction, 0.5);
      }
    }
    super({
      map,
      size,
    });
    this.scale.set(0.02, 0.04, 0.02);
    this.position.set(radius * -this.scale.x, 0, radius * -this.scale.z);
  }
}

export default Plant;
