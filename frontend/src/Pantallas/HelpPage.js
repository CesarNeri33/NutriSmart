import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Componentes/Header';
import './HelpPage.css';

// Estructura de datos para las Preguntas Frecuentes
const faqData = [
    {
        id: 1,
        question: '¿Qué significan los 3 sellos?',
        answer: 'Indican que el producto tiene exceso de tres nutrientes críticos, generalmente azúcares, sodio y grasas saturadas, según la normativa local.',
    },
    {
        id: 2,
        question: 'Cantidad máxima recomendada de Sodio.',
        answer: 'La Organización Mundial de la Salud (OMS) recomienda consumir un máximo de 2.000 mg de sodio (5 gramos de sal) al día para adultos. Es fundamental consultar a un médico si se padece presión arterial alta.',
    },
    {
        id: 3,
        question: 'Cantidad máxima recomendada de Azúcar.',
        answer: 'La OMS sugiere reducir la ingesta de azúcares libres a menos del 10% de la ingesta calórica total, siendo ideal menos del 5% (aproximadamente 25 gramos o 6 cucharaditas al día para un adulto promedio).',
    },
    {
        id: 4,
        question: '¿Cómo leer la Tabla Nutricional?',
        answer: 'Primero fíjate en el tamaño de la porción y la cantidad total de porciones por envase. Luego, revisa los nutrientes clave (grasas, sodio, azúcares añadidos). Finalmente, presta atención al porcentaje de Valor Diario (VD), donde 5% o menos es bajo y 20% o más es alto.',
    },
];

const HelpPage = () => {
    // Estado para manejar qué respuestas están abiertas. 
    // Almacenamos el ID de la pregunta abierta actualmente (o null si ninguna lo está).
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const navigate = useNavigate();

    // Función para alternar la visibilidad de una respuesta
    const handleToggle = (id) => {
        setOpenQuestionId(openQuestionId === id ? null : id);
    };

    const handleGoBack = () => {
        navigate('/inicio'); // Regresa a la página anterior en el historial
    };

    return (
        <div className="help-page-wrapper">
            
            {/* 1. Encabezado Reutilizable */}
            <Header />

            <div className="help-container">
                
                <div className='button-title-wrapper'>
                    <button className="help-back" onClick={handleGoBack}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                    <h2 className="help-title">Preguntas Frecuentes</h2>
                </div>

                {/* 2. Iteración sobre las preguntas */}
                {faqData.map(item => (
                    <div className="help-question-card" key={item.id}>
                        <div className="help-question-header" onClick={() => handleToggle(item.id)}>
                            <span className="help-question-text">{item.question}</span>
                            <button className="help-toggle-btn">
                                {/* Muestra '-' si está abierto, '+' si está cerrado */}
                                {openQuestionId === item.id ? '−' : '+'}
                            </button>
                        </div>
                        
                        {/* 3. Respuesta: Se muestra si el ID coincide con el estado */}
                        <div 
                            className={`help-answer ${openQuestionId === item.id ? 'help-answer-open' : ''}`}
                            // Estilo condicional para la transición suave
                            style={{ 
                                maxHeight: openQuestionId === item.id ? '200px' : '0',
                                opacity: openQuestionId === item.id ? 1 : 0
                            }}
                        >
                            <p>{item.answer}</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default HelpPage;