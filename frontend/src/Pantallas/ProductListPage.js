import React, { useState } from 'react';
// Importando las bibliotecas de iconos externas
// Importando el archivo CSS tradicional
import './ProductListPage.css';
import Header from '../Componentes/Header';

// Datos iniciales de la lista de productos
const initialProducts = [
    { id: 1, name: 'Tomates cherry (250g)', purchased: false },
    { id: 2, name: 'Pechuga de pollo (1kg)', purchased: true },
    { id: 3, name: 'Pasta integral (500g)', purchased: false },
    { id: 4, name: 'Queso panela', purchased: false },
    { id: 5, name: 'Aguacate (3 piezas)', purchased: true },
];

const ProductListPage = () => {
    // Estado para la lista de productos
    const [products, setProducts] = useState(initialProducts);
    const listTitle = "Lista 1"; 

    // Manejador para eliminar un producto
    const handleDeleteProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
        console.log(`Producto con ID ${id} eliminado.`);
    };

    // Manejador para marcar/desmarcar un producto como comprado
    const handleTogglePurchase = (id) => {
        setProducts(products.map(product => 
            product.id === id ? { ...product, purchased: !product.purchased } : product
        ));
    };

    return (
        // Contenedor principal
        <div className="product-page-wrapper">
            <Header />

            {/* Título de la Lista */}
            <div className="titulo_lista">
                {listTitle}
            </div>

            {/* Lista de Productos */}
            <div className="lista_productos">
                {products.length === 0 ? (
                    <p className="text-center text-gray-600 mt-10 text-lg">
                        ¡Tu lista de compras está vacía!
                    </p>
                ) : (
                    products.map((product) => (
                        <div 
                            key={product.id} 
                            // Clase condicional para marcar como comprado
                            className={`item ${product.purchased ? 'item-purchased' : ''}`}
                            onClick={() => handleTogglePurchase(product.id)}
                            >
                            {/* Nombre del Producto */}
                            <span>
                                {product.name}
                            </span>
                            
                            {/* Botón de Borrar */}
                            <button 
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita que se active el togglePurchase del div padre
                                    handleDeleteProduct(product.id);
                                }}
                                title="Eliminar producto"
                                >   
                                <i className="fa-solid fa-trash" onClick={handleDeleteProduct} title="Eliminar lista"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Botón de acción para añadir */}
            <div className="add-btn-wrapper">
                <button className="add-btn">
                    + Añadir Nuevo Producto
                </button>
            </div>
        </div>
    );
};

export default ProductListPage;