// src/Pantallas/User/AdListsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import AdHeader from '../../Componentes/AdHeader';

import { 
    GET_ALL_LISTAS_ADMIN, 
    DELETE_LISTA, 
    GET_PRODUCTOS_LISTA_ADMIN,
    DELETE_PRODUCTO_DE_LISTA,
    INSERT_LISTA,
    INSERT_PRODUCTO_A_LISTA,
    GET_PRODUCTOS_BUSQUEDA,
    UPDATE_UNIDAD_PRODUCTO,
    UPDATE_NOMBRE_LISTA // Asegúrate de tener esta mutación en tu archivo de graphql
} from '../../graphql/listas';

import './AdListPage.css';

const AdListsPage = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedLista, setSelectedLista] = useState(null);
    const [newListName, setNewListName] = useState('');
    const [targetUserId, setTargetUserId] = useState('');

    const { data: listasData, loading: listasLoading } = useQuery(GET_ALL_LISTAS_ADMIN);

    const [deleteLista] = useMutation(DELETE_LISTA, { refetchQueries: [{ query: GET_ALL_LISTAS_ADMIN }] });
    const [insertLista] = useMutation(INSERT_LISTA, { refetchQueries: [{ query: GET_ALL_LISTAS_ADMIN }] });
    
    // Mutación para cambiar el nombre
    const [updateNombre] = useMutation(UPDATE_NOMBRE_LISTA);

    const handleCreateLista = async (e) => {
        e.preventDefault();
        if (!newListName || !targetUserId) return alert("Llena todos los campos");
        try {
            await insertLista({ variables: { nombre: newListName, usuario_id: Number(targetUserId) } });
            setNewListName(''); setTargetUserId('');
        } catch (err) { alert("Error al crear lista"); }
    };

    const handleRename = async (lista_id, nuevoNombre) => {
        try {
            await updateNombre({ variables: { lista_id, nombre: nuevoNombre } });
        } catch (err) { alert("Error al renombrar lista"); }
    };

    if (listasLoading) return <div className="manage-lists-container"><AdHeader /><p>Cargando...</p></div>;

    return (
        <div className="manage-lists-container">
            <AdHeader />

            <div className="manage-top-bar">
                <button className="manage-back-button" onClick={() => navigate('/ad-inicio')}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <form className="ad-add-list-form" onSubmit={handleCreateLista}>
                    <input type="number" placeholder="ID Usuario" value={targetUserId} onChange={(e)=>setTargetUserId(e.target.value)} />
                    <input type="text" placeholder="Nombre de nueva lista..." value={newListName} onChange={(e)=>setNewListName(e.target.value)} />
                    <button type="submit" className="manage-add-button-inline">Crear</button>
                </form>
            </div>

            <div className="ad-lists-grid">
                {listasData?.lista_compra.map((lista) => (
                    <div key={lista.lista_id} className="manage-list-card">
                    <div className="manage-card-aside-simple">
                        <span className="user-id-label">Usuario #{lista.usuario_id}</span>
                        <span className="manage-id-tag">ID: {lista.lista_id}</span>
                    </div>

                    <div className="manage-card-main">
                        <div className="manage-input-group full">
                            <label>NOMBRE DE LA LISTA (Haz click para editar)</label>
                            <input 
                                type="text" 
                                className="editable-list-name"
                                defaultValue={lista.nombre} 
                                onBlur={(e) => {
                                    if(e.target.value !== lista.nombre) handleRename(lista.lista_id, e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    {/* Este contenedor ahora tiene el margen superior en el CSS */}
                    <div className="manage-simple-actions">
                        <button className="img-btn-black" onClick={() => { setSelectedLista(lista); setShowModal(true); }}>
                            <i className="fa-solid fa-eye"></i> Ver Contenido
                        </button>
                    </div>

                    <button className="action-btn delete-btn" onClick={() => {/*...*/}}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
                ))}
            </div>

            {showModal && <ModalProductos lista={selectedLista} onClose={() => setShowModal(false)} />}
        </div>
    );
};

const ModalProductos = ({ lista, onClose }) => {
    const [query, setQuery] = useState('');
    const { data: listProds } = useQuery(GET_PRODUCTOS_LISTA_ADMIN, { variables: { lista_id: lista.lista_id } });
    const { data: allP } = useQuery(GET_PRODUCTOS_BUSQUEDA);
    
    const [delP] = useMutation(DELETE_PRODUCTO_DE_LISTA, { 
        refetchQueries: [{ query: GET_PRODUCTOS_LISTA_ADMIN, variables: { lista_id: lista.lista_id } }] 
    });
    const [addP] = useMutation(INSERT_PRODUCTO_A_LISTA, { 
        refetchQueries: [{ query: GET_PRODUCTOS_LISTA_ADMIN, variables: { lista_id: lista.lista_id } }] 
    });
    const [updateCant] = useMutation(UPDATE_UNIDAD_PRODUCTO, {
        refetchQueries: [{ query: GET_PRODUCTOS_LISTA_ADMIN, variables: { lista_id: lista.lista_id } }]
    });

    const handleUpdateCantidad = (id, actual, delta) => {
        const nueva = actual + delta;
        if (nueva > 0) updateCant({ variables: { id, unidad: nueva } });
    };

    const suggestions = query.length > 1 ? allP?.producto.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];

    return (
        <div className="modal-overlay">
            <div className="modal-content admin-modal">
                <div className="modal-header">
                    <h3>Lista: {lista.nombre}</h3>
                    <button className="close-modal-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="ad-modal-search-container">
                        <div className="ad-modal-search-small">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input 
                                type="text" 
                                placeholder="Añadir producto..." 
                                value={query} 
                                onChange={e => setQuery(e.target.value)} 
                            />
                        </div>
                        {suggestions.length > 0 && (
                            <ul className="ad-suggestions-dropdown">
                                {suggestions.map(p => (
                                    <li key={p.producto_id}>
                                        <span>{p.nombre}</span>
                                        <button className="add-p-btn" onClick={() => { 
                                            addP({variables:{lista_id:lista.lista_id, producto_id:p.producto_id, cantidad:1}}); 
                                            setQuery(''); 
                                        }}> + </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    <table className="ad-simple-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th style={{ textAlign: 'center' }}>Cant.</th>
                                <th style={{ textAlign: 'right' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listProds?.lista_producto.map(item => (
                                <tr key={item.id}>
                                    <td>{item.producto.nombre}</td>
                                    <td>
                                        <div className="ad-qty-controls">
                                            <button className="btn-qty" onClick={() => handleUpdateCantidad(item.id, item.cantidad, -1)}>-</button>
                                            <span className="qty-number">{item.cantidad}</span>
                                            <button className="btn-qty" onClick={() => handleUpdateCantidad(item.id, item.cantidad, 1)}>+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-cell-container">
                                            <button className="btn-delete-small" onClick={() => delP({variables:{id:item.id}})}>
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer"><button className="btn-cancel" onClick={onClose}>Cerrar</button></div>
            </div>
        </div>
    );
};

export default AdListsPage;