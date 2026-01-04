// src/Pantallas/Admin/AdProductsPage.js
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import Header from '../../Componentes/Header';
import { GET_ALL_PRODUCTOS, UPDATE_PRODUCT_PHOTO, UPDATE_PRODUCTO, DELETE_PRODUCTO, INSERT_PRODUCTO} from '../../graphql/products';
import './AdProductsPage.css';

const ManageProductsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const SERVER_URL = 'http://191.96.31.39:4000';
  
  const fileInputRef = useRef(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Queries y Mutaciones
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRODUCTOS);
  const [updatePhoto] = useMutation(UPDATE_PRODUCT_PHOTO);
  const [updateProducto] = useMutation(UPDATE_PRODUCTO);
  const [deleteProducto] = useMutation(DELETE_PRODUCTO);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insertProducto] = useMutation(INSERT_PRODUCTO);
  const [newProductFile, setNewProductFile] = useState(null);

  const productos = data?.producto ?? [];

  // --- LÓGICA DE IMAGEN ---
  const handlePencilClick = (id) => {
    setSelectedProductId(id);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'image/png') {
      if (file) alert('Error: Solo se permiten imágenes en formato PNG.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${SERVER_URL}/upload-product`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error en servidor');
      const result = await response.json();

      if (result.url) {
        await updatePhoto({ variables: { id: selectedProductId, foto: result.url } });
        alert('Imagen actualizada');
        refetch();
      }
    } catch (err) {
      alert('Error al subir imagen');
    } finally {
      e.target.value = ''; 
    }
  };

  // --- LÓGICA DE GUARDADO ---
const handleSave = async (prodId) => {
    const card = document.getElementById(`card-${prodId}`);
    // Ahora buscamos inputs Y selects
    const inputs = card.querySelectorAll('input, select');
    const updatedData = {};
    inputs.forEach(input => {
      if (input.name) {
        const value = input.type === 'number' ? Number(input.value) : input.value;
        updatedData[input.name] = value;
      }
    });
    try {
      await updateProducto({
        variables: { id: prodId, changes: updatedData }
      });
      alert('¡Producto actualizado!');
      refetch();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDelete = async (prodId, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar permanentemente "${nombre}"?`)) {
      try {
        await deleteProducto({ variables: { id: prodId } });
        alert('Producto eliminado');
        refetch();
      } catch (err) {
        alert('No se pudo eliminar el producto. Verifica si está en alguna lista de compra.');
      }
    }
  };

const handleCreateProduct = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  // Convertir campos numéricos
  const numericFields = [
    'cantidad_envase', 'energia_kcal', 'azucares_g', 'sodio_mg', 
    'grasas_saturadas_g', 'grasas_totales_g', 'proteinas_g', 'carbohidratos_g'
  ];
  numericFields.forEach(field => {
    data[field] = data[field] ? Number(data[field]) : 0;
  });
  try {
    let finalFotoUrl = "";
    // 1. Si hay una foto seleccionada, subirla primero
    if (newProductFile) {
      const imgFormData = new FormData();
      imgFormData.append('image', newProductFile);
      const imgRes = await fetch(`${SERVER_URL}/upload-product`, {
        method: 'POST',
        body: imgFormData,
      });
      if (imgRes.ok) {
        const result = await imgRes.json();
        finalFotoUrl = result.url;
      }
    }
    // 2. Insertar en Base de Datos
    await insertProducto({
      variables: {
        object: {
          ...data,
          foto_producto: finalFotoUrl,
          activo: true // Campo por defecto
        }
      }
    });
    alert('Producto creado con éxito');
    setIsModalOpen(false);
    setNewProductFile(null);
    refetch();
  } catch (err) {
    alert('Error al crear: ' + err.message);
  }
};

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return productos.filter((p) => 
      p.producto_id.toString().includes(term) ||
      p.nombre.toLowerCase().includes(term) ||
      (p.codigo_barra && p.codigo_barra.includes(term))
    );
  }, [productos, searchTerm]);

  if (loading) return <div className="manage-loading">Cargando catálogo...</div>;
  if (error) return <div className="manage-error">Error al cargar productos</div>;

  return (
    <div className="manage-products-container">
      <Header />

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/png"
        onChange={handleFileChange}
      />

      <div className="manage-top-bar">
        <button className="manage-back-button" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        
        <div className="manage-search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Buscar por ID, nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="manage-add-button" onClick={() => setIsModalOpen(true)} title="Agregar nuevo producto">
          <i className="fa-solid fa-plus"></i>
        </button>

        {/* ESTRUCTURA DEL MODAL */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 style={{margin: 0}}>Nuevo Producto</h2>
                <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              
              <form onSubmit={handleCreateProduct}>
                <div className="modal-body">
                  {/* SECCIÓN FOTO */}
                  <div className="modal-photo-section">
                    <div className="manage-image-box">
                        {newProductFile ? (
                          <img src={URL.createObjectURL(newProductFile)} alt="Preview" />
                        ) : (
                          <i className="fa-solid fa-camera" style={{fontSize: '2rem', color: '#ccc'}}></i>
                        )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/png" 
                      id="new-photo-input"
                      style={{display: 'none'}}
                      onChange={(e) => setNewProductFile(e.target.files[0])}
                    />
                    <label htmlFor="new-photo-input" className="img-btn-black" style={{width: 'auto', padding: '0 15px', marginTop: '10px'}}>
                      <i className="fa-solid fa-upload"></i> &nbsp; Seleccionar PNG
                    </label>
                  </div>

                  {/* DATOS BÁSICOS */}
                  <div className="manage-row">
                    <div className="manage-input-group full">
                      <label>Nombre del Producto *</label>
                      <input type="text" name="nombre" placeholder="Ej: Coca Cola 600ml" required />
                    </div>
                  </div>

                  <div className="manage-row">
                    <div className="manage-input-group">
                      <label>Código de Barras</label>
                      <input type="text" name="codigo_barra" placeholder="750..." />
                    </div>
                    <div className="manage-input-group">
                      <label>Categoría</label>
                      <select name="categoria">
                        <option value="refresco">Refresco</option>
                        <option value="cereal">Cereal</option>
                        <option value="salsa">Salsa</option>
                        <option value="galleta">Galletas</option>
                        <option value="sabrita">Sabritas</option>
                        <option value="lacteo">Lácteo</option>
                        <option value="embutido">Embutido</option>
                        <option value="pan">Pan</option>
                        <option value="jugo">Jugo</option>
                        <option value="pescado">Pescado</option>
                        <option value="leguminosa">Leguminosa</option>
                        <option value="verdura">Verdura</option>
                      </select>
                    </div>
                  </div>

                  <div className="manage-row">
                    <div className="manage-input-group">
                      <label>Cantidad</label>
                      <input type="number" name="cantidad_envase" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="manage-input-group">
                      <label>Unidad</label>
                      <select name="unidad_envase">
                        <option value="g">g (Gramos)</option>
                        <option value="ml">ml (Mililitros)</option>
                      </select>
                    </div>
                    <div className="manage-input-group">
                      <label>Empaque</label>
                      <select name="tipo_empaquetado">
                        <option value="enlatado">Enlatado</option>
                        <option value="embolsado">Embolsado</option>
                        <option value="caja">Caja</option>
                        <option value="embotellado">Embotellado</option>
                      </select>
                    </div>
                  </div>

                  {/* CUADRÍCULA DE NUTRIENTES */}
                  <label style={{fontSize: '11px', fontWeight: '800', color: '#666', marginTop: '10px', display: 'block'}}>INFORMACIÓN NUTRICIONAL (POR 100G/ML)</label>
                  <div className="manage-nutrients-grid" style={{marginTop: '5px'}}>
                    <div className="manage-input-group">
                      <label>Energía (kcal)</label>
                      <input type="number" name="energia_kcal" step="0.1" placeholder="0" />
                    </div>
                    <div className="manage-input-group">
                      <label>Azúcares (g)</label>
                      <input type="number" name="azucares_g" step="0.1" placeholder="0" />
                    </div>
                    <div className="manage-input-group">
                      <label>Sodio (mg)</label>
                      <input type="number" name="sodio_mg" step="0.1" placeholder="0" />
                    </div>
                    <div className="manage-input-group">
                      <label>Grasas Sat. (g)</label>
                      <input type="number" name="grasas_saturadas_g" step="0.1" placeholder="0" />
                    </div>
                    <div className="manage-input-group">
                      <label>Proteínas (g)</label>
                      <input type="number" name="proteinas_g" step="0.1" placeholder="0" />
                    </div>
                    <div className="manage-input-group">
                      <label>Carbos (g)</label>
                      <input type="number" name="carbohidratos_g" step="0.1" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn-confirm">Guardar Producto</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="manage-list">
          {filteredProducts.map((prod) => {
          let imgUrlFinal = prod.foto_producto;
          if (prod.foto_producto) {
            if (prod.foto_producto.startsWith('/upload')) {
              imgUrlFinal = `${SERVER_URL}${prod.foto_producto}`;
            } else if (prod.foto_producto.startsWith('/products')) {
              imgUrlFinal = `${SERVER_URL}${prod.foto_producto.replace('/products', '/upload/products')}`;
            }
          }

          return (
            <div key={prod.producto_id} id={`card-${prod.producto_id}`} className="manage-product-card">
              
              <div className="manage-card-aside">
                <div className="manage-image-box">
                  {prod.foto_producto ? (
                    <img src={imgUrlFinal} alt={prod.nombre} />
                  ) : (
                    <i className="fa-solid fa-image"></i>
                  )}
                </div>

                <div className="image-edit-actions">
                  <button 
                    className="img-btn-black" 
                    title="Borrar foto"
                    onClick={async () => {
                      if (window.confirm('¿Quitar foto?')) {
                        await updatePhoto({ variables: { id: prod.producto_id, foto: "" } });
                        refetch();
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                  <button className="img-btn-black" title="Cambiar foto" onClick={() => handlePencilClick(prod.producto_id)}>
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                </div>
                <span className="manage-id-tag">ID: {prod.producto_id}</span>
              </div>

              <div className="manage-card-main">
                <div className="manage-row">
                  <div className="manage-input-group full">
                    <label>Nombre</label>
                    <input type="text" name="nombre" defaultValue={prod.nombre} />
                  </div>
                  <div className="manage-input-group">
                    <label>Código de Barras</label>
                    <input type="text" name="codigo_barra" defaultValue={prod.codigo_barra} />
                  </div>
                </div>

                {/* FILA 2: CATEGORÍA Y EMPAQUE (NUEVOS) */}
              <div className="manage-row">
                <div className="manage-input-group">
                  <label>Categoría</label>
                  <select name="categoria" defaultValue={prod.categoria}>
                    <option value="refresco">Refresco</option>
                    <option value="cereal">Cereal</option>
                    <option value="salsa">Salsa</option>
                    <option value="galleta">Galletas</option>
                    <option value="sabrita">Sabritas</option>
                    <option value="lacteo">Lácteo</option>
                    <option value="embutido">Embutido</option>
                    <option value="pan">Pan</option>
                    <option value="jugo">Jugo</option>
                    <option value="pescado">Pescado</option>
                    <option value="leguminosa">Leguminosa</option>
                    <option value="verdura">Verdura</option>
                  </select>
                </div>
                <div className="manage-input-group">
                  <label>Tipo Empaque</label>
                  <select name="tipo_empaquetado" defaultValue={prod.tipo_empaquetado}>
                    <option value="enlatado">Enlatado</option>
                    <option value="embolsado">Embolsado</option>
                    <option value="caja">Caja</option>
                    <option value="embotellado">Embotellado</option>
                  </select>
                </div>
              </div>

                <div className="manage-row">
                  <div className="manage-input-group">
                    <label>Cantidad</label>
                    <input type="number" name="cantidad_envase" defaultValue={prod.cantidad_envase} />
                  </div>
                  <div className="manage-input-group">
                    <label>Unidad</label>
                    <select name="unidad_envase" defaultValue={prod.unidad_envase}>
                      <option value="g">g (Gramos)</option>
                      <option value="ml">ml (Mililitros)</option>
                    </select>
                  </div>
                  <div className="manage-input-group">
                    <label>Energía (kcal)</label>
                    <input type="number" name="energia_kcal" defaultValue={prod.energia_kcal} />
                  </div>
                </div>

                <div className="manage-nutrients-grid">
                  <div className="manage-input-group">
                    <label>Azúcares (g)</label>
                    <input type="number" name="azucares_g" defaultValue={prod.azucares_g} />
                  </div>
                  <div className="manage-input-group">
                    <label>Sodio (mg)</label>
                    <input type="number" name="sodio_mg" defaultValue={prod.sodio_mg} />
                  </div>
                  <div className="manage-input-group">
                    <label>Grasas Sat. (g)</label>
                    <input type="number" name="grasas_saturadas_g" defaultValue={prod.grasas_saturadas_g} />
                  </div>
                  <div className="manage-input-group">
                    <label>Grasas Tot. (g)</label>
                    <input type="number" name="grasas_totales_g" defaultValue={prod.grasas_totales_g} />
                  </div>
                  <div className="manage-input-group">
                    <label>Proteínas (g)</label>
                    <input type="number" name="proteinas_g" defaultValue={prod.proteinas_g} />
                  </div>
                  <div className="manage-input-group">
                    <label>Carbohidratos (g)</label>
                    <input type="number" name="carbohidratos_g" defaultValue={prod.carbohidratos_g} />
                  </div>
                </div>
              </div>

              <div className="manage-card-actions">
                <button 
                  className="action-btn save-btn" 
                  title="Guardar cambios"
                  onClick={() => handleSave(prod.producto_id)}
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                </button>
                <button 
                  className="action-btn delete-btn" 
                  title="Eliminar producto"
                  onClick={() => handleDelete(prod.producto_id, prod.nombre)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageProductsPage;