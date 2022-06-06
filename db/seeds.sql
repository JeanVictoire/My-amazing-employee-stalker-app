USE jv_employees_db

-- Departments Row
INSERT INTO departments (name)
VALUES ("Engineering"),  
        ("Finace"),      
        ("Legal"),       
        ("Sales");       

-- Roles Table
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", "100000", 4),
        ("Salespersone", "80000", 4),
        ("Lead Engineer", "150000", 1),
        ("Software Engineer", "120000", 1),
        ("Account Manager", "160000", 2),
        ("Accountant", "125000", 2),
        ("Legal Team Lead", "250000", 3),
        ("Lawyer", "190000", 3);

-- Employees Table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Zlatan", "Ibrahimovic", 1, 3),
        ("Michael", "Bradley", 2, 1),
        ("Alex", "Morgan", 3, NULL),
        ("Harry", "Kane", 4, 3),
        ("Luis", "Suárez", 5, NULL),
        ("Cristiano", "Ronaldo", 6, NULL),
        ("Lionel", "Messi", 7, 6),
        ("Camille", "Vasquez", 8, 2);