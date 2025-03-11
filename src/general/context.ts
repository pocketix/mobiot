import { createContext } from '@lit/context';
import { VarObject } from './interfaces';

export const varListExport = createContext<VarObject[]>('var-list');

export const condListExport = createContext<VarObject[]>('cond-list');