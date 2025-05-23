import { Block } from "./interfaces";

export const blockTypes: Block[] = [
    { name: "Repeat", simple: false, id: "repeat", argTypes: ['number'], type: 'cycle' },
    { name: "While", simple: false, id: "while", argTypes: ['cond'], type: 'cycle' },
    { name: "SendNotification", simple: true, id: "alert", argTypes: ['text'], type: 'alert' },
    { name: "If", simple: false, id: "if", argTypes: ['cond'], type: 'branch' },
    { name: "Else", simple: false, id: "else", argTypes: [], type: 'branch' },
    { name: "Otherwise", simple: false, id: "elseif", argTypes: ['cond'], type: 'branch' },
    { name: "SwitchAccording", simple: false, id: "switch", argTypes: ['number'], type: 'branch' },
    { name: "Case", simple: false, id: "case", argTypes: ['number'], type: 'branch' },
    { name: "EndOfBlock", simple: true, id: "end", argTypes: [], type: 'end' },
    { name: "SetVariable", simple: true, id: "setvar", argTypes: ['variable', 'note'], type: 'set_var' },
    { name: "LED-1.setLedColor", simple: true, id: "LED-1.setLedColor", argTypes: ['bool'], type: 'dev' },
    { name: "wateringGreen-1.setWater", simple: true, id: "waterGreen-1.setWater", argTypes: [], type: 'dev' },
    { name: "wateringGreen-1.stopWater", simple: true, id: "waterGreen-1.stopWater", argTypes: [], type: 'dev' },
    { name: "vacuumCleaner-1.cleanRoom", simple: true, id: "vacuumCleaner-1.cleanRoom", argTypes: [], type: 'dev' }
];