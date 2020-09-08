
-- Department Data--
USE employee_trackerDB

INSERT INTO department
    (id, name)
VALUES
    (1, "Accounting"),
    (2, "Marketing"),
    (3, "Engineering"),
    (4, "Operations")

-- Role Data --
INSERT INTO role
    (id, title, salary, department_id)
VALUES
    (1, "Software Engineer", 90000, 12),
    (2, "Communications Coordinator", 50000, 15),
    (3, "Human Resources", 45000, 9),
    (4, "Accounting", 65000, 3)

-- Employee Data --
INSERT INTO employee
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, "John", "Hancock", 12, 19),
    (2, "Jane", "Doe", 14, 8),
    (3, "Izzy", "Stevens", 9, 13),
    (4, "Christina", "Yang", 5, 17)





