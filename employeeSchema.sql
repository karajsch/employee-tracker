DROP DATABASE IF EXISTS employees_DB;

CREATE DATABASE employees_DB;

USE employees_DB;

CREATE TABLE department
(
    id INT NOT NULL
    AUTO_INCREMENT,
    name VARCHAR
    (30) NOT NULL,
    PRIMARY KEY
    (id)
);

    CREATE TABLE role
    (
        id INT NOT NULL
        AUTO_INCREMENT,
    title VARCHAR
        (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY
        (id),
    FOREIGN KEY
        (department_id) REFERENCES department
        (id) ON
        DELETE CASCADE
);

        CREATE TABLE employee
        (
            id INT NOT NULL
            AUTO_INCREMENT,
    first_name VARCHAR
            (30) NOT NULL,
    last_name VARCHAR
            (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY
            (id),
    FOREIGN KEY
            (role_id) REFERENCES role
            (id) ON
            DELETE CASCADE,
    FOREIGN KEY (manager_id)
            REFERENCES employee
            (id) ON
            DELETE CASCADE
);


            INSERT INTO department
                (id, name)
            VALUES
                (1, "Management");

            INSERT INTO department
                (id, name)
            VALUES
                (2, "Human Resources");

            INSERT INTO department
                (id, name)
            VALUES
                (3, "Engineering");

            INSERT INTO department
                (id, name)
            VALUES
                (4, "Marketing");

            INSERT INTO department
                (id, name)
            VALUES
                (5, "Finance");

            INSERT INTO department
                (id, name)
            VALUES
                (6, "Legal");


            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (1, "Manager", 90000, 1);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (2, "Human Resources Coordinator", 71000, 2);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (3, "Front End Engineer", 75000, 3);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (4, "Back End Engineer", 75000, 3);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (5, "Accountant", 70000, 5);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (6, "Designer", 70000, 4);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (7, "Design Intern", 40000, 4);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (8, "Project Manager", 80000, 1);

            INSERT INTO role
                (id, title, salary, department_id)
            VALUES
                (9, "Attorney", 70000, 6);


            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (1, "Daenerys", "Targaryen", 1, null);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (2, "Jaime", "Lannister", 3, 1);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (3, "Arya", "Stark", 4, 1);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (4, "Sansa", "Stark", 1, null);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (5, "Brienne", "Tarth", 4, 1);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (6, "Tyrion", "Lannister", 5, null);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (7, "Margaery", "Tyrell", 3, 1);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (8, "Jon", "Snow", 8, 1);

            INSERT INTO employee
                (id, first_name, last_name, role_id, manager_id)
            VALUES
                (9, "Samwell", "Tarly", 2, 1);


