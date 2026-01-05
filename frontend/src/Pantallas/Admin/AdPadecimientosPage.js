import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { default as Select } from 'react-select';

import Header from '../../Componentes/Header';
import { 
  GET_PADECIMIENTOS, 
  GET_CATALOGOS,
  INSERT_PADECIMIENTO, 
  DELETE_PADECIMIENTO,
  UPDATE_PADECIMIENTO 
} from '../../graphql/padecimientos';

// Reutilizamos el CSS de productos ya que la estructura es igual
import './AdProductsPage.css'; 

const AdPadecimientosPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- ESTADOS PARA EL FORMULARIO DE CREACIÓN ---
  const [newNombre, setNewNombre] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedNutrientes, setSelectedNutrientes] = useState([]);
  const [selectedAyudas, setSelectedAyudas] = useState([]);

  // --- QUERIES Y MUTACIONES ---
  const { data, loading, error, refetch } = useQuery(GET_PADECIMIENTOS);
  const { data: dataCatalogos } = useQuery(GET_CATALOGOS); // Para llenar los selects
  
  const [insertPadecimiento] = useMutation(INSERT_PADECIMIENTO);
  const [deletePadecimiento] = useMutation(DELETE_PADECIMIENTO);
  const [updatePadecimiento] = useMutation(UPDATE_PADECIMIENTO);

  const padecimientos = data?.padecimiento ?? [];

  // --- PREPARAR OPCIONES PARA REACT-SELECT ---
  const optionsNutrientes = dataCatalogos?.nutriente.map(n => ({
    value: n.nutriente_id, // Antes era n.id
    label: n.nombre
  })) || [];

  const optionsAyudas = dataCatalogos?.ayuda.map(a => ({
    value: a.ayuda_id, // Usamos tu ID real
    label: a.titulo    // Usamos tu campo real
  })) || [];

  // --- LÓGICA DE CREACIÓN ---
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // 1. Formatear datos para Hasura (Arrays de objetos)
      const arrayNutrientes = selectedNutrientes.map(item => ({ nutriente_id: item.value }));
      const arrayAyudas = selectedAyudas.map(item => ({ ayuda_id: item.value }));

      // 2. Ejecutar mutación
      await insertPadecimiento({
        variables: {
          object: {
            nombre: newNombre,
            descripcion: newDesc,
            padecimiento_nutrientes: { data: arrayNutrientes },
            padecimiento_ayudas: { data: arrayAyudas }
          }
        }
      });

      alert('¡Padecimiento creado con éxito!');
      refetch();
      
      // Limpiar y cerrar
      setNewNombre('');
      setNewDesc('');
      setSelectedNutrientes([]);
      setSelectedAyudas([]);
      setIsModalOpen(false);

    } catch (err) {
      alert('Error al crear: ' + err.message);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Eliminar permanentemente "${nombre}"?`)) {
      try {
        await deletePadecimiento({ variables: { id } });
        alert('Eliminado correctamente');
        refetch();
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  // --- LÓGICA DE GUARDADO RÁPIDO (Solo nombre/descripción) ---
  const handleSave = async (id) => {
    const card = document.getElementById(`card-${id}`);
    const nombreVal = card.querySelector('input[name="nombre"]').value;
    const descVal = card.querySelector('textarea[name="descripcion"]').value;

    try {
      await updatePadecimiento({
        variables: {
          id,
          changes: { nombre: nombreVal, descripcion: descVal }
        }
      });
      alert('Actualizado correctamente');
      refetch();
    } catch (err) {
      alert('Error al actualizar: ' + err.message);
    }
  };

  // --- FILTRADO ---
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return padecimientos.filter((p) => 
      p.nombre.toLowerCase().includes(term) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(term))
    );
  }, [padecimientos, searchTerm]);

  if (loading) return <div className="manage-loading">Cargando padecimientos...</div>;
  if (error) return <div className="manage-error">Error al cargar datos</div>;

  return (
    <div className="manage-products-container">
      <Header />

      <div className="manage-top-bar">
        <button className="manage-back-button" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        
        <div className="manage-search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Buscar padecimiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="manage-add-button" onClick={() => setIsModalOpen(true)} title="Agregar nuevo">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* --- MODAL DE CREACIÓN --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '600px'}}> {/* Modal un poco más ancho */}
            <div className="modal-header">
              <h2 style={{margin: 0}}>Nuevo Padecimiento</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                
                <div className="manage-row">
                  <div className="manage-input-group full">
                    <label>Nombre del Padecimiento *</label>
                    <input 
                      type="text" 
                      value={newNombre} 
                      onChange={e => setNewNombre(e.target.value)} 
                      required 
                      placeholder="Ej: Gastritis"
                    />
                  </div>
                </div>

                <div className="manage-row">
                  <div className="manage-input-group full">
                    <label>Descripción</label>
                    <textarea 
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      rows="3"
                      style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    />
                  </div>
                </div>

                {/* SELECTOR MÚLTIPLE DE NUTRIENTES */}
                <div className="manage-row">
                  <div className="manage-input-group full">
                    <label>Relacionar Nutrientes (Causantes/Relacionados)</label>
                    <Select 
                      isMulti
                      options={optionsNutrientes}
                      value={selectedNutrientes}
                      onChange={setSelectedNutrientes}
                      placeholder="Selecciona nutrientes..."
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </div>

                {/* SELECTOR MÚLTIPLE DE AYUDAS */}
                <div className="manage-row">
                  <div className="manage-input-group full">
                    <label>Relacionar Ayudas (Consejos)</label>
                    <Select 
                      isMulti
                      options={optionsAyudas}
                      value={selectedAyudas}
                      onChange={setSelectedAyudas}
                      placeholder="Selecciona ayudas..."
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </div>

              </div>

              <div className="modal-footer" style={{marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-confirm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- LISTA DE TARJETAS --- */}
      <div className="manage-list">
        {filteredItems.map((item) => (
          <div key={item.padecimiento_id} id={`card-${item.padecimiento_id}`} className="manage-product-card">
            
            {/* LADO IZQUIERDO: ICONO O FOTO */}
            <div className="manage-card-aside" style={{justifyContent: 'flex-start', paddingTop: '10px'}}>
              <div className="manage-image-box" style={{background: '#ffe0e0', color: '#d32f2f'}}>
                 <i className="fa-solid fa-heart-pulse" style={{fontSize: '2rem'}}></i>
              </div>
              <span className="manage-id-tag">ID: {item.padecimiento_id}</span>
            </div>

            {/* CENTRO: DATOS */}
            <div className="manage-card-main">
              <div className="manage-row">
                <div className="manage-input-group full">
                  <label>Nombre</label>
                  <input type="text" name="nombre" defaultValue={item.nombre} style={{fontWeight: 'bold'}} />
                </div>
              </div>
              
              <div className="manage-row">
                <div className="manage-input-group full">
                  <label>Descripción</label>
                  <textarea name="descripcion" defaultValue={item.descripcion} rows="2" style={{width:'100%', border:'1px solid #ddd', borderRadius:'4px', padding:'5px'}} />
                </div>
              </div>

              {/* VISUALIZACIÓN DE RELACIONES (SOLO LECTURA EN TARJETA) */}
              <div style={{marginTop: '10px', display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '11px', fontWeight: '800', color: '#666'}}>NUTRIENTES:</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                    {item.padecimiento_nutrientes.length > 0 ? (
                      item.padecimiento_nutrientes.map((pn, idx) => (
                        <span key={idx} style={{background: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: '10px', fontSize: '11px'}}>
                          {pn.nutriente.nombre}
                        </span>
                      ))
                    ) : <span style={{fontSize: '11px', color: '#999'}}>Ninguno</span>}
                  </div>
                </div>

                <div style={{flex: 1}}>
                  <label style={{fontSize: '11px', fontWeight: '800', color: '#666'}}>AYUDAS:</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                    {item.padecimiento_ayudas.length > 0 ? (
                      item.padecimiento_ayudas.map((pa, idx) => (
                        <span key={idx} style={{background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '10px', fontSize: '11px'}}>
                          {pa.ayuda.titulo}
                        </span>
                      ))
                    ) : <span style={{fontSize: '11px', color: '#999'}}>Ninguna</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* DERECHA: ACCIONES */}
            <div className="manage-card-actions">
              <button 
                className="action-btn save-btn" 
                title="Guardar nombre/descripción"
                onClick={() => handleSave(item.padecimiento_id)}
              >
                <i className="fa-solid fa-floppy-disk"></i>
              </button>
              <button 
                className="action-btn delete-btn" 
                title="Eliminar padecimiento"
                onClick={() => handleDelete(item.padecimiento_id, item.nombre)}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdPadecimientosPage;