--
-- PostgreSQL database dump
--

\restrict pHp9zZ6WBectNJDmaSxeVT0u9pXtVK9X05oFydSceqd3tZjrozfcRRHQGiQrYOt

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: nutriente_tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.nutriente_tipo AS ENUM (
    'azucares',
    'sodio',
    'grasas_sat',
    'grasas_trans',
    'energia',
    'hierro',
    'vitaminaC'
);


ALTER TYPE public.nutriente_tipo OWNER TO postgres;

--
-- Name: operador_tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.operador_tipo AS ENUM (
    '>',
    '>=',
    '<',
    '<='
);


ALTER TYPE public.operador_tipo OWNER TO postgres;

--
-- Name: origen_consulta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.origen_consulta AS ENUM (
    'buscador',
    'codigo_barras',
    'lista',
    'comparacion'
);


ALTER TYPE public.origen_consulta OWNER TO postgres;

--
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rol_usuario AS ENUM (
    'estandar',
    'admin'
);


ALTER TYPE public.rol_usuario OWNER TO postgres;

--
-- Name: tipo_padecimiento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_padecimiento AS ENUM (
    'alergia',
    'deficiencia',
    'enfermedad',
    'otra'
);


ALTER TYPE public.tipo_padecimiento OWNER TO postgres;

--
-- Name: unidad_eval; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.unidad_eval AS ENUM (
    'por_100',
    'por_porcion',
    'absoluto'
);


ALTER TYPE public.unidad_eval OWNER TO postgres;

--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO postgres;

--
-- Name: generar_foto_producto(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.generar_foto_producto() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


ALTER TABLE hdb_catalog.hdb_metadata OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


ALTER TABLE hdb_catalog.hdb_schema_notifications OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    ee_client_id text,
    ee_client_secret text
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: ayuda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ayuda (
    ayuda_id integer NOT NULL,
    titulo text NOT NULL,
    descripcion text NOT NULL,
    tipo text NOT NULL,
    activo boolean DEFAULT true,
    CONSTRAINT ayuda_tipo_check CHECK ((tipo = ANY (ARRAY['GENERAL'::text, 'NUTRIENTE'::text, 'PADECIMIENTO'::text])))
);


ALTER TABLE public.ayuda OWNER TO postgres;

--
-- Name: ayuda_ayuda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ayuda_ayuda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ayuda_ayuda_id_seq OWNER TO postgres;

--
-- Name: ayuda_ayuda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ayuda_ayuda_id_seq OWNED BY public.ayuda.ayuda_id;


--
-- Name: ayuda_nutriente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ayuda_nutriente (
    ayuda_id integer NOT NULL,
    nutriente_id integer NOT NULL
);


ALTER TABLE public.ayuda_nutriente OWNER TO postgres;

--
-- Name: lista_compra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_compra (
    lista_id integer NOT NULL,
    usuario_id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lista_compra OWNER TO postgres;

--
-- Name: lista_compra_lista_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lista_compra_lista_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lista_compra_lista_id_seq OWNER TO postgres;

--
-- Name: lista_compra_lista_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lista_compra_lista_id_seq OWNED BY public.lista_compra.lista_id;


--
-- Name: lista_producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_producto (
    id integer NOT NULL,
    lista_id integer NOT NULL,
    producto_id integer NOT NULL,
    comprado boolean DEFAULT false NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.lista_producto OWNER TO postgres;

--
-- Name: lista_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lista_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lista_producto_id_seq OWNER TO postgres;

--
-- Name: lista_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lista_producto_id_seq OWNED BY public.lista_producto.id;


--
-- Name: nutriente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nutriente (
    nutriente_id integer NOT NULL,
    codigo text NOT NULL,
    nombre text NOT NULL,
    unidad text NOT NULL
);


ALTER TABLE public.nutriente OWNER TO postgres;

--
-- Name: nutriente_nutriente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nutriente_nutriente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nutriente_nutriente_id_seq OWNER TO postgres;

--
-- Name: nutriente_nutriente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nutriente_nutriente_id_seq OWNED BY public.nutriente.nutriente_id;


--
-- Name: padecimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.padecimiento (
    padecimiento_id integer NOT NULL,
    nombre text NOT NULL,
    descripcion character varying(500)
);


ALTER TABLE public.padecimiento OWNER TO postgres;

--
-- Name: padecimiento_nutriente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.padecimiento_nutriente (
    padecimiento_id integer NOT NULL,
    nutriente_id integer NOT NULL
);


ALTER TABLE public.padecimiento_nutriente OWNER TO postgres;

--
-- Name: padecimiento_padecimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.padecimiento_padecimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.padecimiento_padecimiento_id_seq OWNER TO postgres;

--
-- Name: padecimiento_padecimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.padecimiento_padecimiento_id_seq OWNED BY public.padecimiento.padecimiento_id;


--
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.producto OWNER TO postgres;

--
-- Name: producto_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.producto_producto_id_seq OWNER TO postgres;

--
-- Name: producto_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_producto_id_seq OWNED BY public.producto.producto_id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    usuario_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    foto_perfil text,
    fecha_registro timestamp with time zone DEFAULT now() NOT NULL,
    rol text DEFAULT 'usuario'::text NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_padecimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_padecimiento (
    usuario_id integer NOT NULL,
    padecimiento_id integer NOT NULL
);


ALTER TABLE public.usuario_padecimiento OWNER TO postgres;

--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuario_usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_usuario_id_seq OWNED BY public.usuario.usuario_id;


--
-- Name: ayuda ayuda_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ayuda ALTER COLUMN ayuda_id SET DEFAULT nextval('public.ayuda_ayuda_id_seq'::regclass);


--
-- Name: lista_compra lista_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_compra ALTER COLUMN lista_id SET DEFAULT nextval('public.lista_compra_lista_id_seq'::regclass);


--
-- Name: lista_producto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_producto ALTER COLUMN id SET DEFAULT nextval('public.lista_producto_id_seq'::regclass);


--
-- Name: nutriente nutriente_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutriente ALTER COLUMN nutriente_id SET DEFAULT nextval('public.nutriente_nutriente_id_seq'::regclass);


--
-- Name: padecimiento padecimiento_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padecimiento ALTER COLUMN padecimiento_id SET DEFAULT nextval('public.padecimiento_padecimiento_id_seq'::regclass);


--
-- Name: producto producto_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN producto_id SET DEFAULT nextval('public.producto_producto_id_seq'::regclass);


--
-- Name: usuario usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuario_usuario_id_seq'::regclass);


--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_events (id, trigger_name, scheduled_time, status, tries, created_at, next_retry_at) FROM stdin;
\.


--
-- Data for Name: hdb_metadata; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_metadata (id, metadata, resource_version) FROM stdin;
1	{"sources":[{"configuration":{"connection_info":{"database_url":{"from_env":"HASURA_GRAPHQL_DATABASE_URL"},"isolation_level":"read-committed","pool_settings":{"connection_lifetime":600,"idle_timeout":180,"max_connections":50,"retries":1},"use_prepared_statements":true}},"kind":"postgres","name":"default","tables":[{"array_relationships":[{"name":"ayuda_nutrientes","using":{"foreign_key_constraint_on":{"column":"ayuda_id","table":{"name":"ayuda_nutriente","schema":"public"}}}}],"table":{"name":"ayuda","schema":"public"}},{"object_relationships":[{"name":"ayuda","using":{"foreign_key_constraint_on":"ayuda_id"}},{"name":"nutriente","using":{"foreign_key_constraint_on":"nutriente_id"}}],"table":{"name":"ayuda_nutriente","schema":"public"}},{"array_relationships":[{"name":"lista_productos","using":{"foreign_key_constraint_on":{"column":"lista_id","table":{"name":"lista_producto","schema":"public"}}}}],"object_relationships":[{"name":"usuario","using":{"foreign_key_constraint_on":"usuario_id"}}],"table":{"name":"lista_compra","schema":"public"}},{"object_relationships":[{"name":"lista_compra","using":{"foreign_key_constraint_on":"lista_id"}},{"name":"producto","using":{"foreign_key_constraint_on":"producto_id"}}],"table":{"name":"lista_producto","schema":"public"}},{"array_relationships":[{"name":"ayuda_nutrientes","using":{"foreign_key_constraint_on":{"column":"nutriente_id","table":{"name":"ayuda_nutriente","schema":"public"}}}},{"name":"padecimiento_nutrientes","using":{"foreign_key_constraint_on":{"column":"nutriente_id","table":{"name":"padecimiento_nutriente","schema":"public"}}}}],"table":{"name":"nutriente","schema":"public"}},{"array_relationships":[{"name":"padecimiento_nutrientes","using":{"foreign_key_constraint_on":{"column":"padecimiento_id","table":{"name":"padecimiento_nutriente","schema":"public"}}}},{"name":"usuario_padecimientos","using":{"foreign_key_constraint_on":{"column":"padecimiento_id","table":{"name":"usuario_padecimiento","schema":"public"}}}}],"table":{"name":"padecimiento","schema":"public"}},{"object_relationships":[{"name":"nutriente","using":{"foreign_key_constraint_on":"nutriente_id"}},{"name":"padecimiento","using":{"foreign_key_constraint_on":"padecimiento_id"}}],"table":{"name":"padecimiento_nutriente","schema":"public"}},{"array_relationships":[{"name":"lista_productos","using":{"foreign_key_constraint_on":{"column":"producto_id","table":{"name":"lista_producto","schema":"public"}}}}],"table":{"name":"producto","schema":"public"}},{"array_relationships":[{"name":"lista_compras","using":{"foreign_key_constraint_on":{"column":"usuario_id","table":{"name":"lista_compra","schema":"public"}}}},{"name":"usuario_padecimientos","using":{"foreign_key_constraint_on":{"column":"usuario_id","table":{"name":"usuario_padecimiento","schema":"public"}}}}],"insert_permissions":[{"comment":"","permission":{"check":{},"columns":["email","fecha_registro","foto_perfil","nombre","password_hash","usuario_id"]},"role":"user"}],"select_permissions":[{"comment":"","permission":{"columns":["email","nombre","usuario_id","foto_perfil","password_hash","fecha_registro"],"filter":{}},"role":"user"}],"table":{"name":"usuario","schema":"public"}},{"object_relationships":[{"name":"padecimiento","using":{"foreign_key_constraint_on":"padecimiento_id"}},{"name":"usuario","using":{"foreign_key_constraint_on":"usuario_id"}}],"table":{"name":"usuario_padecimiento","schema":"public"}}]}],"version":3}	36
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_events (id, webhook_conf, scheduled_time, retry_conf, payload, header_conf, status, tries, created_at, next_retry_at, comment) FROM stdin;
\.


--
-- Data for Name: hdb_schema_notifications; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_notifications (id, notification, resource_version, instance_id, updated_at) FROM stdin;
1	{"metadata":false,"remote_schemas":[],"sources":["default"],"data_connectors":[]}	36	5dd0d23b-09db-4e28-9302-c07be6ca08cf	2025-12-19 01:11:05.529641+00
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state, ee_client_id, ee_client_secret) FROM stdin;
b9aab7c1-04b7-4301-9859-24adb9d9fae7	48	2025-12-19 00:51:51.951213+00	{"settings": {"migration_mode": "true"}, "migrations": {"default": {"1767031168706": false}}, "isStateCopyCompleted": false}	{}	\N	\N
\.


--
-- Data for Name: ayuda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ayuda (ayuda_id, titulo, descripcion, tipo, activo) FROM stdin;
1	Cómo leer la tabla nutrimental	La tabla nutrimental muestra la cantidad de energía y nutrientes que aporta un alimento por porción. Revisar el tamaño de la porción y los nutrientes críticos ayuda a tomar decisiones más informadas.	GENERAL	t
2	Consumo de azúcares	Un consumo elevado de azúcares puede afectar el metabolismo y favorecer alteraciones en los niveles de glucosa en sangre. Se recomienda moderar su ingesta diaria.	NUTRIENTE	t
3	Azúcares y control glucémico	El consumo frecuente de azúcares simples puede dificultar el control de la glucosa en sangre, por lo que es importante vigilar su presencia en la alimentación diaria.	PADECIMIENTO	t
4	Límite diario de sodio	La OMS recomienda consumir menos de 2,000 mg de sodio al día, Un consumo moderado es clave para mantener una presión arterial saludable y evitar la retención de líquidos.	NUTRIENTE	t
5	Hipertensión arterial	El exceso de sal retiene líquidos y aumenta la presión arterial, Reducir el sodio es la medida más importante para quienes ya padecen o desean prevenir la hipertensión.	PADECIMIENTO	t
6	Grasas saturadas y salud	Las grasas saturadas pueden elevar el colesterol LDL en la sangre. Se sugiere que representen menos del 10% de las calorías totales diarias para proteger la salud cardiovascular.	NUTRIENTE	t
7	Colesterol alto y Dislipidemia	Niveles altos de grasas saturadas en la dieta aumentan el riesgo de obstrucción arterial (aterosclerosis), complicando cuadros de colesterol elevado y dislipidemia.	PADECIMIENTO	t
8	Energía y balance calórico	Las calorías son la medida de energía. Un desbalance constante entre las calorías consumidas y las gastadas es la causa principal del sobrepeso y la obesidad según la OMS.	NUTRIENTE	t
9	Hígado graso no alcohólico	Un exceso crónico de energía (calorías) que el cuerpo no utiliza se almacena como grasa interna, siendo un factor de riesgo directo para el hígado graso no alcohólico.	PADECIMIENTO	t
10	Insuficiencia renal crónica	En la insuficiencia renal, los riñones pierden la capacidad de filtrar los desechos de las proteínas. Controlar su ingesta es vital para no acelerar el daño renal.	PADECIMIENTO	t
11	Caries dentales	Los azúcares son el principal sustrato para las bacterias orales que producen ácidos. Estos ácidos desmineralizan el esmalte, provocando la formación de caries.	PADECIMIENTO	t
12	Reflujo gastroesofágico (ERGE)	Las grasas totales incluyen grasas esenciales. Sin embargo, un consumo excesivo puede retrasar el vaciado del estómago, empeorando los síntomas de ardor y reflujo.	PADECIMIENTO	t
13	Diverticulitis	Los carbohidratos complejos aportan fibra. Para quienes padecen diverticulitis en fase preventiva, una dieta controlada en carbohidratos refinados ayuda a evitar crisis inflamatorias.	PADECIMIENTO	t
14	Hiperuricemia (Gota)	El exceso de peso y una ingesta calórica desmedida elevan los niveles de ácido úrico. Mantener el peso mediante el control de energía ayuda a prevenir ataques de gota.	PADECIMIENTO	t
15	Osteoporosis y Sodio	La OMS señala que el alto consumo de sodio por encima de 2g diarios aumenta la excreción urinaria de calcio, lo que debilita la densidad mineral de los huesos.	PADECIMIENTO	t
16	Síndrome de Intestino Irritable	En el Síndrome de Intestino Irritable, los azúcares de rápida fermentación pueden causar distensión abdominal. Monitorear su ingesta ayuda a reducir el dolor y los gases.	PADECIMIENTO	t
17	Importancia de las proteínas	Las proteínas son fundamentales para el crecimiento y la reparación celular. Son necesarias para la formación de enzimas y hormonas esenciales para el metabolismo.	NUTRIENTE	t
18	Función de los carbohidratos	Los carbohidratos son la fuente de combustible preferida por el cerebro y los músculos. Elegir versiones con fibra ayuda a una liberación de energía más constante.	NUTRIENTE	t
19	Grasas totales y densidad energética	Las grasas totales son densas en energía (9 kcal por gramo). Controlarlas es clave para no exceder la ingesta calórica diaria recomendada.	NUTRIENTE	t
20	Intolerancia a la lactosa	La intolerancia a la lactosa es la incapacidad de digerir este azúcar. Revisar el contenido de azúcares lácteos ayuda a evitar náuseas y espasmos abdominales.	PADECIMIENTO	t
21	Calidad de los carbohidratos	Para un metabolismo óptimo, se recomienda que los carbohidratos provengan de fuentes integrales. Los refinados pueden alterar los niveles de triglicéridos en sangre.	NUTRIENTE	t
22	Prioriza el agua simple	Beber agua simple es la mejor forma de hidratarse sin añadir calorías, sodio o azúcares innecesarios a la dieta diaria.	GENERAL	t
23	El orden de los ingredientes	El orden de los ingredientes indica la cantidad: el primer ingrediente de la lista es el que se encuentra en mayor proporción en el producto.	GENERAL	t
24	Evita los ultraprocesados	Reducir el consumo de alimentos ultraprocesados ayuda a disminuir la ingesta de nutrientes críticos como sodio, grasas saturadas y azúcares añadidos.	GENERAL	t
25	La clave es la variedad	Una dieta variada que incluya frutas, verduras, legumbres y cereales integrales garantiza la obtención de micronutrientes necesarios para prevenir enfermedades.	GENERAL	t
\.


--
-- Data for Name: ayuda_nutriente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ayuda_nutriente (ayuda_id, nutriente_id) FROM stdin;
2	6
3	6
11	6
16	6
20	6
4	7
5	7
15	7
6	4
7	4
12	3
19	3
8	1
9	1
14	1
13	5
18	5
21	5
17	2
10	2
\.


--
-- Data for Name: lista_compra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_compra (lista_id, usuario_id, nombre, created_at) FROM stdin;
5	24	Compras_de_Navidad	2025-12-29 13:38:46.339763+00
6	24	Compras_AñoNuevo	2025-12-29 17:10:15.018399+00
\.


--
-- Data for Name: lista_producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_producto (id, lista_id, producto_id, comprado, cantidad) FROM stdin;
3	5	2	f	4
9	5	1	f	1
12	6	2	f	5
13	6	7	t	5
11	6	1	t	5
10	5	5	t	1
\.


--
-- Data for Name: nutriente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nutriente (nutriente_id, codigo, nombre, unidad) FROM stdin;
1	energia_kcal	Energía	kcal
2	proteinas_g	Proteínas	g
3	grasas_totales_g	Grasas totales	g
4	grasas_saturadas_g	Grasas saturadas	g
5	carbohidratos_g	Carbohidratos	g
6	azucares_g	Azúcares	g
7	sodio_mg	Sodio	mg
\.


--
-- Data for Name: padecimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.padecimiento (padecimiento_id, nombre, descripcion) FROM stdin;
25	Diabetes tipo 2	Trastorno metabólico caracterizado por niveles elevados de glucosa en sangre debido a la resistencia a la insulina. Requiere control de carbohidratos.
26	Hipertensión arterial	Presión persistente de la sangre contra las paredes de las arterias. Mejora significativamente reduciendo el consumo de sodio y aumentando el potasio.
27	Anemia ferropénica	Disminución de glóbulos rojos por falta de hierro. Requiere aumentar el consumo de alimentos ricos en hierro y vitamina C para mejorar su absorción.
28	Deficiencias de micronutrientes	Estado de salud provocado por la falta de vitaminas y minerales esenciales necesarios para el correcto funcionamiento del organismo.
29	Colesterol alto	Presencia excesiva de lípidos en la sangre que puede obstruir arterias. Se gestiona reduciendo grasas saturadas y aumentando la fibra soluble.
30	Caries	Destrucción de los tejidos de los dientes causada por ácidos producidos por bacterias, principalmente debido al consumo frecuente de azúcares y almidones.
31	Osteoporosis	Debilitamiento óseo que aumenta el riesgo de fracturas. Se relaciona con una baja ingesta de calcio y vitamina D a lo largo de la vida.
32	Bocio / Hipotiroidismo nutricional	Aumento del tamaño de la glándula tiroides o baja producción de hormonas debido, en muchos casos, a una deficiencia severa de yodo en la dieta.
33	Dislipidemia	Alteración en los niveles de lípidos (colesterol y triglicéridos) en sangre. Es un factor de riesgo cardiovascular manejable mediante cambios dietéticos.
34	Enfermedad celíaca	Condición autoinmune donde la ingesta de gluten daña el revestimiento del intestino delgado, impidiendo la absorción de nutrientes.
35	Síndrome de intestino irritable (SII)	Trastorno digestivo que causa dolor abdominal, gases y alteraciones en el ritmo intestinal. Mejora con la gestión de fibras y carbohidratos fermentables.
36	Reflujo gastroesofágico (ERGE)	Afección donde el ácido estomacal regresa al esófago. Se recomienda evitar irritantes como grasas, picantes, cafeína y alcohol.
37	Intolerancia a la lactosa	Incapacidad de digerir el azúcar de la leche (lactosa) por falta de la enzima lactasa, provocando gases, dolor y diarrea tras ingerir lácteos.
38	Hígado graso no alcohólico	Acumulación de grasa en el hígado vinculada a la obesidad y al consumo excesivo de azúcares refinados (fructosa) y sedentarismo.
39	Hiperuricemia (Gota)	Exceso de ácido úrico en sangre que forma cristales en las articulaciones. Empeora con alimentos ricos en purinas como carnes rojas y mariscos.
40	Fenilcetonuria (PKU)	Trastorno genético raro que impide metabolizar el aminoácido fenilalanina. Requiere una dieta estrictamente baja en proteínas de por vida.
41	Alergia a la leche de vaca	Reacción del sistema inmunitario a las proteínas de la leche. A diferencia de la intolerancia, puede causar síntomas graves como urticaria o anafilaxia.
42	Alergia al maní	Respuesta inmunitaria severa a las proteínas del cacahuate. Es una de las alergias alimentarias con mayor riesgo de reacciones alérgicas fatales.
43	Alergia a los mariscos	Reacción inmunológica a crustáceos o moluscos. Suele ser una alergia persistente que dura toda la vida y requiere evitar cualquier contacto.
44	Alergia al sésamo	Reacción alérgica al ajonjolí o sésamo. Considerada una alergia emergente debido al uso creciente de este ingrediente en productos procesados.
46	Síndrome de alergia Oral	Reacción alérgica en boca y garganta tras comer ciertas frutas o verduras crudas, causada por reactividad cruzada con el polen.
47	Diverticulitis	Inflamación o infección de pequeños sacos en el tracto digestivo. En fase preventiva, una dieta alta en fibra es fundamental para su manejo.
48	Insuficiencia renal crónica	Pérdida progresiva de la función de los riñones. Requiere un control estricto de la ingesta de proteínas, potasio, fósforo y sodio.
\.


--
-- Data for Name: padecimiento_nutriente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.padecimiento_nutriente (padecimiento_id, nutriente_id) FROM stdin;
25	6
25	5
26	7
29	4
33	4
48	2
48	7
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (producto_id, nombre, cantidad_envase, unidad_envase, energia_kcal, proteinas_g, grasas_totales_g, grasas_saturadas_g, carbohidratos_g, azucares_g, sodio_mg, activo, created_at, updated_at, foto_producto) FROM stdin;
1	Refresco Cola	600.00	ml	42.00	0.00	0.00	0.00	10.60	10.60	11.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/refresco_cola.png
2	Refresco Naranja	600.00	ml	48.00	0.00	0.00	0.00	12.00	12.00	15.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/refresco_naranja.png
3	Bebida saborizada	500.00	ml	36.00	0.00	0.00	0.00	9.00	9.00	20.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/bebida_saborizada.png
4	Leche entera UHT	1000.00	ml	60.00	3.20	3.20	2.00	4.70	4.70	44.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/leche_entera_uht.png
5	Yogurt bebible fresa	220.00	ml	95.00	3.50	2.50	1.50	15.00	13.00	60.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/yogurt_bebible_fresa.png
6	Pan blanco de caja	680.00	g	265.00	8.90	4.90	1.20	49.00	5.00	490.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/pan_blanco_de_caja.png
7	Cereal de maíz azucarado	400.00	g	380.00	7.00	1.50	0.30	87.00	35.00	600.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/cereal_de_maiz_azucarado.png
8	Avena instantánea	400.00	g	389.00	17.00	7.00	1.20	66.00	1.00	2.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/avena_instantanea.png
9	Papas fritas clásicas	170.00	g	536.00	6.50	35.00	10.00	53.00	0.50	525.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/papas_fritas_clasicas.png
10	Galletas tipo María	170.00	g	450.00	7.00	14.00	4.50	72.00	24.00	300.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/galletas_tipo_maria.png
11	Galletas rellenas chocolate	154.00	g	480.00	6.00	21.00	10.00	68.00	38.00	420.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/galletas_rellenas_chocolate.png
12	Atún en agua	140.00	g	116.00	26.00	1.00	0.30	0.00	0.00	360.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/atun_en_agua.png
13	Frijoles refritos enlatados	430.00	g	110.00	5.00	3.00	0.50	16.00	1.00	380.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/frijoles_refritos_enlatados.png
14	Elote enlatado	220.00	g	96.00	3.40	1.50	0.20	21.00	4.50	240.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/elote_enlatado.png
15	Catsup	340.00	g	100.00	1.50	0.20	0.00	25.00	22.00	900.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/catsup.png
16	Mayonesa	390.00	g	680.00	1.00	75.00	12.00	1.00	1.00	635.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/mayonesa.png
17	Salsa picante	150.00	ml	30.00	1.20	0.30	0.00	6.00	3.00	1200.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/salsa_picante.png
18	Salchichas de pavo	500.00	g	220.00	11.00	18.00	6.00	4.00	1.00	850.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/salchichas_de_pavo.png
19	Jamón cocido	250.00	g	145.00	18.00	6.00	2.00	2.00	1.00	900.00	t	2025-12-26 09:51:50.413584	2025-12-26 09:51:50.413584	/products/jamon_cocido.png
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (usuario_id, nombre, email, password_hash, foto_perfil, fecha_registro, rol) FROM stdin;
25	b	b@b.com	b	/upload/1766734290946-abrazo-moha.png	2025-12-26 07:31:30.98024+00	admin
24	a	a@a.com	a	/upload/1767003292514-abrazo-moha.png	2025-12-26 04:30:19.915121+00	usuario
\.


--
-- Data for Name: usuario_padecimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_padecimiento (usuario_id, padecimiento_id) FROM stdin;
25	41
25	25
25	40
24	26
24	29
24	41
24	42
24	43
24	46
24	37
24	31
24	38
24	28
24	27
24	47
24	36
24	40
24	33
24	32
24	34
24	30
24	39
24	35
24	44
24	48
24	25
\.


--
-- Name: ayuda_ayuda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ayuda_ayuda_id_seq', 25, true);


--
-- Name: lista_compra_lista_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_compra_lista_id_seq', 6, true);


--
-- Name: lista_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_producto_id_seq', 13, true);


--
-- Name: nutriente_nutriente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nutriente_nutriente_id_seq', 7, true);


--
-- Name: padecimiento_padecimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.padecimiento_padecimiento_id_seq', 48, true);


--
-- Name: producto_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_producto_id_seq', 19, true);


--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_usuario_id_seq', 25, true);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: ayuda_nutriente ayuda_nutriente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ayuda_nutriente
    ADD CONSTRAINT ayuda_nutriente_pkey PRIMARY KEY (ayuda_id, nutriente_id);


--
-- Name: ayuda ayuda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ayuda
    ADD CONSTRAINT ayuda_pkey PRIMARY KEY (ayuda_id);


--
-- Name: lista_compra lista_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_compra
    ADD CONSTRAINT lista_compra_pkey PRIMARY KEY (lista_id);


--
-- Name: lista_producto lista_producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_producto
    ADD CONSTRAINT lista_producto_pkey PRIMARY KEY (id);


--
-- Name: nutriente nutriente_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutriente
    ADD CONSTRAINT nutriente_codigo_key UNIQUE (codigo);


--
-- Name: nutriente nutriente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutriente
    ADD CONSTRAINT nutriente_pkey PRIMARY KEY (nutriente_id);


--
-- Name: padecimiento padecimiento_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padecimiento
    ADD CONSTRAINT padecimiento_nombre_key UNIQUE (nombre);


--
-- Name: padecimiento_nutriente padecimiento_nutriente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padecimiento_nutriente
    ADD CONSTRAINT padecimiento_nutriente_pkey PRIMARY KEY (padecimiento_id, nutriente_id);


--
-- Name: padecimiento padecimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padecimiento
    ADD CONSTRAINT padecimiento_pkey PRIMARY KEY (padecimiento_id);


--
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (producto_id);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario_padecimiento usuario_padecimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_padecimiento
    ADD CONSTRAINT usuario_padecimiento_pkey PRIMARY KEY (usuario_id, padecimiento_id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (usuario_id);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: producto trg_generar_foto_producto; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_generar_foto_producto BEFORE INSERT ON public.producto FOR EACH ROW EXECUTE FUNCTION public.generar_foto_producto();


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ayuda_nutriente ayuda_nutriente_ayuda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ayuda_nutriente
    ADD CONSTRAINT ayuda_nutriente_ayuda_id_fkey FOREIGN KEY (ayuda_id) REFERENCES public.ayuda(ayuda_id) ON DELETE CASCADE;


--
-- Name: ayuda_nutriente ayuda_nutriente_nutriente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ayuda_nutriente
    ADD CONSTRAINT ayuda_nutriente_nutriente_id_fkey FOREIGN KEY (nutriente_id) REFERENCES public.nutriente(nutriente_id) ON DELETE CASCADE;


--
-- Name: lista_compra fk_lista_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_compra
    ADD CONSTRAINT fk_lista_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id) ON DELETE CASCADE;


--
-- Name: lista_producto fk_lp_lista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_producto
    ADD CONSTRAINT fk_lp_lista FOREIGN KEY (lista_id) REFERENCES public.lista_compra(lista_id) ON DELETE CASCADE;


--
-- Name: lista_producto fk_lp_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_producto
    ADD CONSTRAINT fk_lp_producto FOREIGN KEY (producto_id) REFERENCES public.producto(producto_id) ON DELETE RESTRICT;


--
-- Name: usuario_padecimiento fk_padecimiento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_padecimiento
    ADD CONSTRAINT fk_padecimiento FOREIGN KEY (padecimiento_id) REFERENCES public.padecimiento(padecimiento_id) ON DELETE CASCADE;


--
-- Name: usuario_padecimiento fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_padecimiento
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id) ON DELETE CASCADE;


--
-- Name: padecimiento_nutriente padecimiento_nutriente_nutriente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padecimiento_nutriente
    ADD CONSTRAINT padecimiento_nutriente_nutriente_id_fkey FOREIGN KEY (nutriente_id) REFERENCES public.nutriente(nutriente_id) ON DELETE CASCADE;


--
-- Name: padecimiento_nutriente padecimiento_nutriente_padecimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padecimiento_nutriente
    ADD CONSTRAINT padecimiento_nutriente_padecimiento_id_fkey FOREIGN KEY (padecimiento_id) REFERENCES public.padecimiento(padecimiento_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict pHp9zZ6WBectNJDmaSxeVT0u9pXtVK9X05oFydSceqd3tZjrozfcRRHQGiQrYOt

