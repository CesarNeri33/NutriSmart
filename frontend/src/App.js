import React, { useState, useEffect } from 'react'; // 1. Importar Hooks
import logo from './logo.svg';
import './App.css';

function App() {
  // 2. Estado para guardar los datos de Strapi
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. useEffect para el llamado a la API
  useEffect(() => {
    // 4. Función asíncrona para hacer la llamada
    const fetchStrapiData = async () => {
      try {
        // Asegúrate de que el puerto de Strapi (1337) sea correcto.
        // Reemplaza 'articulos' con el nombre de tu Content Type si es diferente.
        const response = await fetch('http://localhost:1337/api/articulos'); 
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos de Strapi');
        }
        
        const json = await response.json();
        
        // El contenido de Strapi suele estar anidado dentro de 'data'
        setData(json.data); 
        
      } catch (error) {
        console.error("Fallo al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrapiData();
  }, []); // El array vacío [] asegura que solo se ejecute al montar.

  // 5. Renderizado del contenido
  return (
    <div className="App">
      <header className="App-header">
        
        {/* Mostrar el estado de la carga */}
        {loading && <p>Cargando contenido de nutrición...</p>}

        {/* Mostrar un mensaje si los datos se cargaron (o no hay datos) */}
        {!loading && (
          <>
            <h1>Contenido de Nutrición Cargado:</h1>
            {data && data.length > 0 ? (
              // Si hay datos, muestra el número de elementos
              <p>Se encontraron **{data.length}** elementos/artículos de Strapi.</p>
            ) : (
              // Si no hay datos (porque falló el seed o no has creado ninguno)
              <p>No se encontraron datos. Revisa si creaste Content Types y si el endpoint es correcto.</p>
            )}
          </>
        )}
        
        {/* Aquí va el código original de React que puedes borrar o modificar */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* ... */}
      </header>
    </div>
  );
}

export default App;