import React, { FC, useEffect, useState, ChangeEvent, KeyboardEvent, useRef } from 'react';
import classNames from 'classnames';
import {EditSession} from '../../libs/logger/editor-type';
import logger, {Logger} from '../../libs/logger/logger';
const styles = require('./terminal.css');
const clearIcon = require('./clear.svg');

interface TerminalProps {
    mode?: string,
    theme?: string,
    session?: EditSession
}

interface WaitReplay {
    text: string
}

const history:string[] = [];
let historyIndex = -1;

let selectionIndex = -1;

const resetTextareaHeight = (elem:HTMLTextAreaElement) => {
    const matches = elem.value.match(/\n/g);
    if (matches) {
        const linesNum = matches.length + 1;
        const height = linesNum * 20;
        if (height > elem.clientHeight) {
            elem.style.height = height + 'px';
        }
    }
};

const updateTextareaSelection = (elem:HTMLTextAreaElement, index:number) => {
    if (index >= 0) {
        elem.setSelectionRange(index, index);
    }
};

let waitReply:WaitReplay = null;

const Terminal:FC<TerminalProps> = (props:TerminalProps) => {
    const [buffers, updateBuffers] = useState([]);
    const [inputValue, updateInputValue] = useState('');
    const [imputCommandMessage, setInputCommandMessage] = useState('');
    const textareaRef = useRef(null);
    const handleInputKeyDown:(event:KeyboardEvent<HTMLTextAreaElement>) => void = (e) => {
        const {selectionStart, selectionEnd} = e.target as HTMLTextAreaElement;
        if (e.keyCode === 9) {
            // Tab 键四个空格缩进
            e.preventDefault();
            if (selectionStart === selectionEnd) {
                updateInputValue(inputValue.slice(0, selectionStart) + ' '.repeat(4) + inputValue.slice(selectionStart));
                selectionIndex = selectionStart + 4;
            }
            return;
        }
        if (e.keyCode === 13) {
            e.preventDefault();
            // Enter 键，如果同时按了 Shift 键，则换行，否则发送命令
            if (e.shiftKey) {
                selectionIndex = selectionStart + 1;
                return updateInputValue(inputValue.slice(0, selectionStart) + '\n' + inputValue.slice(selectionStart));
            }
            if (inputValue.trim() || waitReply) {
                setInputCommandMessage('');
                logger.printInput((waitReply ? waitReply.text : '') + inputValue, !!waitReply);
                updateInputValue('');
                let newText = inputValue;
                logger.run(newText, !!waitReply);
                waitReply = null;
                return;
            }
        }
    };

    const handleChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
        updateInputValue(e.target.value);
    }

    const getInputValue = () => {
        return inputValue;
    };

    // 监听 inputValue 变化
    useEffect(() => {
        resetTextareaHeight(textareaRef.current);
        updateTextareaSelection(textareaRef.current, selectionIndex);
        selectionIndex = -1;
    }, [inputValue])

    // 模拟 didMount 和 willUnMount，绑定和移除 logger 监听函数
    useEffect(() => {
        const unbindChangeListener = logger.onChange((buffers, command) => {
            let text = getInputValue();
            if (command) {
                if (command.command === Logger.Events.indent) {
                    return updateInputValue(text + '\n' + ' '.repeat(4));
                }
                if (command.command === Logger.Events.input) {
                    if (text) {
                        updateInputValue('');
                        logger.printInput(text);
                    }
                    waitReply = {
                        text: command.data
                    };
                    return setInputCommandMessage(command.data);
                }
                // if (command.command === Logger.Events.executed) {
                //     if (text) {
                //         updateInputValue('');
                //         if (waitReply) {
                //             text = waitReply.text + text;
                //         }
                //         logger.printInput(text, !!waitReply);
                //     }
                // }
                return;
            }
            // if (text) {
            //     updateInputValue('');
            //     return logger.prependInput(text);
            // }
            updateBuffers(buffers.slice(0));
            textareaRef.current.scrollIntoView();
        });
        return () => {
            unbindChangeListener();
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.toolbar}>
                <img src={clearIcon} className={styles.clear} onClick={e => logger.flush()} />
            </div>
            <div className={styles.content}>
                <ul className={styles.logarea}>
                    {
                        buffers.map((buffer, index) =>
                            <li
                                className={classNames(styles.logRow, {
                                    [styles.error]: buffer.type === Logger.Events.error,
                                    [styles.warn]: buffer.type === Logger.Events.warn,
                                })}
                                key={JSON.stringify(buffer.data) + index}
                            >
                                {
                                    buffer.type === Logger.Events.input &&
                                    <pre className={styles.grayArrow}>
                                        &gt;&gt;&gt;
                                    </pre>
                                }
                                <pre className={styles.info}>
                                    {buffer.data && buffer.data.message || buffer.data}
                                </pre>
                            </li>
                        )
                    }
                </ul>
                <label className={styles.inputWrapper}>
                    {
                        imputCommandMessage ?
                        <pre className={styles.command}>{imputCommandMessage}</pre>
                        :
                        <pre className={styles.arrow}>&gt;&gt;&gt;</pre>
                    }
                    <textarea
                        className={styles.textarea}
                        onKeyDown={handleInputKeyDown}
                        onChange={handleChange}
                        value={inputValue}
                        ref={textareaRef}
                    />
                </label>
            </div>
        </div>
    )
};

export default Terminal;