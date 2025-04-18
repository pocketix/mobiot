import { Block } from "./interfaces";

export const blockTypes: Block[] = [
    { name: "Repeat", simple: false, id: "repeat", argTypes: ['number'], type: 'cycle' },
    { name: "While", simple: false, id: "while", argTypes: ['cond'], type: 'cycle' },
    { name: "Send notification", simple: true, id: "alert", argTypes: ['text'], type: 'alert' },
    { name: "If", simple: false, id: "if", argTypes: ['cond'], type: 'branch' },
    { name: "Else", simple: false, id: "else", argTypes: [], type: 'branch' },
    { name: "Otherwise", simple: false, id: "elseif", argTypes: ['cond'], type: 'branch' },
    { name: "Switch according", simple: false, id: "switch", argTypes: ['number'], type: 'branch' },
    { name: "Case", simple: false, id: "case", argTypes: ['number'], type: 'branch' },
    { name: "End of block", simple: true, id: "end", argTypes: [], type: 'end' },
    { name: "Set Variable", simple: true, id: "setvar", argTypes: ['variable', 'note'], type: 'set_var' },
    { name: "LED1.setLedColor", simple: true, id: "LED1.setLedColor", argTypes: ['bool'], type: 'dev' },
    { name: "wateringGreen1.setWater", simple: true, id: "waterGreen1.setWater", argTypes: [], type: 'dev' },
    { name: "vacuumCleaner1.cleanRoom", simple: true, id: "vacuumCleaner1.cleanRoom", argTypes: [], type: 'dev' }
];