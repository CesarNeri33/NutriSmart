import React from 'react';
import './AccountPage.css';
import { useNavigate } from 'react-router-dom';
import Title from '../Componentes/Title';
import Logo from '../Componentes/Logo';

const ProfilePage = () => {
    const navigate = useNavigate();

    // Handler de ejemplo para Cambiar Foto
    const handleChangePhoto = () => {
        // Lógica para abrir el selector de archivos o cámara
        console.log("Activando función para cambiar foto...");
    };

    // Handler de ejemplo para Cambiar Perfil (navegar a la edición)
    const handleEditProfile = () => {
        console.log("Navegando a la página de edición de perfil...");
        // navigate('/editar-perfil'); // Ejemplo de navegación
    };

    // Si quieres un botón de "Atrás" en el encabezado
    const handleGoBack = () => {
        navigate(-1);
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
                    <h2>Perfil</h2>
                </div>

                {/* 3. Contenido principal del perfil (avatar y botones) */}
                <div className="contenido-perfil">
                    
                    {/* Avatar (círculo con icono de usuario) */}
                    <div className="avatar-perfil">
                        <i className="fas fa-user-circle avatar-icono"></i>
                    </div>

                    {/* Botones de acción */}
                    <button 
                        className="btn btn-red" 
                        onClick={handleChangePhoto}
                    >
                        Cambiar Foto
                    </button>
                    
                    <button 
                        className="btn btn-green" 
                        onClick={handleEditProfile}
                    >
                        Cambiar Perfil
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;