// src/Pantallas/ListPage.js
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LISTAS_USUARIO, INSERT_LISTA, DELETE_LISTA, UPDATE_LISTA } from '../graphql/listas';
import { useNavigate } from 'react-router-dom';
import ListItem from '../Componentes/ListItem';
import Header from '../Componentes/Header';
import ModalCard from '../Componentes/ModalCard';
import './ListPage.css';

const ListPage = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const { data, loading, error } = useQuery(
    GET_LISTAS_USUARIO,
    {
      variables: { usuario_id: usuario.usuario_id }
    }
  );

  const lists = data?.lista_compra || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [nombreLista, setNombreLista] = useState('');
    const [isEditing, setIsEditing] = useState(false);
const [editingListId, setEditingListId] = useState(null);
const [originalNombreLista, setOriginalNombreLista] = useState('');

    const [insertLista, { loading: creating }] = useMutation(INSERT_LISTA, {
    refetchQueries: ['GetListasUsuario'], // 🔄 recarga listas
    });

    const [deleteLista] = useMutation(DELETE_LISTA, {
    refetchQueries: ['GetListasUsuario'], // 👈 mismo nombre del query
    });

    const [updateLista, { loading: updating }] = useMutation(UPDATE_LISTA, {
  refetchQueries: ['GetListasUsuario'],
});

const isSaveDisabled =
  !nombreLista.trim() ||
  (isEditing && nombreLista.trim() === originalNombreLista.trim());

const handleCloseModal = () => {
  setIsModalOpen(false);
  setIsEditing(false);
  setEditingListId(null);
  setNombreLista('');
  setOriginalNombreLista('');
};

  // 🔙 Volver
  const handleGoBack = () => {
    navigate('/inicio');
  };

  const handleSaveList = async () => {
  if (!nombreLista.trim()) return;

  try {
    if (isEditing) {
      await updateLista({
        variables: {
          lista_id: editingListId,
          nombre: nombreLista,
        },
      });
    } else {
      await insertLista({
        variables: {
          nombre: nombreLista,
          usuario_id: usuario.usuario_id,
        },
      });
    }

    // limpiar estado
    setNombreLista('');
    setEditingListId(null);
    setIsEditing(false);
    setIsModalOpen(false);
  } catch (err) {
    console.error('Error al guardar la lista', err);
  }
};

  const handleNewListClick = () => {
  setIsEditing(false);
  setEditingListId(null);
  setNombreLista('');
  setIsModalOpen(true);
};

  const handleListSelect = (listId) => {
    navigate(`/listas/${listId}`);
  };

  const handleListEdit = (listId) => {
  const lista = lists.find(l => l.lista_id === listId);
  if (!lista) return;

  setNombreLista(lista.nombre);
  setOriginalNombreLista(lista.nombre); // 👈 clave
  setEditingListId(listId);
  setIsEditing(true);
  setIsModalOpen(true);
};

  const handleListDelete = async (listId) => {
    const confirmDelete = window.confirm(
        '¿Estás seguro de que quieres eliminar esta lista?'
    );

    if (!confirmDelete) return;

    try {
        await deleteLista({
        variables: {
            lista_id: listId,
        },
        });

        console.log(`Lista ${listId} eliminada`);
    } catch (err) {
        console.error('Error al eliminar la lista:', err);
        alert('No se pudo eliminar la lista');
    }
    };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Cargando listas...</p>;
  }

  if (error) {
    console.error(error);
    return <p style={{ textAlign: 'center' }}>Error al cargar listas</p>;
  }

  return (
    <div className="list-page-container">

      <Header />

      <div className="button-group-wrapper">
        <button className="list-back" onClick={handleGoBack}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <button className="btn-nueva-lista" onClick={handleNewListClick}>
          Nueva Lista de Compras
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="listas-wrapper">
        {lists.map(list => (
          <ListItem
            key={list.lista_id}
            list={{
              id: list.lista_id,
              name: list.nombre
            }}
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
        <ModalCard isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="lista-modal-content">
            <h3>{isEditing ? 'Editar lista' : 'Nueva lista'}</h3>

            <input
            className="lista-modal-input"
            type="text"
            placeholder="Nombre de la lista"
            value={nombreLista}
            onChange={(e) => setNombreLista(e.target.value)}
            />

            <div className="modal-actions lista-modal-actions">
            <button
                className="btn-cancelar"
                onClick={() => setIsModalOpen(false)}
            >
                Cancelar
            </button>

            <button
            className="btn-crear"
            onClick={handleSaveList}
            disabled={isSaveDisabled}
            >
            {isEditing ? 'Guardar cambios' : 'Crear'}
            </button>
            </div>
        </div>
        </ModalCard>
    </div>
  );
};

export default ListPage;