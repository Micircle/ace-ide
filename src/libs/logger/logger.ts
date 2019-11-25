import {Editor, EditSession} from './editor-type';

interface LogData {
    type?: string,
    command?: string,
    data?: any
};

type ChangeListener = (buffers:LogData[], command:LogData) => void;
/**
 * 负责和 Ace Editor EditSession 通讯，并记录通讯结果
 */

export class Logger {
    buffers:LogData[] = [];
    editor:Editor = null;
    changeListeners:ChangeListener[] = [];

    static Events = {
        // 程序输出事件
        log: 'terminal.log',
        warn: 'terminal.warn',
        error: 'terminal.error',
        indent: 'terminal.indent',
        executed: 'terminal.executed',
        input: 'terminal.input',
        // 用户输入事件
        reply: 'terminal.reply',
        run: 'terminal.run',
        exit: 'terminal.exit'
    }
    // 绑定 Ace Editor
    bindEditor (editor:Editor) {
        if (this.editor !== editor) {
            if (this.editor) {
                this.unbindEditorEvents()
            }
            this.editor = editor;
            this.bindEditorEvents();
        }
    }

    bindEditorEvents () {
        if (this.editor) {
            const session:EditSession = this.editor.getSession();
            if (session) {
                this.bindSessionEvent(session);
            }
        }
        this.editor.addEventListener('changeSession', this.onEditSessionChanged)
    }

    unbindEditorEvents = () => {
        if (this.editor) {
            this.editor.removeEventListener('changeSession', this.onEditSessionChanged);
            const session:EditSession = this.editor.getSession();
            if (session) {
                this.unbindSessionEvent(session);
            }
        }
    }

    onEditSessionChanged = (session:EditSession, oldSession:EditSession) => {
        if (oldSession) {
            this.unbindSessionEvent(oldSession);
        }
        if (session) {
            this.bindSessionEvent(session);
        }
    }

    bindSessionEvent (session:EditSession) {
        session.addEventListener(Logger.Events.log, this.printLog);
        session.addEventListener(Logger.Events.warn, this.printWarn);
        session.addEventListener(Logger.Events.error, this.printError);
        session.addEventListener(Logger.Events.indent, this.commandIndent);
        session.addEventListener(Logger.Events.executed, this.commandExecuted);
        session.addEventListener(Logger.Events.input, this.commandInput);
    }

    unbindSessionEvent (session:EditSession) {
        session.removeEventListener(Logger.Events.log, this.printLog);
        session.removeEventListener(Logger.Events.warn, this.printWarn);
        session.removeEventListener(Logger.Events.error, this.printError);
        session.removeEventListener(Logger.Events.indent, this.commandIndent);
        session.removeEventListener(Logger.Events.executed, this.commandExecuted);
        session.removeEventListener(Logger.Events.input, this.commandInput);
    }

    prependInput = (text: string, reply?: boolean) => {
        const buffer = {
            type: reply ? Logger.Events.reply : Logger.Events.input,
            data: text
        };
        this.buffers.splice(this.buffers.length - 1, 0, buffer);
        this.emitChange();
    }

    printInput = (text: string, reply?: boolean) => {
        const buffer = {
            type: reply ? Logger.Events.reply : Logger.Events.input,
            data: text
        };
        this.buffers.push(buffer);
        this.emitChange();
    }

    printLog = (event: any) => {
        const buffer = {
            type: Logger.Events.log,
            data: event.data
        };
        this.buffers.push(buffer);
        this.emitChange();
    }

    printWarn = (event: any) => {
        const buffer = {
            type: Logger.Events.warn,
            data: event.data
        };
        this.buffers.push(buffer);
        this.emitChange();
    }

    printError = (event:any) => {
        const buffer = {
            type: Logger.Events.error,
            data: event.data
        };
        this.buffers.push(buffer);
        this.emitChange();
    }

    // 代码已解析执行
    commandExecuted = () => {
        const command = {
            command: Logger.Events.executed
        };
        this.emitChange(command);
    }

    // 代码未完成需要换行缩进
    commandIndent = () => {
        const command = {
            command: Logger.Events.indent
        };
        this.emitChange(command);
    }

    // 控制台输入
    commandInput = (event:any) => {
        const command = {
            command: Logger.Events.input,
            data: event.data
        };
        this.emitChange(command);
    }
    
    // 清空控制台
    flush () {
        this.buffers = [];
        this.emitChange(null);
    }

    // 注册控制台监听事件
    onChange (listener: ChangeListener) {
        if (this.changeListeners.indexOf(listener) === -1) {
            this.changeListeners.push(listener);
            return () => {
                const index = this.changeListeners.indexOf(listener);
                if (index !== -1) {
                    this.changeListeners.splice(index, 1);
                }
            }
        }
    }

    // 触发控制台事件
    emitChange (command?:LogData) {
        this.changeListeners.forEach(listener => {
            listener(this.buffers, command);
        });
    }

    // 触发编辑器事件
    sessionEmit (eventName: string, data: any) {
        if (this.editor && this.editor.session) {
            this.editor.session._emit(eventName, {data});
        }
    }

    // 执行命令
    run (text: string, reply?:boolean) {
        if (reply) {
            this.sessionEmit(Logger.Events.reply, text);
        } else {
            this.sessionEmit(Logger.Events.run, text);
        }
    }

    // 回复 input
    reply (text: string) {
        this.sessionEmit(Logger.Events.reply, text);
    }
};

export default new Logger();
