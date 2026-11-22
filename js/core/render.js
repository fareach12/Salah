import {emit} from './bus.js';
import {tx} from './i18n.js';
export const refresh=()=>{emit('render');tx()};
