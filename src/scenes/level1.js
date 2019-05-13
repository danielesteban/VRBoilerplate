import {
  NearestFilter,
  Object3D,
  TextureLoader,
  Vector3,
} from 'three';
import {
  Scene,
  Floor,
  Voxels,
} from 'vrengine';
import {
  Ball,
  Sign,
  Walls,
} from '@/meshes';
import VoxelsTexture from '@/textures/voxels.png';
import DarkAmbient from '@/sounds/dark.ogg';

class Level1 extends Scene {
  constructor(args) {
    super(args);
    const { engine } = args;

    engine.setAmbientSounds([DarkAmbient]);
    engine.setBackgroundColor(0x330000);

    {
      const texture = new TextureLoader().load(VoxelsTexture);
      texture.repeat.set(1 / 8, 1);
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;
      this.voxelsTexture = texture;
    }

    // Spawn some huge walls
    const walls = new Walls();
    this.add(walls);

    // Spawn a platform
    {
      const size = 16;
      const platform = new Voxels({
        generator: ({ y }) => {
          if (
            y === 0
          ) {
            const light = (1 - Math.random() * 0.6) * 0x33;
            return (
              (0x03 << 24)
              | (light << 16)
              | (Math.floor(light * 0.25) << 8)
              | Math.floor(light * 0.25)
            );
          }
          return 0x00;
        },
        size,
        texture: this.voxelsTexture,
      });
      platform.position.set(size * -0.5, -1, size * -0.5);
      this.add(platform);
      this.intersects.push(platform);

      const ground = new Floor({
        width: size,
        height: size,
      });
      ground.material.visible = false;
      ground.position.y += 0.001;
      this.add(ground);
      this.intersects.push(ground);
    }

    // Spawn a disco ball
    const ball = new Ball({
      listener: engine.listener,
      color: 0x339933,
      position: { x: 0, y: 2.5, z: -3 },
    });
    this.add(ball);
    this.intersects.push(ball);

    // Spawn some floating voxels
    const voxelsContainer = new Object3D();
    {
      const size = 16;
      const origin = new Vector3(size * 0.5, size * 0.5, size * 0.5);
      const aux = new Vector3();
      const voxels = new Voxels({
        generator: ({ x, y, z }) => {
          const d = aux.set(x, y, z).distanceTo(origin);
          return (d > size * 0.6 && Math.random() >= 0.2) || Math.random() >= 0.9 ? (
            ((Math.floor(Math.random() * 8) + 1) << 24)
            | (((Math.random() * 0xFF) & 0xFF) << 16)
            | (((Math.random() * 0xFF) & 0xFF) << 8)
            | ((Math.random() * 0xFF) & 0xFF)
          ) : (
            0x00
          );
        },
        size,
        texture: this.voxelsTexture,
      });
      voxelsContainer.rotation.order = 'YXZ';
      voxelsContainer.rotation.x = Math.PI * 0.25;
      voxelsContainer.rotation.z = Math.PI * 0.25;
      voxels.onBeforeRender = ({ animation: { delta, time } }) => {
        voxelsContainer.position.y = 1.25 + (Math.sin(time * 2) * 0.02);
        voxelsContainer.rotation.y += delta * 0.25;
      };
      voxels.position.set(-8, -8, -8);
      voxelsContainer.scale.set(0.02, 0.02, 0.02);
      voxelsContainer.position.set(0, 1.25, -1.5);
      voxelsContainer.add(voxels);
      this.add(voxelsContainer);
      this.intersects.push(voxels);
    }

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
    sign.position.set(2.5, -0.25, -2.5);
    sign.lookAt(0, 1.25, 0);
    this.add(sign);
    this.intersects.push(...sign.intersects);
  }

  dispose() {
    super.dispose();
    this.voxelsTexture.dispose();
  }
}

export default Level1;
