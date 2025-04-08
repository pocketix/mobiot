import { Block } from "./interfaces";

export const blockTypes: Block[] = [
    { name: "Repeat", simple: false, id: "repeat", argTypes: ['number'], type: 'cycle' },
    { name: "While ... do ...", simple: false, id: "while", argTypes: ['cond'], type: 'cycle' },
    { name: "Send notification", simple: true, id: "alert", argTypes: ['string'], type: 'alert' },
    { name: "If ... do ...", simple: false, id: "if", argTypes: ['cond'], type: 'branch' },
    { name: "Else do ...", simple: false, id: "else", argTypes: [], type: 'branch' },
    { name: "Else If ... do ...", simple: false, id: "elseif", argTypes: ['cond'], type: 'branch' },
    { name: "Switch according ...", simple: false, id: "switch", argTypes: ['number'], type: 'branch' },
    { name: "Case", simple: false, id: "case", argTypes: ['number'], type: 'branch' },
    { name: "End of block", simple: true, id: "end", argTypes: [], type: 'end' },
    { name: "Set Variable", simple: true, id: "setvar", argTypes: ['variable', 'note'], type: 'set_var' },
    { name: "LED 1.setLedColor", simple: true, id: "str_opt", argTypes: ['bool'], type: 'dev' },
];