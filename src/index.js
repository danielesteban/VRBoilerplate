import VREngine from 'vrengine';
import scenes from '@/scenes';

VREngine({
  basename: __BASENAME__,
  mount: document.getElementById('mount'),
  scenes,
});
