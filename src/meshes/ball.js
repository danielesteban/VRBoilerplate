import {
  AudioLoader,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PositionalAudio,
  SphereGeometry,
  VertexColors,
} from 'three';
import Music from '@/sounds/music.ogg';

class Ball extends Mesh {
  constructor({
    listener,
    color,
    radius = 0.5,
    position,
  }) {
    const geometry = new SphereGeometry(radius, 32, 32);
    geometry.faces.forEach((face, i) => {
      if (i % 2 === 1) {
        face.color.offsetHSL(0, 0, Math.random() * -0.05);
        geometry.faces[i - 1].color.copy(face.color);
      }
    });
    super(
      (new BufferGeometry()).fromGeometry(geometry),
      new MeshBasicMaterial({
        color,
        vertexColors: VertexColors,
      })
    );
    this.audio = new PositionalAudio(listener);
    this.audio.setLoop(true);
    this.audio.setRefDistance(0.5);
    const audioLoader = new AudioLoader();
    audioLoader.load(Music, (buffer) => {
      this.audio.setBuffer(buffer);
    });
    this.add(this.audio);
    this.position.set(position.x, position.y, position.z);
    this.isActive = false;
  }

  get isActive() {
    return this._isActive || false;
  }

  set isActive(value) {
    const {
      audio,
      material,
      scale,
    } = this;
    this._isActive = value;
    scale.set(1, 1, 1);
    material.color.setHex(value ? 0xffffff : 0x333333);
    if (value) {
      audio.play();
    } else if (audio.isPlaying) {
      audio.stop();
    }
  }

  onBeforeRender({ animation: { delta, time } }) {
    const { isActive } = this;
    if (!isActive) {
      return;
    }
    const s = 1 + (Math.sin(time * 12) * 0.05);
    this.scale.set(s, s, s);
    this.rotateY(delta);
  }

  onPointer({ isPrimary }) {
    const { isActive } = this;
    if (isPrimary) {
      this.isActive = !isActive;
    }
  }

  dispose() {
    const { audio, geometry, material } = this;
    if (audio.isPlaying) {
      audio.stop();
    }
    geometry.dispose();
    material.dispose();
  }
}

export default Ball;
