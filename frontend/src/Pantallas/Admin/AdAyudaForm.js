// src/Pantallas/Admin/AdAyudaForm.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import AdHeader from '../../Componentes/AdHeader';
import { 
  INSERT_AYUDA, 
  UPDATE_AYUDA,
  INSERT_AYUDA_NUTRIENTE, 
  INSERT_AYUDA_PADECIMIENTO,
  DELETE_RELACIONES_AYUDA,
  GET_AYUDA_DETALLE
} from "../../graphql/mutations";
import { GET_CATALOGOS } from "../../graphql/helpQueries";
import "./AdAyudaForm.css";

const AyudaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("GENERAL");
  const [nutrientesSel, setNutrientesSel] = useState([]);
  const [padecimientosSel, setPadecimientosSel] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // 1. Cargar Catálogos
  const { data: catData, loading: loadingCat } = useQuery(GET_CATALOGOS);

  // 2. Cargar datos si es edición
  const { data: editData, loading: loadingEdit } = useQuery(GET_AYUDA_DETALLE, {
    variables: { id: parseInt(id) },
    skip: !esEdicion, // No se ejecuta si es "nueva"
    fetchPolicy: "network-only"
  });

  // 3. Mutaciones
  const [insertAyuda] = useMutation(INSERT_AYUDA);
  const [updateAyuda] = useMutation(UPDATE_AYUDA);
  const [deleteRelaciones] = useMutation(DELETE_RELACIONES_AYUDA);
  const [insertRelNutriente] = useMutation(INSERT_AYUDA_NUTRIENTE);
  const [insertRelPadecimiento] = useMutation(INSERT_AYUDA_PADECIMIENTO);

  // Llenar formulario al editar
  useEffect(() => {
    if (esEdicion && editData?.ayuda_by_pk) {
      const ayuda = editData.ayuda_by_pk;
      setNombre(ayuda.titulo);
      setDescripcion(ayuda.descripcion);
      setTipo(ayuda.tipo || "GENERAL");
      setNutrientesSel(ayuda.ayuda_nutrientes.map(n => n.nutriente_id));
      setPadecimientosSel(ayuda.padecimiento_ayudas.map(p => p.padecimiento_id));
    }
  }, [editData, esEdicion]);

  const toggle = (itemId, lista, setLista) => {
    lista.includes(itemId) ? setLista(lista.filter(v => v !== itemId)) : setLista([...lista, itemId]);
  };

  const handleGuardar = async () => {
    if (!nombre || !descripcion) return alert("Rellena los campos obligatorios.");
    setGuardando(true);

    try {
      let ayudaIdActual = id;

      if (esEdicion) {
        // ACTUALIZAR EXISTENTE
        await updateAyuda({
          variables: { ayuda_id: parseInt(id), titulo: nombre, descripcion: descripcion, tipo: tipo }
        });
        // Limpiar relaciones viejas
        await deleteRelaciones({ variables: { ayuda_id: parseInt(id) } });
      } else {
        // CREAR NUEVA
        const { data } = await insertAyuda({
          variables: { titulo: nombre, descripcion: descripcion, tipo: tipo }
        });
        ayudaIdActual = data.insert_ayuda_one.ayuda_id;
      }

      // Insertar relaciones (Nuevas o Actualizadas)
      const promesasNut = nutrientesSel.map(nId => 
        insertRelNutriente({ variables: { ayuda_id: ayudaIdActual, nutriente_id: nId } })
      );
      const promesasPad = padecimientosSel.map(pId => 
        insertRelPadecimiento({ variables: { ayuda_id: ayudaIdActual, padecimiento_id: pId } })
      );

      await Promise.all([...promesasNut, ...promesasPad]);
      
      alert(esEdicion ? "Actualizado correctamente" : "Creado correctamente");
      navigate('/ad-ayudas');
    } catch (error) {
      console.error(error);
      alert("Error al procesar la solicitud");
    } finally {
      setGuardando(false);
    }
  };

  if (loadingCat || loadingEdit) return <div className="status-msg">Cargando...</div>;

  return (
    <div className="manage-products-container">
      <AdHeader />
      <div className="modal-content ayuda-form-card">
        <div className="modal-header">
          <h2>{esEdicion ? `Editando: ${nombre}` : "Crear Nueva Ayuda"}</h2>
          <button className="close-modal-btn" onClick={() => navigate('/ad-ayudas')}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="manage-input-group">
            <label>Nombre de la Ayuda *</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          {/* Ahora visible tanto en Creación como en Edición */}
          <div className="manage-input-group">
            <label>Tipo de Ayuda</label>
            <select 
              className="filter-select" 
              value={tipo} 
              onChange={(e) => setTipo(e.target.value)}
              style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}}
            >
              <option value="GENERAL">GENERAL</option>
              <option value="NUTRIENTE">NUTRIENTE</option>
              <option value="PADECIMIENTO">PADECIMIENTO</option>
            </select>
          </div>

          <div className="manage-input-group">
            <label>Descripción Detallada *</label>
            <textarea rows="4" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>

          <div className="selection-grid">
            <div className="selection-box">
              <label>Nutrientes</label>
              <div className="checkbox-list">
                {catData?.nutriente.map(n => (
                  <div key={n.nutriente_id} 
                       className={`check-item ${nutrientesSel.includes(n.nutriente_id) ? 'active' : ''}`}
                       onClick={() => toggle(n.nutriente_id, nutrientesSel, setNutrientesSel)}>
                    <i className={`fa-solid ${nutrientesSel.includes(n.nutriente_id) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    {n.nombre}
                  </div>
                ))}
              </div>
            </div>

            <div className="selection-box">
              <label>Padecimientos</label>
              <div className="checkbox-list">
                {catData?.padecimiento.map(p => (
                  <div key={p.padecimiento_id} 
                       className={`check-item ${padecimientosSel.includes(p.padecimiento_id) ? 'active' : ''}`}
                       onClick={() => toggle(p.padecimiento_id, padecimientosSel, setPadecimientosSel)}>
                    <i className={`fa-solid ${padecimientosSel.includes(p.padecimiento_id) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    {p.nombre}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={() => navigate('/ad-ayudas')}>Cancelar</button>
          <button className="btn-confirm" onClick={handleGuardar} disabled={guardando}>
            {guardando ? "Guardando..." : esEdicion ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AyudaForm;