// src/screens/WelcomePage.js

import React from 'react';
import { Link } from 'react-router-dom'; // ⬅️ Usamos Link para navegar
import Title from '../Componentes/Title'; // ⬅️ Importamos el sub-componente
import Logo from '../Componentes/Logo';
import './WelcomePage.css'; // ⬅️ Importamos el archivo de estilos

const WelcomePage = () => {
    return (
        <div className="container">

            {/* 1. Insertamos el componente reutilizable */}
            <Logo />
            <Title />

            {/* 2. Sección de contenido */}
            <div className="content">
                <div className="left">
                    <h2>¿Quiénes Somos?</h2>
                    <p>
                        NutriSmart es una página web que busca mejorar la forma en que los consumidores
                        interpretan la información nutrimental de los alimentos envasados, su diseño se centra
                        en tres pilares principales: educación nutricional, accesibilidad tecnológica y
                        personalización del consumo alimenticio.
                    </p>
                </div>
                <div className="right">
                    <h2>Propósito.</h2>
                    <p>
                        La página web permite buscar productos para mostrar su información nutrimental
                        de forma clara, destacando azúcares, sodio y grasas saturadas en comparación con los
                        valores recomendados. Además, incluye advertencias basadas en la NOM-051 y ofrece
                        recomendaciones personalizadas según condiciones de salud como hipertensión,
                        deficiencia de hierro o alergias.
                    </p>
                </div>
            </div>

            {/* 3. Sección de botones con React Router Link */}
            <div className="WelcomeBotones">
                {/* ⬅️ Reemplazamos <button> por <Link> y la ruta 'href' por 'to' */}
                <Link to="/iniciar-sesion" className="login">Iniciar Sesión</Link>
                <Link to="/registro" className="registrar">Registrarse</Link>
            </div>

        </div>
    );
};

export default WelcomePage;