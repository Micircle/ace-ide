import { FC } from 'react';
import { IEditorProps } from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/snippets/c_cpp';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/snippets/python';
import { Editor } from '../../libs/logger/editor-type';
export declare const ThemeMaps: {
    [key: string]: string;
};
export declare const ModeMaps: {
    [key: string]: string;
};
declare const Editor: FC<IEditorProps>;
export default Editor;
