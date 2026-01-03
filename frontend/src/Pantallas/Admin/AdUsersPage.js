import React, { useEffect, useState } from 'react';
import './AdUsersPage.css';
import Header from '../../Componentes/Header';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USUARIOS } from '../../graphql/query';
import { AD_UPDATE_USUARIO, AD_DELETE_USUARIO, AD_UPDATE_FOTO_PERFIL } from '../../graphql/mutations';
import { GET_PADECIMIENTOS } from '../../graphql/query';
import { INSERT_USUARIO_PADECIMIENTO, DELETE_USUARIO_PADECIMIENTO} from '../../graphql/mutations';
import { gql } from "@apollo/client";

const UsersAdminPage = () => {
  const { data, loading, error } = useQuery(GET_USUARIOS);
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('nombre');

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar usuarios</p>;

  const users = data.usuario;

  const filteredUsers = users.filter((u) =>
    String(searchBy === 'id' ? u.usuario_id : u.nombre)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="users-admin-container">
      <Header />

      <div className="users-search">
        <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
          <option value="nombre">Nombre</option>
          <option value="id">ID</option>
        </select>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredUsers.map((user) => (
        <UserCard key={user.usuario_id} user={user} />
      ))}
    </div>
  );
};

const UserCard = ({ user }) => {
    const { refetch } = useQuery(GET_USUARIOS);
  const [originalUser, setOriginalUser] = useState(user);
  const [editedUser, setEditedUser] = useState(user);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updateFotoPerfil] = useMutation(AD_UPDATE_FOTO_PERFIL);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedAilmentId, setSelectedAilmentId] = useState(null);
const [insertUsuarioPadecimiento] = useMutation(
  INSERT_USUARIO_PADECIMIENTO,
  {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setSelectedAilmentId(null);
    },
  }
);
const [deleteUsuarioPadecimiento] = useMutation(
  DELETE_USUARIO_PADECIMIENTO,
  {
    onCompleted: () => {
      refetch();
    },
  }
);
const { data: padecimientosData } = useQuery(GET_PADECIMIENTOS);
  
  const EDITABLE_FIELDS = [
    'nombre',
    'email',
    'rol',
    'foto_perfil',
  ];

  const allAilments = padecimientosData?.padecimiento || [];

const assignedIds = user.usuario_padecimientos.map(
  (up) => up.padecimiento.padecimiento_id
);

const availableAilments = allAilments.filter(
  (a) => !assignedIds.includes(a.padecimiento_id)
);

  const [updateUser] = useMutation(AD_UPDATE_USUARIO);
  const [deleteUser] = useMutation(AD_DELETE_USUARIO, {
    update(cache) {
      cache.modify({
        fields: {
          usuario(existingRefs = [], { readField }) {
            return existingRefs.filter(
              (ref) =>
                readField('usuario_id', ref) !== originalUser.usuario_id
            );
          },
        },
      });
    },
  });

  const uploadImage = async (file) => {
  const data = new FormData();
  data.append('file', file);
  const res = await fetch('http://191.96.31.39:4000/upload', {
    method: 'POST',
    body: data,
  });
  const result = await res.json();
  return result.filePath;
};

const handleChangePhoto = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const newPath = await uploadImage(file);
      const res = await updateFotoPerfil({
        variables: {
          usuario_id: originalUser.usuario_id,
          foto_perfil: newPath,
        },
      });
      const updated = {
        ...originalUser,
        foto_perfil: res.data.update_usuario_by_pk.foto_perfil,
      };
      setOriginalUser(updated);
      setEditedUser(updated);
    } catch (err) {
      console.error('❌ Error al cambiar foto', err);
      alert('Error al cambiar la foto');
    }
  };
  input.click();
};

const handleDeletePhoto = async () => {
  if (!window.confirm('¿Eliminar foto de perfil?')) return;
  try {
    const res = await updateFotoPerfil({
      variables: {
        usuario_id: originalUser.usuario_id,
        foto_perfil: null,
      },
    });
    const updated = {
      ...originalUser,
      foto_perfil: null,
    };
    setOriginalUser(updated);
    setEditedUser(updated);
  } catch (err) {
    console.error('❌ Error al borrar foto', err);
    alert('Error al borrar la foto');
  }
};

  /** 🔍 Detectar cambios */
  useEffect(() => {
  const changed =
    Object.keys(editedUser).some(
      (key) =>
        key !== 'fecha_registro' &&
        editedUser[key] !== originalUser[key]
    ) || newPassword.length > 0;
  setHasChanges(changed);
}, [editedUser, originalUser, newPassword]);

  /** 💾 Guardar */
  const handleSave = async () => {
  const changes = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (editedUser[field] !== originalUser[field]) {
      changes[field] = editedUser[field];
    }
  });
  if (newPassword.trim() !== '') {
    changes.password_hash = newPassword;
  }
  if (Object.keys(changes).length === 0) return;
  try {
    const res = await updateUser({
      variables: {
        usuario_id: originalUser.usuario_id,
        changes,
      },
    });
    const updated = res.data.update_usuario_by_pk;
    setOriginalUser(updated);
    setEditedUser(updated);
    setNewPassword(''); // 🔥 limpiar
  } catch (err) {
    console.error('❌ Error al guardar usuario:', err);
    alert('Error al guardar cambios');
  }
};

  /** ❌ Cancelar */
  const handleCancel = () => {
  setEditedUser(originalUser);
  setNewPassword('');
};

  /** 🗑 Eliminar */
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    await deleteUser({
      variables: { usuario_id: originalUser.usuario_id },
    });
  };

const handleDeleteAilment = async (padecimiento_id) => {
  if (!window.confirm('¿Eliminar este padecimiento?')) return;
  try {
    await deleteUsuarioPadecimiento({
      variables: {
        usuario_id: user.usuario_id,
        padecimiento_id,
      },
    });
  } catch (err) {
    console.error('❌ Error al eliminar padecimiento', err);
    alert('Error al eliminar padecimiento');
  }
};

const handleAddAilment = async () => {
  if (!selectedAilmentId) return;
  try {
    await insertUsuarioPadecimiento({
      variables: {
        usuario_id: user.usuario_id,
        padecimiento_id: selectedAilmentId,
      },
    });
  } catch (err) {
    console.error('❌ Error al agregar padecimiento', err);
    alert('Error al agregar padecimiento');
  }
};

  return (
    <div className="user-card-wrapper">
      <div className="ad-user-coupon-card">
        {/* FOTO */}
        <div className="user-image">
          {editedUser.foto_perfil ? (
            <img
              src={`http://191.96.31.39:4000${editedUser.foto_perfil}`}
              alt={editedUser.nombre}
            />
          ) : (
            <div className="fake-photo">
              <i className="fa-solid fa-user"></i>
            </div>
          )}

        <div className="image-actions">
        <button type="button" onClick={handleChangePhoto}>
            <i className="fa-solid fa-pen"></i>
        </button>

        <button type="button" onClick={handleDeletePhoto}>
            <i className="fa-solid fa-trash"></i>
        </button>
        </div>
        </div>
        {/* CONTENIDO */}
        <div className="user-content">
          <h2>
            ID:
            <input value={editedUser.usuario_id} disabled />
            Nombre:
            <input
              value={editedUser.nombre}
              onChange={(e) =>
                setEditedUser({ ...editedUser, nombre: e.target.value })
              }
            />
          </h2>

          <div className="user-row">
            <label>Email: </label>
            <input
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
            />
          </div>

          <div className="user-row">
            <label>Contraseña: </label>
            <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                placeholder="Sin cambios"
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
            >
                <i
                className={`fa-solid ${
                    showPassword ? 'fa-eye-slash' : 'fa-eye'
                }`}
                />
            </button>
            </div>

          <div className="user-row">
            <label>Rol: </label>
            <select
              value={editedUser.rol}
              onChange={(e) =>
                setEditedUser({ ...editedUser, rol: e.target.value })
              }
            >
              <option value="usuario">usuario</option>
              <option value="admin">admin</option>
              <option value="dev">dev</option>
            </select>
          </div>

          <div className="user-row small">
            Fecha de registro:{' '}
            {new Date(editedUser.fecha_registro).toLocaleDateString()}
          </div>
        </div>

        {/* BOTONES */}
        <div className="user-actions">
          <button className="btn btn-red" onClick={handleDelete}>
            <i className="fa-solid fa-trash"></i>
          </button>

          <button
            className="btn btn-gray"
            disabled={!hasChanges}
            onClick={handleCancel}
          >
            Cancelar
          </button>

          <button
            className="btn btn-green"
            disabled={!hasChanges}
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>

      {/* PADECIMIENTOS */}
      <div className="user-padecimientos">
        {user.usuario_padecimientos.length === 0 ? (
          <span className="padecimiento-chip empty">
            Sin padecimientos
          </span>
        ) : (
          user.usuario_padecimientos.map((up) => (
            <div
                key={`${user.usuario_id}-${up.padecimiento.padecimiento_id}`}
                className="padecimiento-chip"
            >
                {up.padecimiento.nombre}
                <button
                className="padecimiento-chip-delete"
                onClick={() =>
                    handleDeleteAilment(up.padecimiento.padecimiento_id)
                }
                title="Eliminar"
                >
                ×
                </button>
            </div>
            ))
        )}
        <div className="user-padecimientos-footer">
        <button
            className="padecimiento-add-btn"
            onClick={() => {
            if (availableAilments.length > 0) {
                setSelectedAilmentId(availableAilments[0].padecimiento_id);
            }
            setIsModalOpen(true);
            }}
        >
            +
        </button>
        </div>
        



{isModalOpen && (
  <div className="ailment-modal">
    <div className="ailment-modal-content">
      <h3>Agregar padecimiento</h3>

      <select
        value={selectedAilmentId || ''}
        onChange={(e) => setSelectedAilmentId(Number(e.target.value))}
      >
        {availableAilments.map((a) => (
          <option
            key={a.padecimiento_id}
            value={a.padecimiento_id}
          >
            {a.nombre}
          </option>
        ))}
      </select>

      <div className="ailment-modal-actions">
        <button onClick={() => setIsModalOpen(false)}>
          Cancelar
        </button>
        <button
          onClick={handleAddAilment}
          disabled={!selectedAilmentId}
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
)}






      </div>
    </div>
  );
};

export default UsersAdminPage;