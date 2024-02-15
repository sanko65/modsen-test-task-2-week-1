--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

-- Started on 2024-02-15 15:05:01

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
-- TOC entry 832 (class 1247 OID 16466)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'moderator'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 213 (class 1259 OID 16472)
-- Name: attendees; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.attendees (
    user_id integer NOT NULL,
    meetup_id integer NOT NULL
);


ALTER TABLE public.attendees OWNER TO me;

--
-- TOC entry 210 (class 1259 OID 16423)
-- Name: meetup; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.meetup (
    meetup_id integer NOT NULL,
    name character varying(80),
    description text,
    keywords character varying(30)[],
    "time" timestamp without time zone,
    place character varying(50)
);


ALTER TABLE public.meetup OWNER TO me;

--
-- TOC entry 209 (class 1259 OID 16422)
-- Name: meetup_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.meetup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.meetup_id_seq OWNER TO me;

--
-- TOC entry 3340 (class 0 OID 0)
-- Dependencies: 209
-- Name: meetup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.meetup_id_seq OWNED BY public.meetup.meetup_id;


--
-- TOC entry 212 (class 1259 OID 16453)
-- Name: user; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    refresh_token text,
    role public.user_role DEFAULT 'user'::public.user_role
);


ALTER TABLE public."user" OWNER TO me;

--
-- TOC entry 211 (class 1259 OID 16452)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO me;

--
-- TOC entry 3341 (class 0 OID 0)
-- Dependencies: 211
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 3176 (class 2604 OID 16426)
-- Name: meetup meetup_id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.meetup ALTER COLUMN meetup_id SET DEFAULT nextval('public.meetup_id_seq'::regclass);


--
-- TOC entry 3177 (class 2604 OID 16456)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3334 (class 0 OID 16472)
-- Dependencies: 213
-- Data for Name: attendees; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.attendees (user_id, meetup_id) FROM stdin;
1	1
20	5
20	7
\.


--
-- TOC entry 3331 (class 0 OID 16423)
-- Dependencies: 210
-- Data for Name: meetup; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.meetup (meetup_id, name, description, keywords, "time", place) FROM stdin;
1	Python Meetup	A meetup for Python enthusiasts to discuss the latest trends and network with fellow developers.	{Python,programming,networking}	2024-02-15 18:00:00	TechHub, 123 Main St
2	Data Science Gathering	Join us for an evening of data science discussions and insights.	{"Data science",analytics,"machine learning"}	2024-02-20 17:30:00	DataLab, 456 Elm St
3	Web Development Workshop	A hands-on workshop covering the latest in web development technologies.	{"Web development",coding,front-end,back-end}	2024-02-25 19:00:00	DevSpace, 789 Oak St
4	UX/UI Design Forum	Explore the world of user experience and interface design.	{"UX/UI design",usability,prototyping}	2024-03-05 18:30:00	DesignStudio, 321 Pine St
5	Blockchain Meetup	Discover the potential of blockchain technology and its real-world applications.	{Blockchain,cryptocurrency,decentralization}	2024-03-10 17:00:00	BlockHub, 987 Cedar St
6	Java Developers Meetup	Join fellow Java enthusiasts for a discussion on the latest features and best practices.	{Java,programming,development}	2024-02-18 19:00:00	CodeWorks, 555 Elm St
7	Artificial Intelligence Symposium	Explore the world of AI with talks and presentations from industry experts.	{"Artificial intelligence","machine learning","deep learning"}	2024-02-22 18:30:00	AI Institute, 789 Oak St
8	Cybersecurity Workshop	Learn about the latest cybersecurity threats and strategies to protect your data.	{Cybersecurity,"network security","data protection"}	2024-02-28 17:00:00	SecureTech, 123 Maple St
9	Entrepreneurship Networking Event	Connect with fellow entrepreneurs and exchange ideas for building successful businesses.	{Entrepreneurship,startup,networking}	2024-03-03 18:00:00	StartupHub, 456 Pine St
10	Graphic Design Meetup	Discuss the latest trends and techniques in graphic design.	{"Graphic design",illustration,typography}	2024-03-08 18:30:00	DesignLab, 789 Cedar St
11	Front-End Developers Meetup	Join us for a discussion on front-end development trends and techniques.	{"Front-end development","web design",JavaScript}	2024-02-20 18:00:00	CodeLab, 789 Elm St
12	Mobile App Development Workshop	Learn about mobile app development strategies and tools from industry experts.	{"Mobile app development",iOS,Android}	2024-02-25 17:30:00	AppSpace, 456 Oak St
13	Product Management Forum	Explore the role of product managers in shaping successful products and businesses.	{"Product management","product strategy",agile}	2024-03-01 18:30:00	ProductHub, 123 Pine St
14	Cloud Computing Seminar	Discover the latest advancements in cloud computing and its impact on businesses.	{"Cloud computing",AWS,Azure}	2024-03-06 17:00:00	CloudTech, 789 Cedar St
15	Data Visualization Workshop	Learn how to create compelling visualizations from your data.	{"Data visualization",charts,graphs}	2024-03-10 18:30:00	VizLab, 321 Maple St
16	Cybersecurity Hackathon	Join us for an intense 24-hour hackathon focusing on cybersecurity challenges and solutions.	{Cybersecurity,hackathon,"network security"}	2024-02-29 10:00:00	CyberWorks, 123 Oak St
17	Artificial Intelligence in Healthcare Symposium	Explore the applications of AI in improving healthcare outcomes with experts in the field.	{"Artificial intelligence",healthcare,"medical technology"}	2024-03-05 09:00:00	MedTech Center, 456 Pine St
18	Startup Pitch Night	Watch startups pitch their ideas to a panel of investors and receive valuable feedback.	{Startup,pitch,entrepreneurship}	2024-03-12 18:00:00	InvestorHub, 789 Elm St
62	Mobile App Development Workshop	Learn about mobile app development strategies and tools from industry experts.	{"Mobile app development",iOS,Android}	2024-02-25 17:30:00	AppSpace, 456 Oak St
60	Mobile App Design Forum	Explore mobile app design principles and trends with industry professionals.	{"Mobile app design","UI/UX, app prototyping"}	2024-03-01 18:00:00	AppDesignStudio, 456 Maple St
63	Mobile App Development Workshop	Learn about mobile app development strategies and tools from industry experts.	{"Mobile app development",iOS,Android}	2024-02-25 17:30:00	AppSpace, 456 Oak St
\.


--
-- TOC entry 3333 (class 0 OID 16453)
-- Dependencies: 212
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public."user" (user_id, email, password, refresh_token, role) FROM stdin;
1	dsanko53@gmail.com	234324	\N	user
4	dsanko54@gmail.com	234324	\N	user
5	dsanko55@gmail.com	234324	\N	user
7	dsanko56@gmail.com	234324	\N	user
9	dsanko57@gmail.com	$2a$15$v2hm0L7Op..qWNoAAwQsCufZ0RY9YN75UYsDK6zh4AglaW621D1mq	\N	user
12	dsanko35@gamail.com	$2a$15$xxpG2P8pJtYxv8E0DBEWGejU6v/7sf5ipykSBLExVC/7epYyY/LvG	\N	user
13	dsanko35@gmail.com	$2a$15$E0ZWHeO9Uh0VoS5nA.zBv.IAuaqBRU6AHvIjVGyZBLt5FXCLW9vaW	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiZHNhbmtvMzVAZ21haWwuY29tIiwiaWF0IjoxNzA3OTUwNzM4LCJleHAiOjE3MDc5NTA4NTh9.JDer98tb-OOF9QhKX1IOy3ffQetD-5-rAFAR8yGN91o	user
14	dsaasdsadnko35@gmail.com	$2a$15$M8GYYxkJEyXS4EnaHtIoHOZfZRY4u.1de0k8W4utq8Bhr1Q7APa4m	\N	user
16	dsaasdsadnsdasako35@gmail.com	$2a$15$tkNBBSTN7xoUSD6v4ZHr5uYQLfQp./NOyxznRwOJSAGdFZ.DpI7pW	\N	user
18	dsaasdsadnsdasmkmako35@gmail.com	$2a$15$4Whp7O3D1mkS6vuXnZOoPOyTlGbsgOEldReWHoUSz8kOpOaT8SZ2W	\N	moderator
20	dsanko1@gmail.com	$2a$15$mR7A4R9Bxd4YuzQ0m0Uf3e7NdEen26VwFQdsJwOkruhJxhusHZ.AG	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImVtYWlsIjoiZHNhbmtvMUBnbWFpbC5jb20iLCJyb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzA3OTk0MjE1LCJleHAiOjE3MDc5OTQzMzV9.B66Dqj_XbB7MAbeKGj5t4z_45AT_b2sw2ctdDRJCS4w	moderator
\.


--
-- TOC entry 3342 (class 0 OID 0)
-- Dependencies: 209
-- Name: meetup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.meetup_id_seq', 63, true);


--
-- TOC entry 3343 (class 0 OID 0)
-- Dependencies: 211
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.users_user_id_seq', 20, true);


--
-- TOC entry 3188 (class 2606 OID 16476)
-- Name: attendees attendees_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.attendees
    ADD CONSTRAINT attendees_pkey PRIMARY KEY (user_id, meetup_id);


--
-- TOC entry 3182 (class 2606 OID 16462)
-- Name: user email; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT email UNIQUE (email);


--
-- TOC entry 3180 (class 2606 OID 16428)
-- Name: meetup meetup_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.meetup
    ADD CONSTRAINT meetup_pkey PRIMARY KEY (meetup_id);


--
-- TOC entry 3184 (class 2606 OID 16460)
-- Name: user users_email_key; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3186 (class 2606 OID 16458)
-- Name: user users_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3190 (class 2606 OID 16482)
-- Name: attendees attendees_meetup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.attendees
    ADD CONSTRAINT attendees_meetup_id_fkey FOREIGN KEY (meetup_id) REFERENCES public.meetup(meetup_id);


--
-- TOC entry 3189 (class 2606 OID 16477)
-- Name: attendees attendees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.attendees
    ADD CONSTRAINT attendees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


-- Completed on 2024-02-15 15:05:01

--
-- PostgreSQL database dump complete
--

