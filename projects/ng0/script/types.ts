export interface ScriptDefinitionObject {
    /** Script URL */
    src: string,
    attrs?: { [key: string]: string },
}

export type ScriptDefinition = string | ScriptDefinitionObject;
