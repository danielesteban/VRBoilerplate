import { Color, Vector3 } from 'three';
import { Voxels } from 'vrengine';

class Tree extends Voxels {
  constructor() {
    const leaves = Math.floor(Math.random() * 3 + 3);
    const trunk = Math.floor(Math.random() * 5 + leaves * 2);
    const size = trunk + leaves;
    const radius = size * 0.5;
    const aux = new Vector3();
    const center = new Vector3(radius + 0.5, trunk, radius + 0.5);
    const colors = {
      trunk: new Color().setHSL(Math.random(), 0.4, 0.4),
      leaves: new Color().setHSL(Math.random(), 0.6, 0.6),
    };
    const color = new Color();
    super({
      generator: ({ x, y, z }) => {
        if (
          y <= trunk
          && x >= radius && x <= radius + 1
          && z >= radius && z <= radius + 1
        ) {
          color
            .copy(colors.trunk)
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
        if (
          aux.set(x, y, z).distanceTo(center) <= leaves
        ) {
          color
            .copy(colors.leaves)
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
    this.position.set(-radius, 0, -radius);
  }
}

export default Tree;
