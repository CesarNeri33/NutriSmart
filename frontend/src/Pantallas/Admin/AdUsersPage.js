import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import Header from '../../Componentes/Header'; // Usamos el Header estándar
import { GET_USUARIOS, GET_PADECIMIENTOS } from '../../graphql/query';
import { 
  AD_UPDATE_USUARIO, 
  AD_DELETE_USUARIO, 
  AD_UPDATE_FOTO_PERFIL,
  INSERT_USUARIO_PADECIMIENTO, 
  DELETE_USUARIO_PADECIMIENTO 
} from '../../graphql/mutations';

import './AdUsersPage.css'; 

const UsersAdminPage = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_USUARIOS);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="manage-loading">Cargando usuarios...</div>;
  if (error) return <div className="manage-error">Error al cargar usuarios</div>;

  const users = data?.usuario ?? [];

  const filteredUsers = users.filter((u) =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(u.usuario_id).includes(searchTerm)
  );

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
            placeholder="Buscar por nombre, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Espacio vacío para mantener simetría si no hay botón de agregar */}
        <div style={{width: '45px'}}></div>
      </div>

      <div className="manage-list">
        {filteredUsers.map((user) => (
          <UserCard key={user.usuario_id} user={user} globalRefetch={refetch} />
        ))}
      </div>
    </div>
  );
};

const UserCard = ({ user, globalRefetch }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAilmentId, setSelectedAilmentId] = useState(null);

  const { data: padecimientosData } = useQuery(GET_PADECIMIENTOS);
  const [updateUser] = useMutation(AD_UPDATE_USUARIO);
  const [deleteUser] = useMutation(AD_DELETE_USUARIO);
  const [updateFotoPerfil] = useMutation(AD_UPDATE_FOTO_PERFIL);
  const [insertUsuarioPadecimiento] = useMutation(INSERT_USUARIO_PADECIMIENTO);
  const [deleteUsuarioPadecimiento] = useMutation(DELETE_USUARIO_PADECIMIENTO);

  const allAilments = padecimientosData?.padecimiento || [];
  const assignedIds = user.usuario_padecimientos.map(up => up.padecimiento.padecimiento_id);
  const availableAilments = allAilments.filter(a => !assignedIds.includes(a.padecimiento_id));

  useEffect(() => {
    const changed = editedUser.nombre !== user.nombre || 
                    editedUser.email !== user.email || 
                    editedUser.rol !== user.rol || 
                    newPassword !== '';
    setHasChanges(changed);
  }, [editedUser, user, newPassword]);

  const handleSave = async () => {
    try {
      const changes = {
        nombre: editedUser.nombre,
        email: editedUser.email,
        rol: editedUser.rol
      };
      if (newPassword) changes.password_hash = newPassword;

      await updateUser({ variables: { usuario_id: user.usuario_id, changes } });
      alert('Usuario actualizado');
      setNewPassword('');
      globalRefetch();
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Eliminar este usuario definitivamente?')) {
      await deleteUser({ variables: { usuario_id: user.usuario_id } });
      globalRefetch();
    }
  };

  return (
    <div className="manage-product-card user-card-custom">
      {/* LADO IZQUIERDO: FOTO */}
      <div className="manage-card-aside">
        <div className="manage-image-box user-photo-box">
          {user.foto_perfil ? (
            <img src={`http://191.96.31.39:4000${user.foto_perfil}`} alt="Perfil" />
          ) : (
            <i className="fa-solid fa-user-circle" style={{fontSize: '3rem', color: '#ccc'}}></i>
          )}
        </div>
        <span className="manage-id-tag">ID: {user.usuario_id}</span>
      </div>

      {/* CENTRO: DATOS FORMULARIO */}
      <div className="manage-card-main">
        <div className="manage-row">
          <div className="manage-input-group full">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              value={editedUser.nombre} 
              onChange={e => setEditedUser({...editedUser, nombre: e.target.value})}
            />
          </div>
        </div>

        <div className="manage-row">
          <div className="manage-input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={editedUser.email} 
              onChange={e => setEditedUser({...editedUser, email: e.target.value})}
            />
          </div>
          <div className="manage-input-group">
            <label>Rol</label>
            <select 
              value={editedUser.rol} 
              onChange={e => setEditedUser({...editedUser, rol: e.target.value})}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
              <option value="dev">Dev</option>
            </select>
          </div>
        </div>

        <div className="manage-row">
          <div className="manage-input-group full password-field">
            <label>Nueva Contraseña (Opcional)</label>
            <div className="pass-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Dejar en blanco para no cambiar"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* RELACIONES: PADECIMIENTOS */}
        <div className="user-ailments-section">
          <label>PADECIMIENTOS ASIGNADOS:</label>
          <div className="ailment-chips-container">
            {user.usuario_padecimientos.map(up => (
              <span key={up.padecimiento.padecimiento_id} className="user-ailment-chip">
                {up.padecimiento.nombre}
                <button onClick={() => deleteUsuarioPadecimiento({
                  variables: { usuario_id: user.usuario_id, padecimiento_id: up.padecimiento.padecimiento_id },
                  onCompleted: () => globalRefetch()
                })}>&times;</button>
              </span>
            ))}
            <button className="add-ailment-btn" onClick={() => setIsModalOpen(true)}>+</button>
          </div>
        </div>
      </div>

      {/* DERECHA: ACCIONES */}
      <div className="manage-card-actions">
        <button 
          className="action-btn save-btn" 
          disabled={!hasChanges}
          onClick={handleSave}
        >
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
        <button className="action-btn delete-btn" onClick={handleDelete}>
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      {/* MINI MODAL PARA AGREGAR PADECIMIENTO */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content mini-modal">
            <h3>Asignar Padecimiento</h3>
            <select onChange={(e) => setSelectedAilmentId(e.target.value)}>
              <option value="">Selecciona...</option>
              {availableAilments.map(a => (
                <option key={a.padecimiento_id} value={a.padecimiento_id}>{a.nombre}</option>
              ))}
            </select>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cerrar</button>
              <button className="btn-confirm" onClick={async () => {
                await insertUsuarioPadecimiento({ variables: { usuario_id: user.usuario_id, padecimiento_id: selectedAilmentId }});
                setIsModalOpen(false);
                globalRefetch();
              }}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdminPage;