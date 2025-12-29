-- Nutrismart: Diagrama ER (Mermaid) + Script SQL completo
-- Abre este documento en el panel lateral para ver el diagrama y ejecutar el script.

-- ==========================
-- DIAGRAMA ER (Mermaid)
-- Pega el siguiente bloque en cualquier editor que soporte Mermaid para ver el diagrama:
-- ```mermaid
-- erDiagram
--     USUARIO ||--o{ LISTA_DE_COMPRA : posee
--     USUARIO ||--o{ HISTORIAL_CONSULTA : consulta
--     USUARIO ||--o{ COMPARACION_PRODUCTOS : realiza
--     USUARIO ||--o{ USUARIO_PADECIMIENTO : tiene
--     PADECIMIENTO ||--o{ USUARIO_PADECIMIENTO : relacion
--     PADECIMIENTO ||--o{ REGLA_SALUD : define
--     ALIMENTO ||--o{ COMPOSICION_INGREDIENTES : contiene
--     INGREDIENTE_OCULTO ||--o{ COMPOSICION_INGREDIENTES : es_en
--     LISTA_DE_COMPRA ||--o{ DETALLE_LISTA : contiene
--     ALIMENTO ||--o{ DETALLE_LISTA : aparece_en
--     ALIMENTO ||--o{ HISTORIAL_CONSULTA : aparece_en
--     ALIMENTO ||--o{ COMPARACION_PRODUCTOS : comparado
-- ```

-- ==========================
-- SCRIPT SQL COMPLETO (MySQL compatible)
-- Asegúrate de ejecutar en un esquema vacío o revisar los DROP si tienes datos.

-- DROP previos (útiles para desarrollo)
DROP TABLE IF EXISTS COMPARACION_PRODUCTOS;
DROP TABLE IF EXISTS HISTORIAL_CONSULTA;
DROP TABLE IF EXISTS REGLA_SALUD;
DROP TABLE IF EXISTS USUARIO_PADECIMIENTO;
DROP TABLE IF EXISTS PADECIMIENTO;
DROP TABLE IF EXISTS DETALLE_LISTA;
DROP TABLE IF EXISTS LISTA_DE_COMPRA;
DROP TABLE IF EXISTS COMPOSICION_INGREDIENTES;
DROP TABLE IF EXISTS INGREDIENTE_OCULTO;
DROP TABLE IF EXISTS TIP_EDUCATIVO;
DROP TABLE IF EXISTS ALIMENTO;
DROP TABLE IF EXISTS USUARIO;

-- 1. Tabla USUARIO
CREATE TABLE USUARIO (
    usuario_id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rol VARCHAR(50) NOT NULL DEFAULT 'estandar',
    preferencias JSON NULL,
    PRIMARY KEY (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla PADECIMIENTO (incluye alergias, deficiencias, enfermedades)
CREATE TABLE PADECIMIENTO (
    padecimiento_id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    tipo ENUM('alergia','deficiencia','enfermedad','otra') NOT NULL DEFAULT 'otra',
    descripcion TEXT,
    PRIMARY KEY (padecimiento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla USUARIO_PADECIMIENTO (relaciona usuario con sus condiciones)
CREATE TABLE USUARIO_PADECIMIENTO (
    usuario_id INT NOT NULL,
    padecimiento_id INT NOT NULL,
    detalle VARCHAR(255), -- p.ej. 'leve', 'crónica', 'intolerancia', notas
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, padecimiento_id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (padecimiento_id) REFERENCES PADECIMIENTO(padecimiento_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla ALIMENTO (amplío la original incluyendo codigo_barras y mantengo columnas calculadas)
CREATE TABLE ALIMENTO (
    alimento_id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    codigo_barras VARCHAR(32) NULL UNIQUE,
    categoria VARCHAR(50) NOT NULL,

    -- Cantidades físicas
    cantidad_total DECIMAL(10, 2) NOT NULL, -- contenido neto del empaque
    unidad_medida ENUM('g', 'ml', 'porcion') NOT NULL,

    -- Nutrición por 100g/ml
    energia_kcal_100 DECIMAL(10, 2) NOT NULL,
    azucares_100 DECIMAL(10, 2) NOT NULL,
    sodio_100 DECIMAL(10, 2) NOT NULL,
    grasas_sat_100 DECIMAL(10, 2) NOT NULL,
    grasas_trans_100 DECIMAL(10, 2) NOT NULL,
    proteina_100 DECIMAL(10,2) NULL,
    fibra_100 DECIMAL(10,2) NULL,
    hierro_mg_100 DECIMAL(10,2) NULL,
    vitaminaC_mg_100 DECIMAL(10,2) NULL,

    -- Leyendas manuales
    leyenda_cafeina BOOLEAN NOT NULL DEFAULT FALSE,
    leyenda_edulcorantes BOOLEAN NOT NULL DEFAULT FALSE,

    -- Sellos calculados (MySQL generated columns)
    sello_calorias BOOLEAN AS (
        (unidad_medida = 'g' AND energia_kcal_100 >= 275) OR
        (unidad_medida = 'ml' AND energia_kcal_100 >= 70) OR
        (unidad_medida = 'ml' AND energia_kcal_100 >= 10 AND azucares_100 >= 1)
    ) STORED,

    sello_azucares BOOLEAN AS (
        (azucares_100 * 4) > (energia_kcal_100 * 0.10)
    ) STORED,

    sello_sodio BOOLEAN AS (
        (unidad_medida = 'g' AND sodio_100 >= 350) OR
        (unidad_medida = 'ml' AND sodio_100 >= 45) OR
        (sodio_100 >= energia_kcal_100) -- regla alternativa
    ) STORED,

    sello_grasas_sat BOOLEAN AS (
        (grasas_sat_100 * 9) > (energia_kcal_100 * 0.10)
    ) STORED,

    sello_grasas_trans BOOLEAN AS (
        (grasas_trans_100 * 9) > (energia_kcal_100 * 0.01)
    ) STORED,

    PRIMARY KEY (alimento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabla INGREDIENTE_OCULTO
CREATE TABLE INGREDIENTE_OCULTO (
    ingrediente_id INT NOT NULL AUTO_INCREMENT,
    nombre_oculto VARCHAR(150) NOT NULL UNIQUE,
    tipo_impacto VARCHAR(50) NOT NULL, -- p.ej. 'alergeno','aditivo','altamente_procesado'
    descripcion TEXT,
    PRIMARY KEY (ingrediente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabla COMPOSICION_INGREDIENTES (puente)
CREATE TABLE COMPOSICION_INGREDIENTES (
    alimento_id INT NOT NULL,
    ingrediente_id INT NOT NULL,
    porcentaje DECIMAL(5,2) NULL,
    PRIMARY KEY (alimento_id, ingrediente_id),
    FOREIGN KEY (alimento_id) REFERENCES ALIMENTO(alimento_id) ON DELETE CASCADE,
    FOREIGN KEY (ingrediente_id) REFERENCES INGREDIENTE_OCULTO(ingrediente_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabla LISTA_DE_COMPRA
CREATE TABLE LISTA_DE_COMPRA (
    lista_id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre VARCHAR(100) NOT NULL,
    notas TEXT,
    PRIMARY KEY (lista_id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabla DETALLE_LISTA
CREATE TABLE DETALLE_LISTA (
    lista_id INT NOT NULL,
    alimento_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    comprado BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (lista_id, alimento_id),
    FOREIGN KEY (lista_id) REFERENCES LISTA_DE_COMPRA(lista_id) ON DELETE CASCADE,
    FOREIGN KEY (alimento_id) REFERENCES ALIMENTO(alimento_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Tabla TIP_EDUCATIVO
CREATE TABLE TIP_EDUCATIVO (
    tip_id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    detalle TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tip_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Tabla REGLA_SALUD (mapea padecimiento -> nutriente crítico -> umbral -> mensaje)
CREATE TABLE REGLA_SALUD (
    regla_id INT NOT NULL AUTO_INCREMENT,
    padecimiento_id INT NOT NULL,
    nutriente ENUM('azucares','sodio','grasas_sat','grasas_trans','energia','hierro','vitaminaC') NOT NULL,
    operador ENUM('>','>=','<','<=') NOT NULL DEFAULT '>',
    valor_limite DECIMAL(10,2) NOT NULL,
    unidad_evaluacion ENUM('por_100','por_porcion','absoluto') NOT NULL DEFAULT 'por_100',
    prioridad SMALLINT NOT NULL DEFAULT 10,
    mensaje_sugerencia VARCHAR(255) NOT NULL,
    PRIMARY KEY (regla_id),
    FOREIGN KEY (padecimiento_id) REFERENCES PADECIMIENTO(padecimiento_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Tabla HISTORIAL_CONSULTA
CREATE TABLE HISTORIAL_CONSULTA (
    historial_id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    alimento_id INT NOT NULL,
    origen ENUM('buscador','codigo_barras','lista','comparacion') NOT NULL DEFAULT 'buscador',
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (historial_id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (alimento_id) REFERENCES ALIMENTO(alimento_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Tabla COMPARACION_PRODUCTOS
CREATE TABLE COMPARACION_PRODUCTOS (
    comparacion_id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    alimento_a INT NOT NULL,
    alimento_b INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    PRIMARY KEY (comparacion_id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (alimento_a) REFERENCES ALIMENTO(alimento_id) ON DELETE RESTRICT,
    FOREIGN KEY (alimento_b) REFERENCES ALIMENTO(alimento_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Índices recomendados para búsquedas frecuentes
CREATE INDEX idx_alimento_nombre ON ALIMENTO (nombre);
CREATE INDEX idx_alimento_codigo ON ALIMENTO (codigo_barras);
CREATE INDEX idx_alimento_categoria ON ALIMENTO (categoria);
CREATE INDEX idx_historial_usuario ON HISTORIAL_CONSULTA (usuario_id);

-- ==========================
-- NOTAS DE IMPLEMENTACIÓN
-- * REGLA_SALUD permite al backend evaluar automáticamente si un ALIMENTO es
--   "recomendado" o "no recomendado" para un usuario con X padecimiento.
-- * USUARIO.preferencias (JSON) puede almacenar opciones UI y umbrales personales
--   (p.ej. objetivo_sodio: 200 mg/día).
-- * Para el escaneo de códigos de barras, indexa codigo_barras y busca por ese campo.
-- * Las columnas generadas en ALIMENTO (sello_*) usan lógica básica; adapta según normas
--   oficiales y fases de NOM-051 si necesitas mayor precisión.
-- * Para rendimiento en producción, considera campos denormalizados o materialized views
--   que pre-calculen recomendaciones por alimento.

-- ==========================
-- FIN DEL SCRIPT
