// src/Pantallas/Admin/AdAyudasList.js
import React from "react";
import { useNavigate } from 'react-router-dom';
import AdHeader from '../../Componentes/AdHeader';
import { useQuery, useMutation } from "@apollo/client"; // Agregado useMutation
import { GET_ADMIN_AYUDAS } from "../../graphql/helpQueries";
import { DELETE_AYUDA } from "../../graphql/mutations"; // Asegúrate de que esté aquí
import "./AdAyudasList.css";

const AyudasList = () => {
  const navigate = useNavigate();

  // 1. Obtenemos data
  const { data, loading, error } = useQuery(GET_ADMIN_AYUDAS);

  // 2. Definimos la mutación de borrado
  const [deleteAyuda] = useMutation(DELETE_AYUDA, {
    // Esto hace que la lista se actualice sola al terminar el borrado
    refetchQueries: [{ query: GET_ADMIN_AYUDAS }],
    onCompleted: () => alert("Ayuda eliminada con éxito."),
    onError: (err) => alert("Error al eliminar: " + err.message)
  });

  // Manejo de estados
  if (loading) return <p className="status-msg">Cargando ayudas...</p>;
  if (error) return <p className="status-msg">Error: {error.message}</p>;

  const listaAyudas = data?.ayuda ?? [];

  // 3. Función de eliminación conectada a Apollo
  const eliminarAyuda = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta ayuda nutricional?")) {
      try {
        await deleteAyuda({
          variables: { ayuda_id: id }
        });
      } catch (e) {
        console.error("Error en la mutación:", e);
      }
    }
  };

  return (
    <div className="manage-products-container">
      <AdHeader />

      <div className="manage-top-bar">
        <button className="manage-back-button" onClick={() => navigate('/ad-inicio')}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="manage-search-container">
          <h2 style={{ margin: 0 }}>Gestión de Ayudas</h2>
        </div>
        <button 
          className="manage-add-button" 
          onClick={() => navigate('/ad-ayudas/nueva')}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="ayudas-list">
        {listaAyudas.length === 0 ? (
          <p className="status-msg">No hay ayudas registradas.</p>
        ) : (
          listaAyudas.map(ayuda => (
            <div className="manage-product-card" key={ayuda.ayuda_id}>
              <div className="manage-card-main">
                <div className="ayuda-header">
                  <span className={`manage-id-tag type-${ayuda.tipo?.toLowerCase()}`}>
                    {ayuda.tipo}
                  </span>
                  <h3 className="ayuda-title">{ayuda.titulo}</h3>
                </div>
                
                <p className="ayuda-desc">{ayuda.descripcion}</p>

                <div className="ayuda-tags-container">
                  <div className="tag-group">
                    <label>Nutrientes Vinculados:</label>
                    <div className="tags">
                      {ayuda.ayuda_nutrientes?.map(rel => (
                        <span key={rel.nutriente.nutriente_id} className="tag nutrient">
                          {rel.nutriente.nombre}
                        </span>
                      )) || <span className="empty-tag">—</span>}
                    </div>
                  </div>
                  <div className="tag-group">
                    <label>Padecimientos Relacionados:</label>
                    <div className="tags">
                      {/* MANTENEMOS EL NOMBRE: padecimiento_ayudas */}
                      {ayuda.padecimiento_ayudas && ayuda.padecimiento_ayudas.length > 0 ? (
                        ayuda.padecimiento_ayudas.map((rel, index) => (
                          <span key={index} className="tag condition">
                            {rel.padecimiento?.nombre} 
                          </span>
                        ))
                      ) : (
                        <span className="empty-tag">— No hay padecimientos asociados —</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="manage-card-actions">
                <button 
                  className="action-btn save-btn" 
                  onClick={() => navigate(`/ad-ayudas/editar/${ayuda.ayuda_id}`)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button 
                  className="action-btn delete-btn" 
                  onClick={() => eliminarAyuda(ayuda.ayuda_id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AyudasList;