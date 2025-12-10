import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Componentes/Header';
import './AilmentsPage.css';

// Catálogo FALSO de padecimientos disponibles
const availableAilments = [
    { id: 1, name: 'Diabetes Tipo 2' },
    { id: 2, name: 'Hipertensión Arterial' },
    { id: 3, name: 'Colesterol Alto' },
    { id: 4, name: 'Enfermedad Celíaca (Gluten)' },
    { id: 5, name: 'Intolerancia a la Lactosa' },
    { id: 6, name: 'Alergia al Maní' },
    { id: 7, name: 'Alergia a Mariscos' },
    { id: 8, name: 'Gota' },
];

const AilmentsPage = () => {
    // Estado para la lista de padecimientos seleccionados por el usuario
    const [userAilments, setUserAilments] = useState([
        { id: 2, name: 'Hipertensión Arterial' },
        { id: 5, name: 'Intolerancia a la Lactosa' },
    ]);
    // Estado para controlar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para el valor seleccionado en el dropdown del modal
    const [selectedAilment, setSelectedAilment] = useState(availableAilments[0].name);

    // Muestra el modal y resetea el valor seleccionado al primer elemento
    const handleOpenModal = () => {
        if (availableAilments.length > 0) {
            setSelectedAilment(availableAilments[0].name);
        }
        setIsModalOpen(true);
    };

    // Oculta el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Agrega el padecimiento seleccionado a la lista del usuario
    const handleSaveAilment = () => {
        if (!selectedAilment) {
            console.log("Debe seleccionar un padecimiento.");
            return;
        }

        const newAilment = availableAilments.find(a => a.name === selectedAilment);
        
        // Evita agregar duplicados
        if (newAilment && !userAilments.some(a => a.id === newAilment.id)) {
            setUserAilments([...userAilments, newAilment]);
        }
        
        handleCloseModal();
    };

    // Elimina un padecimiento de la lista
    const handleDeleteAilment = (idToRemove) => {
        // En lugar de window.confirm()
        console.log(`Padecimiento ${idToRemove} marcado para eliminación.`); 
        
        setUserAilments(userAilments.filter(a => a.id !== idToRemove));
    };


    // Filtra los padecimientos disponibles para que el usuario no seleccione duplicados
    const getFilteredAilments = () => {
        const selectedIds = userAilments.map(a => a.id);
        return availableAilments.filter(a => !selectedIds.includes(a.id));
    };
    
    const ailmentsToDisplay = getFilteredAilments();

    const navigate = useNavigate();
    
    // Función para manejar el clic en el ícono de "Atrás"
    const handleGoBack = () => {
        navigate('/inicio'); // Regresa a la página anterior en el historial
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
                                    <span className="ailment-name">• {ailment.name}</span>
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
                        {ailmentsToDisplay.length > 0 ? (
                            <select 
                                className="ailment-input-select"
                                value={selectedAilment}
                                onChange={(e) => setSelectedAilment(e.target.value)}
                            >
                                {ailmentsToDisplay.map(ailment => (
                                    <option key={ailment.id} value={ailment.name}>
                                        {ailment.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="ailment-input-select-empty">
                                No hay más opciones disponibles para agregar.
                            </p>
                        )}
                        
                        <div className="ailment-modal-actions">
                            <button className="ailment-btn-cancel" onClick={handleCloseModal}>
                                Cancelar
                            </button>
                            <button 
                                className="ailment-btn-save" 
                                onClick={handleSaveAilment}
                                disabled={ailmentsToDisplay.length === 0}
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