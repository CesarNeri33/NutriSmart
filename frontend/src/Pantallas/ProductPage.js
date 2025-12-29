// src/Pantallas/ProductPage.js
import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from '../Componentes/Header';
import { GET_PRODUCTO_BY_ID } from '../graphql/products';
import { evaluateProduct } from '../rules/nutritionRules';
import NutrientRow from '../Componentes/NutrientRow';

import { GET_HELP_WITH_NUTRIENTS, GET_USUARIO_PADECIMIENTOS, GET_PADECIMIENTO_NUTRIENTES } from '../graphql/helpQueries';

import { buildHelpContext } from '../rules/helpContextBuilder';
import { resolveHelps } from '../rules/helpResolver';

import HelpCard from '../Componentes/HelpCard';

import './ProductPage.css';

const NUTRIENTS_ORDER = [
  'azucares_g',
  'sodio_mg',
  'grasas_saturadas_g',

  'energia_kcal',
  'proteinas_g',
  'grasas_totales_g',
  'carbohidratos_g',
];

const NUTRIENT_META = {
  azucares_g: { label: 'Azúcares', unit: 'g' },
  sodio_mg: { label: 'Sodio', unit: 'mg' },
  grasas_saturadas_g: { label: 'Grasas sat.', unit: 'g' },

  energia_kcal: { label: 'Energía', unit: 'kcal' },
  proteinas_g: { label: 'Proteínas', unit: 'g' },
  grasas_totales_g: { label: 'Grasas tot.', unit: 'g' },
  carbohidratos_g: { label: 'Carbohidratos', unit: 'g' },
};

const ProductPage = () => {
  const [openHelpId, setOpenHelpId] = useState(null);
  const { data: helpData, loading: helpLoading } = useQuery(GET_HELP_WITH_NUTRIENTS);

  const { data: padecimientoNutrienteData } = useQuery(
    GET_PADECIMIENTO_NUTRIENTES
  );

  // ProductPage.js
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const usuarioId = usuario?.usuario_id;

  const { data: usuarioPadecimientosData } = useQuery(
    GET_USUARIO_PADECIMIENTOS,
    {
      variables: usuarioId ? { usuario_id: usuarioId } : undefined,
      skip: !usuarioId
    }
  );

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_PRODUCTO_BY_ID, {
    variables: { id: Number(id) },
  });

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>Error al cargar el producto</p>;

  const producto = data.producto_by_pk;
  if (!producto) return <p>Producto no encontrado</p>;

  const evaluation = evaluateProduct(producto);

let ayudasFinales = [];

//console.log('HELP DATA RAW:', helpData);
//console.log('PADECIMIENTO NUTRIENTE DATA RAW:', padecimientoNutrienteData);
//console.log('USUARIO PADECIMIENTOS DATA RAW:', usuarioPadecimientosData);

if (!helpLoading && padecimientoNutrienteData && usuarioPadecimientosData) {
  const context = buildHelpContext({
    ayudasData: helpData,
    padecimientoNutrienteData,
    usuarioPadecimientosData,
  });

  ayudasFinales = resolveHelps({
    productEvaluation: evaluation,
    ...context,
  });
}

//console.log('AYUDAS FINALES:', ayudasFinales);
  
  return (
    <div className="product-page-container">
      <Header />

      {/* Tarjeta tipo cupón */}
      <div className="product-coupon-card">

        {/* Imagen */}
        <div className="coupon-image">
            {/* Flecha */}
            <button className="back-button" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            {producto.foto_producto ? (
                <img src={producto.foto_producto} alt={producto.nombre} />
            ) : (
                <i className="fa-solid fa-bottle-water icono-producto"></i>
            )}
        </div>

        {/* Contenido */}
        <div className="coupon-content">
          <h2 className="product-name">{producto.nombre}</h2>
          <p className="product-quantity">
            {producto.cantidad_envase}
            {producto.unidad_envase}
          </p>

          {/* Tabla nutrimental */}
          <div className="nutrient-table">
            {NUTRIENTS_ORDER.map((key) => {
              const meta = NUTRIENT_META[key];
              if (!meta) return null;

              return (
                <NutrientRow
                  key={key}
                  label={meta.label}
                  value={producto[key]}
                  unit={meta.unit}
                  evaluation={evaluation[key]}
                />
              );
            })}
          </div>
        </div>

      </div>
      {ayudasFinales.length > 0 && (
  <div className="help-section">
    <h3>Recomendaciones</h3>

    {ayudasFinales.map((ayuda) => (
      <HelpCard
        key={ayuda.ayuda_id}
        title={ayuda.titulo}
        content={ayuda.descripcion}
        type={ayuda.tipo}
        isOpen={openHelpId === ayuda.ayuda_id}
        onToggle={() =>
          setOpenHelpId(
            openHelpId === ayuda.ayuda_id ? null : ayuda.ayuda_id
          )
        }
      />
    ))}
  </div>
)}
    </div>
  );
};

export default ProductPage;
