import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItem from '../Componentes/ListItem';
import Header from '../Componentes/Header';
import './ListPage.css';

// Datos de ejemplo simulando las listas de la BD
const dummyLists = [
    { id: 1, name: 'Lista de Despensa Semanal' },
    { id: 2, name: 'Artículos para la Cena' },
    { id: 3, name: 'Productos Sin Sellos' },
    { id: 4, name: 'Compra de Frutas y Verduras' },
    { id: 5, name: 'Pendientes varios' },
];

const ListPage = () => {
    const navigate = useNavigate();
    const [lists, setLists] = useState(dummyLists);
    
    // Función para manejar el clic en el ícono de "Atrás"
    const handleGoBack = () => {
        navigate('/inicio'); // Regresa a la página anterior en el historial
    };

    // Handler para crear una nueva lista (navegar a una página de creación/modal)
    const handleNewListClick = () => {
        console.log("Crear nueva lista activado.");
        // navigate('/crear-lista'); // Ruta para la creación de listas
    };

    // Handler al hacer clic en una lista específica (entrar al detalle)
    const handleListSelect = (listId) => {
        console.log(`Seleccionada la lista con ID: ${listId}. Navegando a su detalle...`);
        // navigate(`/listas/${listId}`); 
    };

    // Handler al hacer clic en el lápiz (editar)
    const handleListEdit = (listId) => {
        console.log(`Editar lista con ID: ${listId}.`);
        // Aquí se mostraría un modal o se cambiaría el nombre de la lista.
    };

    // Handler al hacer clic en el bote de basura (eliminar)
    const handleListDelete = (listId) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la lista con ID ${listId}?`)) {
            // Lógica para eliminar de Firestore (o la BD) y actualizar el estado
            setLists(lists.filter(list => list.id !== listId));
            console.log(`Lista ${listId} eliminada.`);
        }
    };


    return (
        <div className="list-page-container">
            
            {/* Encabezado Superior */}
            <Header />

            {/* Botón para crear nueva lista */}
            <div className='button-group-wrapper'>
                <button className="list-back" onClick={handleGoBack}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="btn-nueva-lista" onClick={handleNewListClick}>
                    Nueva Lista de Compras
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>

            {/* Contenedor de Listas (Iteración de componentes ListItem) */}
            <div className="listas-wrapper">
                {lists.map(list => (
                    <ListItem 
                        key={list.id}
                        list={list}
                        onSelect={handleListSelect}
                        onEdit={handleListEdit}
                        onDelete={handleListDelete}
                    />
                ))}

                {lists.length === 0 && (
                    <p style={{ marginTop: '50px', color: '#555' }}>
                        No tienes listas de compras. ¡Crea una para empezar!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ListPage;