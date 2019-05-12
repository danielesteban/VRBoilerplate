import Menu from './menu';
import Level1 from './level1';
import Level2 from './level2';

export default [
  {
    path: '/',
    scene: Menu,
  },
  {
    path: '/play',
    scene: Level1,
  },
  {
    path: '/play/2',
    scene: Level2,
  },
];
