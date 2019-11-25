import { Editor, EditSession } from './editor-type';
interface LogData {
    type?: string;
    command?: string;
    data?: any;
}
declare type ChangeListener = (buffers: LogData[], command: LogData) => void;
/**
 * 负责和 Ace Editor EditSession 通讯，并记录通讯结果
 */
export declare class Logger {
    buffers: LogData[];
    editor: Editor;
    changeListeners: ChangeListener[];
    static Events: {
        [key: string]: string;
    };
    bindEditor(editor: Editor): void;
    bindEditorEvents(): void;
    unbindEditorEvents: () => void;
    onEditSessionChanged: (session: EditSession, oldSession: EditSession) => void;
    bindSessionEvent(session: EditSession): void;
    unbindSessionEvent(session: EditSession): void;
    prependInput: (text: string) => void;
    printInput: (text: string) => void;
    printLog: (event: any) => void;
    printWarn: (event: any) => void;
    printError: (event: any) => void;
    commandExecuted: () => void;
    commandIndent: () => void;
    commandInput: (event: any) => void;
    flush(): void;
    onChange(listener: ChangeListener): () => void;
    emitChange(command?: LogData): void;
    sessionEmit(eventName: string, data: any): void;
    run(text: string): void;
}
declare const _default: Logger;
export default _default;
