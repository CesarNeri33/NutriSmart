//src/pantallas/AccountPage.js
import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import { useNavigate } from 'react-router-dom';
import Title from '../../Componentes/Title';
import Logo from '../../Componentes/Logo';
import ModalCard from '../../Componentes/ModalCard';
import { useMutation } from '@apollo/client';
import { UPDATE_FOTO_PERFIL, UPDATE_USUARIO } from '../../graphql/mutations';

const ProfilePage = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    password: '',
    });

    const navigate = useNavigate();
    const [updateFotoPerfil] = useMutation(UPDATE_FOTO_PERFIL);
    const [updateUsuario, { loading }] = useMutation(UPDATE_USUARIO);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formError, setFormError] = useState('');

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

    // Handler para validar la sesion iniciada
    useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        console.log('⛔ Sin sesión en pagina de inicio, redirigiendo...');
        navigate('/iniciar-sesion');
    }
    }, [navigate]);

    useEffect(() => {
    const onKey = (e) => {
        if (e.key === 'Escape') setIsEditOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Handler para Cambiar Foto
    const handleChangePhoto = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
        const newPhotoPath = await uploadImage(file);
        const res = await updateFotoPerfil({
            variables: {
            usuario_id: usuario.usuario_id,
            foto_perfil: newPhotoPath,
            },
        });
        // 🔄 Actualizar localStorage
        const updatedUser = {
            ...usuario,
            foto_perfil: res.data.update_usuario_by_pk.foto_perfil,
        };
        localStorage.setItem('usuario', JSON.stringify(updatedUser));
        // 🔁 Forzar re-render
        window.location.reload();
        } catch (error) {
        console.error('Error al cambiar foto:', error);
        }
    };
    input.click();
    };

    // Handler para Cambiar Perfil
    const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFormError('');

    // 🚫 Validación simple
    if (!formData.password || formData.password.trim() === '') {
        setFormError(
        'Este campo no puede estar vacío. Ingresa tu contraseña actual o una nueva.'
        );
        return;
    }

    try {
        const res = await updateUsuario({
        variables: {
            usuario_id: usuario.usuario_id,
            nombre: formData.nombre,
            email: formData.email,
            password_hash: formData.password, // 🔐 siempre viene llena
        },
        });

        const updatedUser = res.data.update_usuario_by_pk;

        // 🔄 Actualizar localStorage (sin password)
        localStorage.setItem(
        'usuario',
        JSON.stringify({
            ...usuario,
            nombre: updatedUser.nombre,
            email: updatedUser.email,
        })
        );

        // 🧼 Limpiar estado
        setFormData((prev) => ({
        ...prev,
        password: '',
        }));

        setIsEditOpen(false);
    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        setFormError('Ocurrió un error al guardar los cambios');
    }
    };

    return (
        // El contenedor principal para centrar el perfil
        <div className="profile-page-container">
            <div className="containerAccount">
                {/* 1. Encabezado principal con el logo y el texto */}
                <header className="header">
                    <Logo />
                    <Title />
                </header>
                {/* 2. Título de la sección */}
                <div className="profile-header">
                    <button className="back-button" onClick={() => navigate(-1)} title="Regresar">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h2>Perfil</h2>
                </div>
                {/* 3. Contenido principal del perfil (avatar y botones) */}
                <div className="contenido-perfil">
                    {/* Avatar (círculo con icono de usuario) */}
                    <div className="avatar-perfil">
                        {usuario.foto_perfil ? (
                            <img
                                src={`http://191.96.31.39:4000${usuario.foto_perfil}`}
                                alt="Foto de perfil"
                                width="110"
                                height="110"
                                className="avatar-imagen"
                            />
                            ) : (
                            <i className="fas fa-user-circle avatar-icono"></i>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <button className="btn btn-red" onClick={handleChangePhoto}>
                        Cambiar Foto
                    </button>
                    <button className="btn btn-green" onClick={() => setIsEditOpen(true)}>
                        Editar Perfil
                    </button>
                </div>
            </div>
            <ModalCard
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            >
            <h3>Editar perfil</h3>
            <form className="form" onSubmit={handleUpdateProfile}>
            <label>Nombre</label>
            <input type="text" value={formData.nombre} onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })}
                required
            />

            <label>Email</label>
            <input type="email" value={formData.email} onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })}
                required
            />

            <label>Nueva contraseña</label>
            <input
            type="password"
            placeholder="Contraseña obligatoria"
            value={formData.password}
            onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
            }
            />
            {formError && (<p className="error-text">{formError}</p>)}
            <div className="modal-actions">
                <button type="button" className="btn btn-red" onClick={() => setIsEditOpen(false)}>
                Cancelar
                </button>
                <button type="submit" className="btn btn-green" disabled={loading} >
                {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
            </form>
            </ModalCard>
        </div>
    );
};

export default ProfilePage;