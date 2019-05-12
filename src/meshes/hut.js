import { Vector3 } from 'three';
import { Floor, Voxels } from 'vrengine';

class Hut extends Voxels {
  constructor({
    size = 12,
  } = {}) {
    const radius = size * 0.5;
    const aux = new Vector3();
    const center = new Vector3(radius - 0.5, radius * 0.75, radius - 0.5);
    super({
      generator: ({ x, y, z }) => {
        const dome = aux.set(x, y, z).distanceTo(center);
        if (
          (
            y < radius
            && (
              (
                y === 0
                || (
                  (x === 0 || x === size - 1)
                  && ((z !== radius && z !== radius - 1) || y > radius * 0.5)
                )
                || ((z === 0 || z === size - 1) && y !== radius * 0.5 && y !== radius * 0.5 - 1)
              )
            )
          )
          || (
            y >= radius - 1
            && dome > radius * 0.75
            && dome < radius * 0.9
          )
        ) {
          const light = Math.random() * 0x88;
          return (
            (0x01 << 24)
            | ((light & 0xFF) << 16)
            | ((light & 0xFF) << 8)
            | (light & 0xFF)
          );
        }
        return 0x00;
      },
      size,
    });
    this.position.set(-radius, -1, -radius);
    const floor = new Floor({
      width: size,
      height: size,
    });
    floor.material.visible = false;
    floor.position.set(radius, 1.001, radius);
    this.add(floor);
    this.intersects = [this, floor];
  }
}

export default Hut;
