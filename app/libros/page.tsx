
import Link from "next/link";

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  anio_publicacion: number | null;
  disponible: boolean | number;
};

export default async function LibrosPage() {
  try {
    const respuesta = await fetch(
      "http://127.0.0.1:8001/api/libros",
      { cache: "no-store" }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(
        `Código: ${respuesta.status}. Detalle: ${detalle}`
      );
    }

    const libros: Libro[] = await respuesta.json();

    return (
      <main>
        <h1>Libros de la biblioteca</h1>

        {libros.length === 0 ? (
          <p>No hay libros cargados.</p>
        ) : (
          <ul>
            {libros.map((libro) => (
              <li key={libro.id}>
                <h2>
                  <Link
                    href={`/libros/${libro.id}`}
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {libro.titulo}
                  </Link>
                </h2>

                <p>Autor: {libro.autor}</p>

                <p>
                  Año: {libro.anio_publicacion ?? "No especificado"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LARAVEL:", error);

    return (
      <main>
        <h1>Libros de la biblioteca</h1>
        <p>No se pudieron cargar los libros.</p>
        <p>
          Error:{" "}
          {error instanceof Error
            ? error.message
            : String(error)}
        </p>
      </main>
    );
  }
}

