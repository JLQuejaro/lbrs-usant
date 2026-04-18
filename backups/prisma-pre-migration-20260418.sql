--
-- PostgreSQL database dump
--

\restrict ilC2mZQDoQchfKLbzJFnfHgREDyVefxrmbnm5PRzygNIpM8gvyPYdcF2ZVT9kV4

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: approval_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.approval_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.approval_status OWNER TO postgres;

--
-- Name: journal_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.journal_type AS ENUM (
    'Journal',
    'Reference'
);


ALTER TYPE public.journal_type OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'availability',
    'reminder',
    'system'
);


ALTER TYPE public.notification_type OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'student',
    'faculty',
    'staff',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: user_type_admin; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_type_admin AS ENUM (
    'System Administrator'
);


ALTER TYPE public.user_type_admin OWNER TO postgres;

--
-- Name: user_type_faculty; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_type_faculty AS ENUM (
    'Professor',
    'Lecturer',
    'Researcher'
);


ALTER TYPE public.user_type_faculty OWNER TO postgres;

--
-- Name: user_type_staff; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_type_staff AS ENUM (
    'Administrative Staff',
    'Technical/Support Staff',
    'Librarian'
);


ALTER TYPE public.user_type_staff OWNER TO postgres;

--
-- Name: user_type_student; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_type_student AS ENUM (
    'Undergraduate Student',
    'Graduate Student (Master''s)',
    'Graduate Student (PhD)',
    'Distance/Online Learner'
);


ALTER TYPE public.user_type_student OWNER TO postgres;

--
-- Name: update_book_stock_on_borrow(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_book_stock_on_borrow() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE books 
    SET available_copies = available_copies - 1,
        status = CASE WHEN available_copies - 1 = 0 THEN 'Borrowed' ELSE status END
    WHERE book_id = NEW.book_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_book_stock_on_borrow() OWNER TO postgres;

--
-- Name: update_book_stock_on_return(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_book_stock_on_return() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE books 
    SET available_copies = available_copies + 1,
        status = 'Available',
        borrow_count = borrow_count + 1
    WHERE book_id = OLD.book_id;
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.update_book_stock_on_return() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_requests (
    request_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    requested_role public.user_role NOT NULL,
    user_type character varying(50) NOT NULL,
    course character varying(100),
    department character varying(100),
    year_level character varying(20),
    id_document_path character varying(255),
    status public.approval_status DEFAULT 'pending'::public.approval_status,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_by uuid,
    reviewed_at timestamp without time zone,
    review_notes text
);


ALTER TABLE public.account_requests OWNER TO postgres;

--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(150) NOT NULL,
    genre character varying(50) NOT NULL,
    description text,
    pages integer,
    publication_year integer,
    stock_quantity integer DEFAULT 1,
    available_copies integer DEFAULT 1,
    status character varying(20) DEFAULT 'Available'::character varying,
    location character varying(100),
    color_theme character varying(30),
    borrow_count integer DEFAULT 0,
    views integer DEFAULT 0,
    featured boolean DEFAULT false,
    date_added date DEFAULT CURRENT_DATE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: borrow_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borrow_records (
    borrow_id integer NOT NULL,
    user_id uuid,
    book_id integer,
    borrowed_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp without time zone NOT NULL,
    returned_date timestamp without time zone,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dates CHECK ((due_date > borrowed_date))
);


ALTER TABLE public.borrow_records OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    user_type_student public.user_type_student,
    user_type_faculty public.user_type_faculty,
    user_type_staff public.user_type_staff,
    user_type_admin public.user_type_admin,
    course character varying(100),
    year_level character varying(20),
    department character varying(100),
    approval_status public.approval_status DEFAULT 'pending'::public.approval_status,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login_at timestamp without time zone,
    reviewed_by uuid,
    reviewed_at timestamp without time zone,
    review_notes text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: active_borrows_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_borrows_view AS
 SELECT br.borrow_id,
    br.user_id,
    u.username,
    u.email,
    u.role,
    br.book_id,
    b.title AS book_title,
    b.author,
    br.borrowed_date,
    br.due_date,
    br.status
   FROM ((public.borrow_records br
     JOIN public.users u ON ((br.user_id = u.user_id)))
     JOIN public.books b ON ((br.book_id = b.book_id)))
  WHERE ((br.status)::text = 'active'::text);


ALTER VIEW public.active_borrows_view OWNER TO postgres;

--
-- Name: book_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_courses (
    book_id integer NOT NULL,
    course_name character varying(100) NOT NULL
);


ALTER TABLE public.book_courses OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    book_id integer,
    user_id uuid,
    user_name character varying(100) NOT NULL,
    rating numeric(3,2),
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: book_statistics_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.book_statistics_view AS
 SELECT b.book_id,
    b.title,
    b.author,
    b.genre,
    b.stock_quantity,
    b.available_copies,
    b.borrow_count,
    b.views,
    count(DISTINCT br.borrow_id) AS total_borrows,
    count(DISTINCT r.review_id) AS total_reviews,
    avg(r.rating) AS average_rating
   FROM ((public.books b
     LEFT JOIN public.borrow_records br ON ((b.book_id = br.book_id)))
     LEFT JOIN public.reviews r ON ((b.book_id = r.book_id)))
  GROUP BY b.book_id, b.title, b.author, b.genre, b.stock_quantity, b.available_copies, b.borrow_count, b.views;


ALTER VIEW public.book_statistics_view OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_book_id_seq OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: borrow_records_borrow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.borrow_records_borrow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.borrow_records_borrow_id_seq OWNER TO postgres;

--
-- Name: borrow_records_borrow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.borrow_records_borrow_id_seq OWNED BY public.borrow_records.borrow_id;


--
-- Name: journals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journals (
    journal_id integer NOT NULL,
    title character varying(255) NOT NULL,
    publisher character varying(100) NOT NULL,
    subject character varying(50) NOT NULL,
    impact_factor numeric(4,2),
    access_url character varying(500),
    journal_type public.journal_type NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.journals OWNER TO postgres;

--
-- Name: journals_journal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journals_journal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.journals_journal_id_seq OWNER TO postgres;

--
-- Name: journals_journal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journals_journal_id_seq OWNED BY public.journals.journal_id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id uuid,
    title character varying(150) NOT NULL,
    message text NOT NULL,
    notification_type public.notification_type NOT NULL,
    book_id integer,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- Name: reading_list_books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reading_list_books (
    reading_list_id integer NOT NULL,
    book_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reading_list_books OWNER TO postgres;

--
-- Name: reading_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reading_lists (
    reading_list_id integer NOT NULL,
    title character varying(255) NOT NULL,
    faculty_id uuid,
    description text,
    student_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reading_lists OWNER TO postgres;

--
-- Name: reading_lists_reading_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reading_lists_reading_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reading_lists_reading_list_id_seq OWNER TO postgres;

--
-- Name: reading_lists_reading_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reading_lists_reading_list_id_seq OWNED BY public.reading_lists.reading_list_id;


--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: borrow_records borrow_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_records ALTER COLUMN borrow_id SET DEFAULT nextval('public.borrow_records_borrow_id_seq'::regclass);


--
-- Name: journals journal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journals ALTER COLUMN journal_id SET DEFAULT nextval('public.journals_journal_id_seq'::regclass);


--
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- Name: reading_lists reading_list_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_lists ALTER COLUMN reading_list_id SET DEFAULT nextval('public.reading_lists_reading_list_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Data for Name: account_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_requests (request_id, full_name, email, requested_role, user_type, course, department, year_level, id_document_path, status, requested_at, reviewed_by, reviewed_at, review_notes) FROM stdin;
\.


--
-- Data for Name: book_courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_courses (book_id, course_name) FROM stdin;
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (book_id, title, author, genre, description, pages, publication_year, stock_quantity, available_copies, status, location, color_theme, borrow_count, views, featured, date_added, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: borrow_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borrow_records (borrow_id, user_id, book_id, borrowed_date, due_date, returned_date, status, created_at) FROM stdin;
\.


--
-- Data for Name: journals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journals (journal_id, title, publisher, subject, impact_factor, access_url, journal_type, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, user_id, title, message, notification_type, book_id, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: reading_list_books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reading_list_books (reading_list_id, book_id, added_at) FROM stdin;
\.


--
-- Data for Name: reading_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reading_lists (reading_list_id, title, faculty_id, description, student_count, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, book_id, user_id, user_name, rating, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, password_hash, role, user_type_student, user_type_faculty, user_type_staff, user_type_admin, course, year_level, department, approval_status, is_active, created_at, updated_at, last_login_at, reviewed_by, reviewed_at, review_notes) FROM stdin;
9cfbb9eb-92f6-4639-b55e-a0e0ed0014fb	Jericho Ramos	jericho@gmail.com	$2b$10$aLzCsywtNqHGtxoAb7PYaeTFCUHcAiE2giP4tB/k/qfmCOuK9gRIy	student	Undergraduate Student	\N	\N	\N	Computer Science	1st Year	\N	approved	t	2026-02-22 03:18:36.225131	2026-02-22 03:18:36.225131	\N	\N	\N	\N
\.


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_book_id_seq', 1, false);


--
-- Name: borrow_records_borrow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borrow_records_borrow_id_seq', 1, false);


--
-- Name: journals_journal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.journals_journal_id_seq', 1, false);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- Name: reading_lists_reading_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reading_lists_reading_list_id_seq', 1, false);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- Name: account_requests account_requests_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_requests
    ADD CONSTRAINT account_requests_email_key UNIQUE (email);


--
-- Name: account_requests account_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_requests
    ADD CONSTRAINT account_requests_pkey PRIMARY KEY (request_id);


--
-- Name: book_courses book_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_courses
    ADD CONSTRAINT book_courses_pkey PRIMARY KEY (book_id, course_name);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: borrow_records borrow_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_records
    ADD CONSTRAINT borrow_records_pkey PRIMARY KEY (borrow_id);


--
-- Name: journals journals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journals_pkey PRIMARY KEY (journal_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: reading_list_books reading_list_books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_list_books
    ADD CONSTRAINT reading_list_books_pkey PRIMARY KEY (reading_list_id, book_id);


--
-- Name: reading_lists reading_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_lists
    ADD CONSTRAINT reading_lists_pkey PRIMARY KEY (reading_list_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: idx_account_requests_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_account_requests_email ON public.account_requests USING btree (email);


--
-- Name: idx_account_requests_requested_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_account_requests_requested_at ON public.account_requests USING btree (requested_at);


--
-- Name: idx_account_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_account_requests_status ON public.account_requests USING btree (status);


--
-- Name: idx_book_courses_course_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_book_courses_course_name ON public.book_courses USING btree (course_name);


--
-- Name: idx_books_author; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_author ON public.books USING btree (author);


--
-- Name: idx_books_date_added; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_date_added ON public.books USING btree (date_added);


--
-- Name: idx_books_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_featured ON public.books USING btree (featured);


--
-- Name: idx_books_genre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_genre ON public.books USING btree (genre);


--
-- Name: idx_books_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_status ON public.books USING btree (status);


--
-- Name: idx_books_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_title ON public.books USING btree (title);


--
-- Name: idx_borrow_records_book_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_borrow_records_book_id ON public.borrow_records USING btree (book_id);


--
-- Name: idx_borrow_records_borrowed_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_borrow_records_borrowed_date ON public.borrow_records USING btree (borrowed_date);


--
-- Name: idx_borrow_records_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_borrow_records_due_date ON public.borrow_records USING btree (due_date);


--
-- Name: idx_borrow_records_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_borrow_records_status ON public.borrow_records USING btree (status);


--
-- Name: idx_borrow_records_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_borrow_records_user_id ON public.borrow_records USING btree (user_id);


--
-- Name: idx_journals_subject; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journals_subject ON public.journals USING btree (subject);


--
-- Name: idx_journals_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journals_type ON public.journals USING btree (journal_type);


--
-- Name: idx_notifications_is_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read);


--
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_type ON public.notifications USING btree (notification_type);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_reading_list_books_book_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_list_books_book_id ON public.reading_list_books USING btree (book_id);


--
-- Name: idx_reading_lists_faculty_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_lists_faculty_id ON public.reading_lists USING btree (faculty_id);


--
-- Name: idx_reading_lists_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_lists_is_active ON public.reading_lists USING btree (is_active);


--
-- Name: idx_reviews_book_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_book_id ON public.reviews USING btree (book_id);


--
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);


--
-- Name: idx_reviews_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id);


--
-- Name: idx_unique_user_book_review; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_unique_user_book_review ON public.reviews USING btree (book_id, user_id);


--
-- Name: idx_users_approval_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_approval_status ON public.users USING btree (approval_status);


--
-- Name: idx_users_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_course ON public.users USING btree (course);


--
-- Name: idx_users_department; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_department ON public.users USING btree (department);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: books update_books_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reading_lists update_reading_lists_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_reading_lists_updated_at BEFORE UPDATE ON public.reading_lists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: account_requests account_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_requests
    ADD CONSTRAINT account_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- Name: book_courses book_courses_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_courses
    ADD CONSTRAINT book_courses_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: borrow_records borrow_records_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_records
    ADD CONSTRAINT borrow_records_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: borrow_records borrow_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_records
    ADD CONSTRAINT borrow_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: notifications notifications_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reading_list_books reading_list_books_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_list_books
    ADD CONSTRAINT reading_list_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: reading_list_books reading_list_books_reading_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_list_books
    ADD CONSTRAINT reading_list_books_reading_list_id_fkey FOREIGN KEY (reading_list_id) REFERENCES public.reading_lists(reading_list_id) ON DELETE CASCADE;


--
-- Name: reading_lists reading_lists_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading_lists
    ADD CONSTRAINT reading_lists_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: users users_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict ilC2mZQDoQchfKLbzJFnfHgREDyVefxrmbnm5PRzygNIpM8gvyPYdcF2ZVT9kV4

