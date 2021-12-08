INSERT INTO departments (department)
VALUES ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');


INSERT INTO roles (title, salary, department_id)
VALUES  ('Lead Engineer', 10000, 1),
        ('Accountant', 45000, 2),
        ('Legal Team Lead', 150000, 3),
        ('Software Engineer', 100000, 1),
        ('Account Manager', 90000, 2),
        ('Salesperson', 60000, 4),
        ('Lawyer', 200000, 3),
        ('Sales Lead', 100000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Neymar', 'js', 1, null),
        ('Steven', 'Hawking', 5, null),
        ('Morty', 'Smith', 3, null),
        ('Rick', 'Sanchez', 4, 1),
        ('lionel', 'Messi', 8, null),
        ('franken', 'stein', 6, 5),
        ('jerry', 'Smith', 7, 3),
        ('rosa', 'parks', 2, 2);