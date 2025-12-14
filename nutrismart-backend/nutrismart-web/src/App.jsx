import { useEffect, useState } from "react";

function App() {
  const [alimentos, setAlimentos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:1337/api/alimentos?populate=*")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setAlimentos(data.data); // 👈 YA VIENEN LIMPIOS
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error conectando:", err);
        setCargando(false);
      });
  }, []);

  // 🔍 FILTRO
  const productosFiltrados = alimentos.filter((producto) => {
    const texto = busqueda.toLowerCase();

    if (!busqueda) return true;

    const nombre = (producto.nombre || "").toLowerCase();
    const codigo = String(producto.codigo_barras || "");
    const categoria = (producto.categoria || "").toLowerCase();

    return (
      nombre.includes(texto) ||
      codigo.includes(texto) ||
      categoria.includes(texto)
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-6xl font-extrabold text-indigo-400 mb-2">
          🔍 NutriSmart
        </h1>

        <input
          type="text"
          placeholder="Ej: Galletas, 750123..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-4 w-full max-w-lg rounded-full text-xl text-gray-800 mb-12"
        />

        {cargando && <p>⏳ Cargando productos...</p>}

        {!cargando && alimentos.length === 0 && (
          <p className="text-red-400">
            ⚠️ No hay productos disponibles
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-left"
            >
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                {producto.nombre}
              </h2>

              <p className="text-gray-500 text-sm mb-4">
                🔢 {producto.codigo_barras} · 📁 {producto.categoria}
              </p>

              <div className="space-y-2">
                {producto.sello_azucares && <div className="bg-red-600 p-2">🛑 ALTO EN AZÚCAR</div>}
                {producto.sello_calorias && <div className="bg-red-600 p-2">🔥 EXCESO CALORÍAS</div>}
                {producto.sello_grasas_sat && <div className="bg-red-600 p-2">🥓 GRASAS SATURADAS</div>}
                {producto.sello_sodio && <div className="bg-red-600 p-2">🧂 ALTO EN SODIO</div>}

                {!producto.sello_azucares &&
                  !producto.sello_calorias &&
                  !producto.sello_grasas_sat &&
                  !producto.sello_sodio && (
                    <div className="bg-green-600 p-2">
                      ✅ Producto sin sellos
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
