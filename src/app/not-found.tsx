import { NotFoundContent } from '../components/not-found-content';
import { ShellFrame } from '../components/shell-frame';
import { mako } from './font';
import './globals.css';

export default function NotFoundPage() {
  return (
    <div lang="es" className={mako.className}>
      <ShellFrame locale="es" routes={{}}>
        <NotFoundContent locale="es" />
      </ShellFrame>
    </div>
  );
}
