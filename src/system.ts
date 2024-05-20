import { createSystem } from 'frog/ui';
import fs from 'fs';

const orbitronRegular = fs.readFileSync('./src/fonts/orbitron-regular.ttf');
const orbitronBold = fs.readFileSync('./src/fonts/orbitron-bold.ttf');

const { Text, vars } = createSystem({
  fonts: {
    default: [
      {
        name: 'Orbitron',
        data: orbitronRegular,
        source: 'buffer',
        weight: 400,
      },
      {
        name: 'Orbitron',
        data: orbitronBold,
        source: 'buffer',
        weight: 600,
      },
    ],
  },
  colors: {
    white100Base: '#FFFFFF',
    primary: '#9A5DEE',
  },
});

export { Text, vars };
