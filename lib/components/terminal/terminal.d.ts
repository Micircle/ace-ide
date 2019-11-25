import { FC } from 'react';
import { EditSession } from '../../libs/logger/editor-type';
interface TerminalProps {
    mode?: string;
    theme?: string;
    session?: EditSession;
}
declare const Terminal: FC<TerminalProps>;
export default Terminal;
