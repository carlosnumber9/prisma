import Link from 'next/link';
import { Shell, PageHeader } from '../components/shell';

export default function NotFoundPage() {
  return (
    <Shell>
      <PageHeader
        title="Página no encontrada"
        description="Esta dirección no corresponde a un partido o área del catálogo actual."
      />
      <p>
        <Link href="/">Volver al inicio</Link>
      </p>
    </Shell>
  );
}
