import {
  Mesh,
  Vector3,
} from 'three';
import {
  Scene,
  Heightmap,
  Starfield,
  Water,
} from 'vrengine';
import {
  Plant,
  Sign,
  Track,
  Train,
  Tree,
} from '@/meshes';
import Ambient from '@/sounds/sea.ogg';
import TrainAmbient from '@/sounds/train.ogg';

class Level2 extends Scene {
  constructor(args) {
    super(args);
    const { engine } = args;

    engine.setAmbientSounds([
      Ambient,
      { file: TrainAmbient, volume: 0.15 },
    ]);
    engine.setBackgroundColor(0x666699);
    // engine.camera.debug.active = true;

    // Spawn a voxel train
    const train = new Train();
    this.add(train);
    this.intersects.push(...train.intersects);

    // Spawn some heightmaps
    const aux = new Vector3();
    const origin = new Vector3(63.5, 0, 63.5);
    const radius = Math.sqrt(64 * 64 + 64 * 64);
    const ground = new Heightmap({
      color: 0x550033,
      map: [...Array(128)].map((v, z) => ([...Array(128)].map((v, x) => {
        const d = aux.set(x, 0, z).distanceTo(origin);
        return (
          Math.random() * 0.5
          + (Math.cos(x * 0.25) + Math.sin(z * 0.5)) * (1 / 3)
          + (radius - (d * 0.1))
        );
      }))),
    });
    const heightmaps = [...Array(3)].map((v, i) => {
      const mesh = new Mesh(
        ground.geometry,
        ground.material
      );
      mesh.position.y -= ground.maxDepth + 3;
      mesh.position.z = 127 - 127 * i;
      // Spawn a voxel track
      const track = new Track();
      track.position.y += ground.maxDepth;
      mesh.add(track);
      // Spawn some voxel trees
      for (let i = 0; i < 16; i += 1) {
        const tree = new Tree();
        tree.position.add(
          aux
            .set(
              (Math.random() * 0.5 + 0.5) * (Math.random() >= 0.5 ? 1 : -1),
              0,
              Math.random() * 2 - 1
            )
            .normalize()
            .multiplyScalar(16 + Math.random() * 32)
        );
        tree.position.y = ground.getFloorY({ x: aux.x, z: aux.z }) - 0.5;
        mesh.add(tree);
      }
      // Spawn some voxel plants
      for (let i = 0; i < 16; i += 1) {
        const plant = new Plant();
        plant.position.add(
          aux
            .set(
              (Math.random() * 0.5 + 0.5) * (Math.random() >= 0.5 ? 1 : -1),
              0,
              Math.random() * 2 - 1
            )
            .normalize()
            .multiplyScalar(16 + Math.random() * 40)
        );
        plant.position.y = ground.getFloorY({ x: aux.x, z: aux.z }) - 0.05;
        mesh.add(plant);
      }
      this.add(mesh);
      return mesh;
    });

    // Spawn some water chunks
    const water = new Water();
    water.position.set(0, -8.75, 0);
    this.add(water);
    this.animations.push(Water.onAnimationTick);

    // Animate the scenery
    this.animations.push(({ delta }) => {
      const step = delta * 8;
      heightmaps.forEach((mesh) => {
        mesh.position.z += step;
        if (mesh.position.z > 190) {
          mesh.position.z -= 127 * heightmaps.length;
        }
      });
      water.position.z = (water.position.z + step) % 96;
    });

    // Spawn a starfield
    const stars = new Starfield();
    this.add(stars);

    // Spawn a sign
    const sign = new Sign({
      buttons: [
        {
          label: 'Back to Menu',
          x: 128 - 110,
          y: 128 - 25,
          width: 220,
          height: 50,
          onPointer: ({ isPrimary }) => {
            if (isPrimary) engine.router.goTo('/');
          },
        },
      ],
      graphics: [
        ({ ctx }) => {
          for (let i = 0; i < 128; i += 1) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const l = (Math.random() * 0.3 + 0.5) * 0x100;
            ctx.fillStyle = `rgba(${l}, ${l}, ${l}, .5)`;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 5 + 1, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      ],
      styles: {
        button: {
          background: '#393',
        },
      },
    });
    sign.position.set(0, 0, -6.5);
    this.add(sign);
    this.intersects.push(...sign.intersects);
  }
}

export default Level2;
