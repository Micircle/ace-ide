import React, { FC, Fragment, useState, Component } from 'react';
import AceEditor, {IEditorProps, IAnnotation} from 'react-ace';
import classNames from 'classnames';
import ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/javascript';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/snippets/c_cpp';

import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-monokai';

import 'ace-builds/src-noconflict/snippets/python';

import {Editor} from '../../libs/logger/editor-type';
import logger from '../../libs/logger/logger';

ace.config.setModuleUrl('ace/mode/python', require('file-loader!./modes/mode-python'));
ace.config.setModuleUrl('ace/mode/python_worker', require('file-loader!./modes/worker-python-with-skulpt'));
ace.config.setModuleUrl('ace/mode/javascript_worker', require('file-loader!ace-builds/src-noconflict/worker-javascript.js'));

const styles = require('./editor.css');

export const ThemeMaps:{[key:string]: string} = {
    light: 'chrome',
    dark: 'monokai'
};
export const ModeMaps:{[key:string]: string} = {
    Python: 'python',
    JavaScript: 'javascript',
    ArduinoC: 'c_cpp'
};

const initOptions:IEditorProps = {
    value: '',
    placeholder: 'Start coding',
    theme: ThemeMaps.light,
    mode: ModeMaps.Python,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    fontSize: 16,
    showPrintMargin: false,
    enableSnippets: true,
    highlightSelectedWord: true,
    useWorker: true,
    tabSize: 4
};

interface MyEditorProps extends IEditorProps {
    Terminal: Component
}

const Editor:FC<IEditorProps> = (props:IEditorProps) => {
    const currentProps = Object.assign(initOptions, props);
    const {
        Terminal,
        onLoad,
        ...otherProps
    } = currentProps;

    const [editor, setEditor] = useState(null);
    const handleEditorLoad = (aceEditor:Editor) => {
        logger.bindEditor(aceEditor);
        onLoad(aceEditor);
        setEditor(aceEditor);
    };

    return (
        <Fragment>
            <div className={classNames(styles.wrapper, props.className)}>
                <AceEditor
                    width="100%"
                    height="100%"
                    onLoad={handleEditorLoad}
                    {...otherProps}
                />
            </div>
            {Terminal &&
                <Terminal
                    mode={otherProps.mode}
                    theme={otherProps.theme}
                    editor={editor}
                />
            }
        </Fragment>
    )
};

export default Editor;