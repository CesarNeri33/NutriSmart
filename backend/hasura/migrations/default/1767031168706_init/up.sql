SET check_function_bodies = false;
CREATE TYPE public.nutriente_tipo AS ENUM (
    'azucares',
    'sodio',
    'grasas_sat',
    'grasas_trans',
    'energia',
    'hierro',
    'vitaminaC'
);
CREATE TYPE public.operador_tipo AS ENUM (
    '>',
    '>=',
    '<',
    '<='
);
CREATE TYPE public.origen_consulta AS ENUM (
    'buscador',
    'codigo_barras',
    'lista',
    'comparacion'
);
CREATE TYPE public.rol_usuario AS ENUM (
    'estandar',
    'admin'
);
CREATE TYPE public.tipo_padecimiento AS ENUM (
    'alergia',
    'deficiencia',
    'enfermedad',
    'otra'
);
CREATE TYPE public.unidad_eval AS ENUM (
    'por_100',
    'por_porcion',
    'absoluto'
);
CREATE FUNCTION public.generar_foto_producto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.foto_producto :=
    '/products/' ||
    REGEXP_REPLACE(
      LOWER(
        TRANSLATE(
          NEW.nombre,
          'ÁÉÍÓÚáéíóúÑñ',
          'AEIOUaeiouNn'
        )
      ),
      '[^a-z0-9]+',
      '_',
      'g'
    ) || '.png';
  RETURN NEW;
END;
$$;
CREATE TABLE public.ayuda (
    ayuda_id integer NOT NULL,
    titulo text NOT NULL,
    descripcion text NOT NULL,
    tipo text NOT NULL,
    activo boolean DEFAULT true,
    CONSTRAINT ayuda_tipo_check CHECK ((tipo = ANY (ARRAY['GENERAL'::text, 'NUTRIENTE'::text, 'PADECIMIENTO'::text])))
);
CREATE SEQUENCE public.ayuda_ayuda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.ayuda_ayuda_id_seq OWNED BY public.ayuda.ayuda_id;
CREATE TABLE public.ayuda_nutriente (
    ayuda_id integer NOT NULL,
    nutriente_id integer NOT NULL
);
CREATE TABLE public.lista_compra (
    lista_id integer NOT NULL,
    usuario_id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.lista_compra_lista_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.lista_compra_lista_id_seq OWNED BY public.lista_compra.lista_id;
CREATE TABLE public.lista_producto (
    id integer NOT NULL,
    lista_id integer NOT NULL,
    producto_id integer NOT NULL,
    comprado boolean DEFAULT false NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL
);
CREATE SEQUENCE public.lista_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.lista_producto_id_seq OWNED BY public.lista_producto.id;
CREATE TABLE public.nutriente (
    nutriente_id integer NOT NULL,
    codigo text NOT NULL,
    nombre text NOT NULL,
    unidad text NOT NULL
);
CREATE SEQUENCE public.nutriente_nutriente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.nutriente_nutriente_id_seq OWNED BY public.nutriente.nutriente_id;
CREATE TABLE public.padecimiento (
    padecimiento_id integer NOT NULL,
    nombre text NOT NULL,
    descripcion character varying(500)
);
CREATE TABLE public.padecimiento_nutriente (
    padecimiento_id integer NOT NULL,
    nutriente_id integer NOT NULL
);
CREATE SEQUENCE public.padecimiento_padecimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.padecimiento_padecimiento_id_seq OWNED BY public.padecimiento.padecimiento_id;
CREATE TABLE public.producto (
    producto_id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    cantidad_envase numeric(10,2) NOT NULL,
    unidad_envase character varying(2) NOT NULL,
    energia_kcal numeric(10,2) NOT NULL,
    proteinas_g numeric(10,2) NOT NULL,
    grasas_totales_g numeric(10,2) NOT NULL,
    grasas_saturadas_g numeric(10,2) NOT NULL,
    carbohidratos_g numeric(10,2) NOT NULL,
    azucares_g numeric(10,2) NOT NULL,
    sodio_mg numeric(10,2) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    foto_producto character varying(255),
    CONSTRAINT producto_unidad_envase_check CHECK (((unidad_envase)::text = ANY ((ARRAY['g'::character varying, 'ml'::character varying])::text[])))
);
CREATE SEQUENCE public.producto_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.producto_producto_id_seq OWNED BY public.producto.producto_id;
CREATE TABLE public.usuario (
    usuario_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    foto_perfil text,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    rol text DEFAULT 'usuario'::text NOT NULL
);
CREATE TABLE public.usuario_padecimiento (
    usuario_id integer NOT NULL,
    padecimiento_id integer NOT NULL
);
CREATE SEQUENCE public.usuario_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.usuario_usuario_id_seq OWNED BY public.usuario.usuario_id;
ALTER TABLE ONLY public.ayuda ALTER COLUMN ayuda_id SET DEFAULT nextval('public.ayuda_ayuda_id_seq'::regclass);
ALTER TABLE ONLY public.lista_compra ALTER COLUMN lista_id SET DEFAULT nextval('public.lista_compra_lista_id_seq'::regclass);
ALTER TABLE ONLY public.lista_producto ALTER COLUMN id SET DEFAULT nextval('public.lista_producto_id_seq'::regclass);
ALTER TABLE ONLY public.nutriente ALTER COLUMN nutriente_id SET DEFAULT nextval('public.nutriente_nutriente_id_seq'::regclass);
ALTER TABLE ONLY public.padecimiento ALTER COLUMN padecimiento_id SET DEFAULT nextval('public.padecimiento_padecimiento_id_seq'::regclass);
ALTER TABLE ONLY public.producto ALTER COLUMN producto_id SET DEFAULT nextval('public.producto_producto_id_seq'::regclass);
ALTER TABLE ONLY public.usuario ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuario_usuario_id_seq'::regclass);
ALTER TABLE ONLY public.ayuda_nutriente
    ADD CONSTRAINT ayuda_nutriente_pkey PRIMARY KEY (ayuda_id, nutriente_id);
ALTER TABLE ONLY public.ayuda
    ADD CONSTRAINT ayuda_pkey PRIMARY KEY (ayuda_id);
ALTER TABLE ONLY public.lista_compra
    ADD CONSTRAINT lista_compra_pkey PRIMARY KEY (lista_id);
ALTER TABLE ONLY public.lista_producto
    ADD CONSTRAINT lista_producto_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.nutriente
    ADD CONSTRAINT nutriente_codigo_key UNIQUE (codigo);
ALTER TABLE ONLY public.nutriente
    ADD CONSTRAINT nutriente_pkey PRIMARY KEY (nutriente_id);
ALTER TABLE ONLY public.padecimiento
    ADD CONSTRAINT padecimiento_nombre_key UNIQUE (nombre);
ALTER TABLE ONLY public.padecimiento_nutriente
    ADD CONSTRAINT padecimiento_nutriente_pkey PRIMARY KEY (padecimiento_id, nutriente_id);
ALTER TABLE ONLY public.padecimiento
    ADD CONSTRAINT padecimiento_pkey PRIMARY KEY (padecimiento_id);
ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (producto_id);
ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);
ALTER TABLE ONLY public.usuario_padecimiento
    ADD CONSTRAINT usuario_padecimiento_pkey PRIMARY KEY (usuario_id, padecimiento_id);
ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (usuario_id);
CREATE TRIGGER trg_generar_foto_producto BEFORE INSERT ON public.producto FOR EACH ROW EXECUTE FUNCTION public.generar_foto_producto();
ALTER TABLE ONLY public.ayuda_nutriente
    ADD CONSTRAINT ayuda_nutriente_ayuda_id_fkey FOREIGN KEY (ayuda_id) REFERENCES public.ayuda(ayuda_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.ayuda_nutriente
    ADD CONSTRAINT ayuda_nutriente_nutriente_id_fkey FOREIGN KEY (nutriente_id) REFERENCES public.nutriente(nutriente_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lista_compra
    ADD CONSTRAINT fk_lista_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lista_producto
    ADD CONSTRAINT fk_lp_lista FOREIGN KEY (lista_id) REFERENCES public.lista_compra(lista_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lista_producto
    ADD CONSTRAINT fk_lp_producto FOREIGN KEY (producto_id) REFERENCES public.producto(producto_id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.usuario_padecimiento
    ADD CONSTRAINT fk_padecimiento FOREIGN KEY (padecimiento_id) REFERENCES public.padecimiento(padecimiento_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.usuario_padecimiento
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.padecimiento_nutriente
    ADD CONSTRAINT padecimiento_nutriente_nutriente_id_fkey FOREIGN KEY (nutriente_id) REFERENCES public.nutriente(nutriente_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.padecimiento_nutriente
    ADD CONSTRAINT padecimiento_nutriente_padecimiento_id_fkey FOREIGN KEY (padecimiento_id) REFERENCES public.padecimiento(padecimiento_id) ON DELETE CASCADE;
