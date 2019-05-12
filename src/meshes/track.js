import { Voxels } from 'vrengine';

class Track extends Voxels {
  constructor({
    size = 16,
  } = {}) {
    const radius = size * 0.5;
    const left = radius - 3;
    const right = radius + 2;
    super({
      color: 0xAAAAAA,
      generator: ({ x, y, z }) => {
        if (
          (
            y === size - 1
            && x >= left
            && x <= right
            && (
              x === left
              || x === right
              || z % 4 === 0
            )
          )
          || (
            z % 8 === 0
            && (
              x === left
              || x === right
            )
          )
        ) {
          const light = Math.random() * 0xAA;
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
    this.scale.set(2, 0.5, 127 / size);
    this.position.set(radius * -this.scale.x, size * -this.scale.y, radius * -this.scale.z);
  }
}

export default Track;
