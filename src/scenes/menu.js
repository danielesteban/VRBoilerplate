import { Vector3 } from 'three';
import {
  Scene,
  Birds,
  Heightmap,
  Starfield,
  UI,
  Water,
} from 'vrengine';
import {
  Hut,
  Plant,
  Sign,
  Tree,
} from '@/meshes';
import Ambient from '@/sounds/sea.ogg';

class Menu extends Scene {
  constructor(args) {
    super(args);
    const { engine } = args;
    const aux = new Vector3();

    engine.setAmbientSounds([Ambient]);
    engine.setBackgroundColor(0x333366);

    // Spawn a heightmap
    const origin = new Vector3(63.5, 0, 63.5);
    const radius = Math.sqrt(64 * 64 + 64 * 64);
    const ground = new Heightmap({
      color: 0x335522,
      map: [...Array(128)].map((v, z) => ([...Array(128)].map((v, x) => {
        const d = aux.set(x, 0, z).distanceTo(origin);
        return (
          Math.random() * 0.5
          + (Math.cos(x * 0.25) + Math.sin(z * 0.5)) * (1 / 3)
          + (radius - (d * 0.1))
        );
      }))),
    });
    ground.position.y -= ground.maxDepth;
    this.add(ground);
    this.intersects.push(ground);

    // Spawn some water chunks
    const water = new Water();
    water.position.set(0, -5.75, 0);
    this.add(water);
    this.animations.push(Water.onAnimationTick);

    // Spawn a starfield
    const stars = new Starfield();
    this.add(stars);

    // Spawn a voxel hut
    const hut = new Hut({
      size: 12,
    });
    this.add(hut);
    this.intersects.push(...hut.intersects);

    // Spawn some voxel trees
    for (let i = 0; i < 32; i += 1) {
      const tree = new Tree();
      tree.position.add(
        aux
          .set(
            Math.random() * 2 - 1,
            0,
            Math.random() * 2 - 1
          )
          .normalize()
          .multiplyScalar(16 + Math.random() * 32)
      );
      tree.position.y = ground.getFloorY({ x: aux.x, z: aux.z }) - 0.5;
      this.add(tree);
      this.intersects.push(tree);
    }

    // Spawn some voxel plants
    for (let i = 0; i < 32; i += 1) {
      const plant = new Plant();
      plant.position.add(
        aux
          .set(
            Math.random() * 2 - 1,
            0,
            Math.random() * 2 - 1
          )
          .normalize()
          .multiplyScalar(16 + Math.random() * 40)
      );
      plant.position.y = ground.getFloorY({ x: aux.x, z: aux.z }) - 0.05;
      this.add(plant);
      this.intersects.push(plant);
    }

    // Spawn some birds
    const birds = new Birds();
    birds.origin.set(0, -16, 0);
    this.add(birds);
    this.animations.push(birds.onAnimationTick);

    // Spawn a UI display
    const display = new UI({
      width: 1,
      height: 1,
      textureWidth: 512,
      textureHeight: 512,
      labels: [
        {
          font: '700 60px monospace',
          text: __TITLE__,
          x: 256,
          y: 220,
        },
        {
          font: '700 40px monospace',
          text: __VERSION__,
          x: 256,
          y: 280,
        },
      ],
      styles: {
        background: 'rgba(0, 0, 0, 0)',
      },
    });
    display.position.set(0, 2.5, -2.4);
    display.lookAt(0, 1, 0);
    this.add(display);

    // Spawn a sign
    const sign = new Sign({
      buttons: [
        {
          label: 'Level 01',
          x: 128 - 100,
          y: 140 - 25,
          width: 200,
          height: 50,
          onPointer: ({ isPrimary }) => {
            if (isPrimary) engine.router.goTo('/play');
          },
        },
        {
          label: 'Level 02',
          x: 128 - 100,
          y: 200 - 25,
          width: 200,
          height: 50,
          onPointer: ({ isPrimary }) => {
            if (isPrimary) engine.router.goTo('/play/2');
          },
        },
      ],
      graphics: [
        ({ ctx }) => {
          ctx.strokeStyle = '#fff';
          ctx.translate(128, 32);
          for (let i = 0; i < 32; i += 1) {
            const x = Math.random() * 50;
            const y = Math.random() * 50;
            ctx.beginPath();
            ctx.moveTo(-x, 50 - y);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        },
      ],
      styles: {
        button: {
          background: '#393',
        },
      },
    });
    sign.position.set(0, 0, -2.5);
    this.add(sign);
    this.intersects.push(...sign.intersects);
  }
}

export default Menu;
