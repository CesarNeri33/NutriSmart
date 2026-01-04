// src/Pantallas/User/BarCodeScanner.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from '../../Componentes/Header';
import RecentItem from '../../Componentes/RecentItem';
import { GET_PRODUCTOS_BARCODE } from '../../graphql/products';
import { evaluateProduct } from '../../rules/nutritionRules';
import { mapProductToSemaforo, mapProductValues } from '../../rules/mapToSemaforo';

import './BarCodeScanner.css';

const BarcodeScanner = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState('');
  const scannerRef = useRef(null);

  const { data, loading } = useQuery(GET_PRODUCTOS_BARCODE);
  const productos = data?.producto ?? [];

  const matchedProduct = useMemo(() => {
    if (!scanResult || loading) return null;
    return productos.find(p => p.codigo_barra === scanResult);
  }, [scanResult, productos, loading]);

  // --- NUEVA FUNCIÓN PARA VOLVER SEGURO ---
  const handleGoBack = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.warn("Error al apagar la cámara antes de volver:", err);
      }
    }
    navigate(-1);
  };

  useEffect(() => {
    const readerElement = document.getElementById('nutri-scanner-reader');
    if (readerElement) {
      readerElement.innerHTML = ''; 
      const html5QrCode = new Html5Qrcode("nutri-scanner-reader");
      scannerRef.current = html5QrCode;

      const config = { 
        fps: 20, 
        qrbox: { width: 280, height: 120 },
        aspectRatio: 1.333333 
      };

      const startScanner = async () => {
        try {
          if (html5QrCode.getState() === Html5QrcodeScannerState.NOT_STARTED) {
            await html5QrCode.start(
              { facingMode: "environment" },
              config,
              (decodedText) => {
                setScanResult(decodedText);
                if (navigator.vibrate) navigator.vibrate(100);
              },
              () => { /* Buscando... */ }
            );
          }
        } catch (err) { console.error("Error al iniciar:", err); }
      };
      startScanner();
    }

    // Cleanup de seguridad (por si el usuario usa el botón 'atrás' del navegador)
    return () => {
      if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="nutri-scan-page">
      <Header />
      
      <div className="nutri-scan-body">
        <div className="nutri-scan-header">
           {/* Botón actualizado con el nuevo método */}
           <button className="nutri-back-btn" onClick={handleGoBack}>
             <i className="fa-solid fa-chevron-left"></i> Volver
           </button>
           <h2 className="nutri-scan-title">Escáner NutriSmart</h2>
        </div>

        <div className="nutri-camera-view">
          <div id="nutri-scanner-reader"></div>
        </div>

        {!scanResult && (
           <p className="nutri-scan-hint">Apunta al código de barras del producto</p>
        )}

        {(matchedProduct || (scanResult && !matchedProduct)) && (
          <div className={`nutri-status-bar ${matchedProduct ? 'nutri-success' : 'nutri-error'}`}>
            <div className="nutri-bar-handle" onClick={() => setScanResult('')}></div>
            
            {matchedProduct ? (
              <div className="nutri-result-content">
                <div className="nutri-match-header">
                   <i className="fa-solid fa-circle-check"></i>
                   <span>¡Producto Encontrado!</span>
                </div>
                {(() => {
                  const evaluation = evaluateProduct(matchedProduct);
                  const niveles = mapProductToSemaforo(evaluation);
                  const valores = mapProductValues(matchedProduct);
                  return (
                    <RecentItem
                      key={matchedProduct.producto_id}
                      id={matchedProduct.producto_id}
                      nombre={matchedProduct.nombre}
                      cantidad={matchedProduct.cantidad_envase}
                      medida={matchedProduct.unidad_envase}
                      imagen={matchedProduct.foto_producto}
                      niveles={niveles}
                      valores={valores}
                      onSelect={() => navigate(`/producto/${matchedProduct.producto_id}`)}
                    />
                  );
                })()}
              </div>
            ) : (
              <div className="nutri-result-content nutri-error-content">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p>El código <strong>{scanResult}</strong> no está en nuestro sistema.</p>
                <button className="nutri-retry-btn" onClick={() => setScanResult('')}>Intentar de nuevo</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;