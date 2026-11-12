
import Link from "next/link";

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  anio_publicacion: number | null;
  disponible: boolean | number;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LibroDetalle({ params }: Props) {
  const { id } = await params;

  try {
    const respuesta = await fetch(
      `http://127.0.0.1:8001/api/libros/${id}`,
      { cache: "no-store" }
    );

    if (respuesta.status === 404) {
      return (
        <main>
          <h1>Libro no encontrado</h1>
          <p>No existe un libro con ese identificador.</p>
          <Link href="/libros">Volver al catálogo</Link>
        </main>
      );
    }

    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status}`);
    }

    const libro: Libro = await respuesta.json();

    return (
      <main>
        <h1>{libro.titulo}</h1>

        <p>
          <strong>Autor:</strong> {libro.autor}
        </p>

        <p>
          <strong>Año de publicación:</strong>{" "}
          {libro.anio_publicacion ?? "No especificado"}
        </p>

        <p>
          <strong>Disponible:</strong>{" "}
          {libro.disponible ? "Sí" : "No"}
        </p>

        <Link href="/libros">Volver al catálogo</Link>
      </main>
    );
  } catch (error) {
    return (
      <main>
        <h1>No se pudo cargar el libro</h1>
        <p>
          {error instanceof Error
            ? error.message
            : String(error)}
        </p>
        <Link href="/libros">Volver al catálogo</Link>
      </main>
    );
  }
}
