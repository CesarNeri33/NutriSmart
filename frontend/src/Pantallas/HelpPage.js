//src/Pantallas/HelpPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from '../Componentes/Header';
import HelpCard from '../Componentes/HelpCard';
import { GET_HELP } from '../graphql/query';

import './HelpPage.css';

const HelpPage = () => {
    const [openHelpId, setOpenHelpId] = useState(null);
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_HELP);

    const handleToggle = (id) => {
        setOpenHelpId(openHelpId === id ? null : id);
    };

    const handleGoBack = () => {
        navigate('/inicio');
    };

    if (loading) {
        return <p style={{ textAlign: 'center' }}>Cargando ayuda...</p>;
    }

    if (error) {
        return <p style={{ textAlign: 'center' }}>Error al cargar la información</p>;
    }

    return (
        <div className="help-page-wrapper">
            <Header />

            <div className="help-container">
                <div className="button-title-wrapper">
                    <button className="help-back" onClick={handleGoBack}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h2 className="help-title">INFORMACIÓN DE AYUDA</h2>
                </div>

                {data.ayuda.map((item) => (
                    <HelpCard
                        key={item.ayuda_id}
                        title={item.titulo}
                        content={item.descripcion}
                        type={item.tipo}
                        isOpen={openHelpId === item.ayuda_id}
                        onToggle={() => handleToggle(item.ayuda_id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HelpPage;