DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS tour_groups;
DROP TABLE IF EXISTS guides;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    id_card VARCHAR(30) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    emergency_contact VARCHAR(100),
    travel_preference TEXT
);

CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    days INTEGER NOT NULL,
    attractions TEXT,
    adult_price NUMERIC(10, 2) NOT NULL,
    child_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL
);

CREATE TABLE guides (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 0,
    description TEXT
);

CREATE TABLE tour_groups (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    guide_id INTEGER REFERENCES guides(id) ON DELETE SET NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_people INTEGER NOT NULL DEFAULT 0,
    min_people INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES tour_groups(id) ON DELETE CASCADE,
    people_count INTEGER NOT NULL,
    order_status VARCHAR(20) NOT NULL,
    amount_receivable NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    balance NUMERIC(10, 2) NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES tour_groups(id) ON DELETE CASCADE,
    expense_type VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT
);
