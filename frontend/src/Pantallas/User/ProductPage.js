// src/Pantallas/User/ProductPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from '../../Componentes/Header';
import { GET_PRODUCTO_BY_ID } from '../../graphql/products';
import { evaluateProduct } from '../../rules/nutritionRules';
import NutrientRow from '../../Componentes/NutrientRow';
import { GET_HELP_WITH_NUTRIENTS, GET_USUARIO_PADECIMIENTOS, GET_PADECIMIENTO_NUTRIENTES } from '../../graphql/helpQueries';
import { buildHelpContext } from '../../rules/helpContextBuilder';
import { resolveHelps } from '../../rules/helpResolver';
import HelpCard from '../../Componentes/HelpCard';

import './ProductPage.css';

const NUTRIENTS_ORDER = ['azucares_g', 'sodio_mg', 'grasas_saturadas_g', 'energia_kcal', 'proteinas_g', 'grasas_totales_g', 'carbohidratos_g'];

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
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const usuarioId = usuario?.usuario_id;

  // Queries
  const { data: helpData, loading: helpLoading } = useQuery(GET_HELP_WITH_NUTRIENTS);
  const { data: padecimientoNutrienteData } = useQuery(GET_PADECIMIENTO_NUTRIENTES);
  const { data: usuarioPadecimientosData } = useQuery(GET_USUARIO_PADECIMIENTOS, {
    variables: usuarioId ? { usuario_id: usuarioId } : undefined,
    skip: !usuarioId
  });
  const { data, loading, error } = useQuery(GET_PRODUCTO_BY_ID, {
    variables: { id: Number(id) },
  });

  if (loading || helpLoading) return <p>Cargando información...</p>;
  if (error || !data?.producto_by_pk) return <p>Error al cargar el producto</p>;

  const producto = data.producto_by_pk;
  const evaluation = evaluateProduct(producto);
  const SERVER_URL = 'http://191.96.31.39:4000';
  const fotoUrl = producto.foto_producto?.startsWith('/upload') 
    ? `${SERVER_URL}${producto.foto_producto}` 
    : producto.foto_producto;

  // Lógica de Ayudas
  let criticalAlerts = [];
  let recommendations = [];

  if (padecimientoNutrienteData && usuarioPadecimientosData) {
    const context = buildHelpContext({
      ayudasData: helpData,
      padecimientoNutrienteData,
      usuarioPadecimientosData,
    });

    // Llamada al resolver corregido
    const result = resolveHelps({
      productEvaluation: evaluation,
      ...context,
    });
    criticalAlerts = result.criticalAlerts;
    recommendations = result.recommendations;
  }

  return (
    <div className="product-page-container">
      <Header />

      <div className="product-coupon-card">
        <div className="coupon-image">
          <button className="back-button" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          {producto.foto_producto ? (
            <img src={fotoUrl} alt={producto.nombre} />
          ) : (
            <i className="fa-solid fa-bottle-water icono-producto"></i>
          )}
        </div>

        <div className="coupon-content">
          <h2 className="product-name">{producto.nombre}</h2>

          {/* ADVERTENCIA VISUAL (Banner Rojo) */}
          {criticalAlerts.length > 0 && (
            <div className="health-warning-banner">
              <div className="warning-header">
                <i className="fa-solid fa-triangle-exclamation fa-lg"></i>
                <span>Advertencia de Salud</span>
              </div>
              {criticalAlerts.map(alert => (
                <p key={alert.ayuda_id} className="warning-text">
                  {alert.descripcion}
                </p>
              ))}
            </div>
          )}

          <p className="product-quantity">{producto.cantidad_envase} {producto.unidad_envase}</p>

          <div className="nutrient-table">
            {NUTRIENTS_ORDER.map((key) => (
              <NutrientRow
                key={key}
                label={NUTRIENT_META[key].label}
                value={producto[key]}
                unit={NUTRIENT_META[key].unit}
                evaluation={evaluation[key]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RECOMENDACIONES (Tarjetas colapsables) */}
      {recommendations.length > 0 && (
        <div className="help-section">
          <h3>Sugerencias Nutricionales</h3>
          {recommendations.map((ayuda) => (
            <HelpCard
              key={ayuda.ayuda_id}
              title={ayuda.titulo}
              content={ayuda.descripcion}
              type={ayuda.tipo}
              isOpen={openHelpId === ayuda.ayuda_id}
              onToggle={() => setOpenHelpId(openHelpId === ayuda.ayuda_id ? null : ayuda.ayuda_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;