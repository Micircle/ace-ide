import React, { FC, useState } from 'react';
import {render} from 'react-dom';
import Editor, {ThemeMaps, ModeMaps} from '../components/editor/editor';
import Terminal from '../components/terminal/terminal';
const styles = require('./app.css');

const App:FC = () => {
    const [mode, changeMode] = useState('Python');
    const [theme, changeTheme] = useState('light');
    const [editor, setEditor] = useState(null);
    const [terminalVisible, toggleTerminal] = useState(false);
    const [value, setValue] = useState('');
    const [fontSize, changeFontSize] = useState(16);

    return (
        <div className={styles.app}>
            <div className={styles.toolbar}>
                <div className={styles.cell}>Ace IDE</div>
                <div className={styles.cell}>
                    Theme:
                    <select onChange={e => changeTheme(e.target.value)}>
                        {
                            Object.keys(ThemeMaps)
                                .map((name: string) =>
                                    <option value={name} key={name}>{name}</option>
                                )
                        }
                    </select>
                </div>
                <div className={styles.cell}>
                    Mode:
                    <select onChange={e => changeMode(e.target.value)}>
                        {
                            Object.keys(ModeMaps)
                                .map((name: string) => <option value={name} key={name}>{name}</option>)
                        }
                    </select>
                </div>
                <div className={styles.cell}>
                    Font size:
                    <select onChange={e => changeFontSize(Number(e.target.value))} value={fontSize}>
                        {
                            [14, 16, 18]
                                .map((size: number) => <option value={size} key={size}>{size}</option>)
                        }
                    </select>
                </div>
                <label className={styles.cell}>
                    <input type="checkbox" onChange={e => toggleTerminal(e.target.checked)} />
                    Toggle terminal
                </label>
                <label className={styles.cell}>
                    <button>Prettify code</button>
                </label>
                <button className={styles.right} onClick={() => editor && editor.session._emit('run', {data:editor.session.getValue()})}>
                    ▶️ Run
                </button>
            </div>
            <Editor
                className={styles.editor}
                theme={ThemeMaps[theme]}
                mode={ModeMaps[mode]}
                onLoad={setEditor}
                onChange={setValue}
                value={value}
                fontSize={fontSize}
                Terminal={Terminal}
            />
        </div>
    )
};

render(<App />, document.getElementById('ide-container'));