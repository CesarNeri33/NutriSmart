import React from 'react';
// El CSS ya está importado en ListPage, no es necesario aquí si solo se usa ahí.
// Si se reutiliza en otro lugar, se recomienda un CSS propio.

const ListItem = ({ list, onSelect, onEdit, onDelete }) => {

    const handleSelect = () => {
        // Al hacer clic en el nombre de la lista, navegar a los detalles
        onSelect(list.id);
    };

    const handleEdit = (e) => {
        // Prevenir que el click en el ícono active la navegación (onSelect)
        e.stopPropagation(); 
        onEdit(list.id);
    };

    const handleDelete = (e) => {
        // Prevenir que el click en el ícono active la navegación (onSelect)
        e.stopPropagation();
        onDelete(list.id);
    };

    return (
        <div className="objeto-listas" onClick={handleSelect}>
            
            {/* Nombre de la Lista */}
            <span>{list.name}</span>
            
            {/* Iconos de Acción */}
            <div className="iconos">
                <i className="fa-solid fa-pen" onClick={handleEdit} title="Editar nombre"></i>
                <i className="fa-solid fa-trash" onClick={handleDelete} title="Eliminar lista"></i>
            </div>
        </div>
    );
};

export default ListItem;