import { Floor, Voxels } from 'vrengine';

class Train extends Voxels {
  constructor({
    size = 16,
  } = {}) {
    const radius = size * 0.5;
    super({
      color: 0x995533,
      generator: ({ x, y, z }) => {
        if (
          x >= Math.ceil(size * 0.2)
          && x < Math.floor(size * 0.8)
          && y <= Math.ceil(size * 0.2)
          && (
            y === 0
            || y === Math.ceil(size * 0.2)
            || (
              (
                z === 0
                || z === size - 1
              )
              && (
                y === 1
                || x === Math.ceil(size * 0.2)
                || x === Math.floor(size * 0.8) - 1
              )
            )
            || (
              (
                x === Math.ceil(size * 0.2)
                || x === Math.floor(size * 0.8) - 1
              )
              && y === 1
            )
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
    this.position.set(radius * -1, -1, radius * -1);
    const floor = new Floor({
      width: size * 0.5 - 2,
      height: size - 2,
    });
    floor.material.visible = false;
    floor.position.set(radius, 1.001, radius);
    this.add(floor);
    this.intersects = [this, floor];
  }
}

export default Train;
