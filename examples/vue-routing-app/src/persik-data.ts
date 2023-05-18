import { PersikInfo } from '@/type';

export const PERSIK_DATA: { [key in string]: PersikInfo } = {
  '/persik': {
    img: require('./assets/persik.png'),
    title: 'Персик!',
    key: '/persik',
  },
  '/persik/fish': {
    img: require('./assets/persik_fish.png'),
    title: 'Персик с рыбой',
    key: '/persik/fish',
  },
  '/persik/sad': {
    img: require('./assets/persik_sad.png'),
    title: 'Персик грустит',
    key: '/persik/sad',
  },
};
