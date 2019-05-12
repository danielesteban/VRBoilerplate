import {
  BoxGeometry,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  VertexColors,
} from 'three';
import { UI } from 'vrengine';

class Sign extends Object3D {
  constructor(ui) {
    if (!Sign.supportGeometry) {
      const geometry = new BoxGeometry(0.1, 2, 0.05, 1, 1, 1);
      geometry.faces.forEach((face, i) => {
        if (i % 2 === 1) {
          face.color.offsetHSL(0, 0, Math.random() * -0.1);
          geometry.faces[i - 1].color.copy(face.color);
        }
      });
      geometry.translate(0, 0.3, 0);
      Sign.supportGeometry = (new BufferGeometry()).fromGeometry(geometry);
    }
    if (!Sign.supportMaterial) {
      Sign.supportMaterial = new MeshBasicMaterial({
        color: 0x333333,
        vertexColors: VertexColors,
      });
    }
    super();
    const panel = new UI(ui);
    panel.position.y += 1.48;
    const support = new Mesh(
      Sign.supportGeometry,
      Sign.supportMaterial
    );
    this.add(panel);
    this.add(support);
    this.intersects = [panel, support];
  }
}

export default Sign;
