-- Drops the jv_employees_db if it exists currently --
DROP DATABASE IF EXISTS jv_employees_db;
-- Creates the jv_employees_db database --
CREATE DATABASE jv_employees_db;

-- use jv_employees_db database --
USE jv_employees_db;

DROP TABLE IF EXISTS departments;
-- Creates the table "departments" within jv_employees_db --
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS roles;
-- Creates the table "roles" within jv_employees_db --
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2),
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

DROP TABLE IF EXISTS employees;
-- Creates the table "employees" within jv_employees_db --
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT REFERENCES employees(id),
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);