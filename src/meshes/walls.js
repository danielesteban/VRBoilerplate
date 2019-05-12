import { Color } from 'three';
import { Voxels } from 'vrengine';

class Walls extends Voxels {
  constructor() {
    const size = 32;
    const radius = size * 0.5;
    const color = new Color();
    super({
      generator: ({ x, y, z }) => {
        const bump = Math.random() >= 0.5;
        if (
          x === 0
          || (x === 1 && bump)
          || x === size - 1
          || (x === size - 2 && bump)
          || z === 0
          || (z === 1 && bump)
          || z === size - 1
          || (z === size - 2 && bump)
          || y === size - 1
        ) {
          color
            .setHex(0x333333)
            .offsetHSL(
              Math.random() * 0.2 - 0.2,
              Math.random() * 0.2 - 0.2,
              Math.random() * 0.2 - 0.2
            );
          return (
            (0x01 << 24)
            | (((color.r * 0xFF) & 0xFF) << 16)
            | (((color.g * 0xFF) & 0xFF) << 8)
            | ((color.b * 0xFF) & 0xFF)
          );
        }
        return 0x00;
      },
      size,
    });
    this.scale.set(5, 10, 5);
    this.position.set(-radius, -radius, -radius).multiply(this.scale);
  }
}

export default Walls;
