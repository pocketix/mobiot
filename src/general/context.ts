import { createContext } from '@lit/context';
import { VarObject } from './interfaces';

export const varListExport = createContext<VarObject[]>('var-list');

export const condListExport = createContext<VarObject[]>('cond-list');

export const programIndexExport = createContext<number>('program-index');

export const detailGeneralExport = createContext<boolean>('getail-general');