import { NotFoundContent } from '../components/not-found-content';
import { mako } from './font';
import './globals.css';

export default function NotFoundPage() {
  return (
    <div lang="es" className={mako.className}>
      <NotFoundContent locale="es" />
    </div>
  );
}
