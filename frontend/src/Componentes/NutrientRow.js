import React from 'react';
import './NutrientRow.css';

const NutrientRow = ({ label, value, unit, evaluation }) => {
  const levelClass = evaluation?.critical
    ? evaluation.level
    : 'info';

  return (
    <div className={`nutrient-row ${levelClass}`}>
      <span className="nutrient-label">{label}</span>
      <span className="nutrient-value">
        {value} {unit}
      </span>
    </div>
  );
};

export default NutrientRow;