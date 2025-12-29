// src/Pantallas/AilmentsPage.js 
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Header from '../Componentes/Header';
import './AilmentsPage.css';
import {
  GET_PADECIMIENTOS,
  GET_USUARIO_PADECIMIENTOS
} from '../graphql/query';
import {
    INSERT_USUARIO_PADECIMIENTO, 
    DELETE_USUARIO_PADECIMIENTO
} from '../graphql/mutations';

const AilmentsPage = () => {
    const navigate = useNavigate();

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ID del padecimiento seleccionado
    const [selectedAilmentId, setSelectedAilmentId] = useState(null);

    // Padecimientos del usuario
    const [userAilments, setUserAilments] = useState([]);
    
    // Datos de usuario
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const usuarioId = usuario?.usuario_id;

    // Todos los padecimientos
    const { data: padecimientosData } = useQuery(GET_PADECIMIENTOS);

    // Padecimientos del usuario
    const {
    data: usuarioPadecimientosData,
    refetch: refetchUsuarioPadecimientos
    } = useQuery(
    GET_USUARIO_PADECIMIENTOS,
    {
        variables: { usuario_id: usuarioId },
        skip: !usuarioId
    }
    );

    const [insertUsuarioPadecimiento] = useMutation(
    INSERT_USUARIO_PADECIMIENTO
    );

    const [deleteUsuarioPadecimiento] = useMutation(
    DELETE_USUARIO_PADECIMIENTO
    );

    // Catálogo real de padecimientos
    const availableAilments = padecimientosData?.padecimiento || [];

    // Cargar padecimientos del usuario
    useEffect(() => {
    if (usuarioPadecimientosData) {
        setUserAilments(
        usuarioPadecimientosData.usuario_padecimiento.map(up => ({
            id: up.padecimiento.padecimiento_id,
            nombre: up.padecimiento.nombre,
            descripcion: up.padecimiento.descripcion
        }))
        );
        console.log('📥 Padecimientos del usuario:', usuarioPadecimientosData);
    }
    }, [usuarioPadecimientosData]);

    const handleOpenModal = () => {
    if (availableAilments.length > 0) {
        setSelectedAilmentId(availableAilments[0].padecimiento_id);
    }
    setIsModalOpen(true);
    };

    const handleCloseModal = () => {
    setIsModalOpen(false);
    };

    const handleSaveAilment = async () => {
    if (!selectedAilmentId || ailmentsToDisplay.length === 0) return;

    try {
        await insertUsuarioPadecimiento({
        variables: {
            usuario_id: usuarioId,
            padecimiento_id: selectedAilmentId
        }
        });

        await refetchUsuarioPadecimientos();
        handleCloseModal();
    } catch (error) {
        console.error('Error al guardar padecimiento:', error);
    }
    };

    const handleDeleteAilment = async (idToRemove) => {
    try {
        await deleteUsuarioPadecimiento({
        variables: {
            usuario_id: usuarioId,
            padecimiento_id: idToRemove
        }
        });
        await refetchUsuarioPadecimientos();
    } catch (error) {
        console.error('Error al eliminar padecimiento:', error);
    }
    };

    const getFilteredAilments = () => {
    const selectedIds = userAilments.map(a => a.id);
    return availableAilments.filter(
        a => !selectedIds.includes(a.padecimiento_id)
    );
    };

    const ailmentsToDisplay = getFilteredAilments();

    useEffect(() => {
    // Si ya no hay padecimientos disponibles → limpiar selección
    if (ailmentsToDisplay.length === 0) {
        setSelectedAilmentId(null);
        return;
    }
    // Si no hay selección o la selección ya no existe → tomar el primero válido
    if (
        selectedAilmentId === null ||
        !ailmentsToDisplay.some(
        a => a.padecimiento_id === selectedAilmentId
        )
    ) {
        setSelectedAilmentId(ailmentsToDisplay[0].padecimiento_id);
    }
    }, [ailmentsToDisplay]);

    const handleGoBack = () => {
    navigate('/inicio');
    };

    return (
        <div className="ailment-page-wrapper">
            {/* 1. Encabezado Reutilizable */}
            <Header />

            <div className="ailment-main-container">
                <div className="ailment-box">

                    {/* 2. Encabezado de la caja con el botón de agregar */}
                    <div className="ailment-box-header">
                        <div className="back-ailments" onClick={handleGoBack}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </div>
                        <h2 className="ailment-box-title">Padecimientos y Alergias</h2>
                        <button className="ailment-btn-add" onClick={handleOpenModal}>
                            +
                        </button>
                    </div>

                    {/* 3. Lista de padecimientos del usuario */}
                    {userAilments.length > 0 ? (
                        <ul className="ailment-lista">
                            {userAilments.map(ailment => (
                                <li key={ailment.id}>
                                    <span className="ailment-name">• {ailment.nombre}</span>
                                    <button 
                                        className="ailment-btn-delete" 
                                        onClick={() => handleDeleteAilment(ailment.id)}
                                        title="Eliminar"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="ailment-empty-list-text">
                            No has agregado ningún padecimiento.
                        </p>
                    )}
                </div>
            </div>

            {/* 4. Modal de Agregar (solo visible si isModalOpen es true) */}
            {isModalOpen && (
                <div className="ailment-modal">
                    <div className="ailment-modal-content">
                        <h3>Seleccionar padecimiento</h3>
                        
                        {/* Dropdown (Select) */}
                        <select
                        className="ailment-input-select"
                        value={selectedAilmentId || ''}
                        onChange={(e) => setSelectedAilmentId(parseInt(e.target.value))}
                        >
                        {ailmentsToDisplay.map(ailment => (
                            <option
                            key={ailment.padecimiento_id}
                            value={ailment.padecimiento_id}
                            title={ailment.descripcion}
                            >
                            {ailment.nombre}
                            </option>
                        ))}
                        </select>
                        
                        <div className="ailment-modal-actions">
                            <button className="ailment-btn-cancel" onClick={handleCloseModal}>
                                Cancelar
                            </button>
                            <button
                            className="ailment-btn-save"
                            onClick={handleSaveAilment}
                            disabled={!selectedAilmentId || ailmentsToDisplay.length === 0}
                            >
                            Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AilmentsPage;