--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-03-19 12:14:14

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16652)
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id integer NOT NULL,
    name text,
    body text,
    status text,
    "userId" integer
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16650)
-- Name: Project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Project_id_seq" OWNER TO postgres;

--
-- TOC entry 2846 (class 0 OID 0)
-- Dependencies: 202
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;


--
-- TOC entry 206 (class 1259 OID 16758)
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id integer NOT NULL,
    name text,
    description text,
    score integer,
    status text,
    "projectId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16756)
-- Name: Task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Task_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Task_id_seq" OWNER TO postgres;

--
-- TOC entry 2847 (class 0 OID 0)
-- Dependencies: 205
-- Name: Task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Task_id_seq" OWNED BY public."Task".id;


--
-- TOC entry 204 (class 1259 OID 16728)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    email text,
    name text NOT NULL,
    surname text,
    id integer NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16780)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 2848 (class 0 OID 0)
-- Dependencies: 207
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 2702 (class 2604 OID 16655)
-- Name: Project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);


--
-- TOC entry 2704 (class 2604 OID 16761)
-- Name: Task id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task" ALTER COLUMN id SET DEFAULT nextval('public."Task_id_seq"'::regclass);


--
-- TOC entry 2703 (class 2604 OID 16782)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 2836 (class 0 OID 16652)
-- Dependencies: 203
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, name, body, status, "userId") FROM stdin;
2	Project 101	Hello Project Body	ACTIVE	2
\.


--
-- TOC entry 2839 (class 0 OID 16758)
-- Dependencies: 206
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, name, description, score, status, "projectId", "userId") FROM stdin;
2	New Task 	Best Task of the world	1	ACTIVE	2	2
\.


--
-- TOC entry 2837 (class 0 OID 16728)
-- Dependencies: 204
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (email, name, surname, id) FROM stdin;
as@gmail.com	asdf	gfgs	1
subayan@alphonic.in	Subayan	 Sen Gupta	2
\.


--
-- TOC entry 2849 (class 0 OID 0)
-- Dependencies: 202
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Project_id_seq"', 2, true);


--
-- TOC entry 2850 (class 0 OID 0)
-- Dependencies: 205
-- Name: Task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Task_id_seq"', 2, true);


--
-- TOC entry 2851 (class 0 OID 0)
-- Dependencies: 207
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- TOC entry 2706 (class 2606 OID 16736)
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- TOC entry 2708 (class 2606 OID 16790)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (name);


-- Completed on 2020-03-19 12:14:15

--
-- PostgreSQL database dump complete
--

