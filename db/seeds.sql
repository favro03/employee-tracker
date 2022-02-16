INSERT INTO department (department_name)
VALUES
('Marketing'),
('Law'),
('Security'),
('IT'),
('Finance'),
('Merchandising'),
('Distribution');

INSERT INTO role (role_title, salary, department_id)
VALUES
('Analyst', 30000, 3),
('Engineer', 50000, 4),
('Lead Analyst', 100000, 3),
('Director', 150000, 1),
('Director', 150000, 2),
('Director', 150000, 3),
('Director', 150000, 4),
('Director', 150000, 5),
('Director', 150000, 6),
('Director', 150000, 7);


INSERT INTO manager (first_name, last_name)
VALUES
('BOB', 'BOZO'),
('Tracy', 'Morgan'),
('Adam', 'Sandler'),
('Tina', 'Fae'),
('Mike', 'Myers'),
('Forrest', 'Gump'),
('Julie', 'Bennet');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, 1),
('Mary', 'Johnson', 2, 2),
('Josh', 'Jones', 3, 3),
('Paul', 'Macartney', 4, 4),
('Ringo', 'Starr', 8, 5),
('Lanie', 'North', 7, 6),
('Paul', 'Marcartney', 1, 7),
('Paul', 'Marcartney', 9, 7);

