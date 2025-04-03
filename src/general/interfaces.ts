import { BlockType, TypeOption } from "./types";

export interface Block {
    name: string;
    simple: boolean;
    id: string;
    type: BlockType;
    argTypes: TypeOption[];
}

export interface ProgramBlock {
    block: Block;
    arguments: Argument[];
    hide: boolean
}

export interface VarObject {
    name: string;
    value: Argument;
}

export interface Argument {
    type: TypeOption;
    value: string;
    args: Argument[]
}