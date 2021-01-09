const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql = require("promise-mysql");

const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "8Zelkova8",
    database: "employees_DB"
}

// Creating Connection
const connection = mysql.createConnection(connectionProperties);


// Establishing connection to the employees_db
connection.connect((err) => {
    if (err) throw err;

    console.log("\n::::::::::::::::::::::::::::::::::::: \n:::::WELCOME TO EMPLOYEE TRACKER::::: \n::::::::::::::::::::::::::::::::::::: \n ");
    mainMenu();
});


function mainMenu() {

    //main prompt
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "MAIN MENU",
            choices: [
                "View all employees",
                "View all employees by role",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add role",
                "Add department",
                "Update employee role",
                "Update employee manager",
                "Delete employee",
                "Delete role",
                "Delete department",
            ]
        })
        .then((answer) => {

            // Switch case depending on user option
            switch (answer.action) {
                case "View all employees":
                    view_all_employees();
                    break;

                case "View all employees by department":
                    view_all_employees_by_dept();
                    break;

                case "View all employees by role":
                    view_all_employees_by_role();
                    break;

                case "Add employee":
                    add_employee();
                    break;

                case "Add department":
                    add_department();
                    break;
                case "Add role":
                    add_role();
                    break;
                case "Update employee role":
                    update_employee_role();
                    break;
                case "Update employee manager":
                    update_employee_manager();
                    break;
                case "View all employees by manager":
                    view_all_employees_by_manager();
                    break;
                case "Delete employee":
                    delete_employee();
                    break;
                case "View department budgets":
                    viewDeptBudget();
                    break;
                case "Delete role":
                    deleteRole();
                    break;
                case "Delete department":
                    deleteDept();
                    break;
            }
        });
}

function view_all_employees() {

    // when the user selects view all employees, this will create the info for the console.table
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

    connection.query(query, function (err, res) {
        if (err) return err;
        console.log("\n");
        console.table(res);
        mainMenu();
    });
}


function view_all_employees_by_dept() {

    let another_array_of_departments = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {


        return conn.query('SELECT name FROM department');
    }).then(function (value) {

        deptQuery = value;
        for (i = 0; i < value.length; i++) {
            another_array_of_departments.push(value[i].name);

        }
    }).then(() => {


        inquirer.prompt({
                name: "department",
                type: "list",
                message: "Which department are you interested in searching?",
                choices: another_array_of_departments
            })
            .then((answer) => {


                const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
                connection.query(query, (err, res) => {
                    if (err) return err;


                    console.log("\n");
                    console.table(res);


                    mainMenu();
                });
            });
    });
}


function view_all_employees_by_role() {


    let array_of_roles = [];


    promisemysql.createConnection(connectionProperties)
        .then((conn) => {


            return conn.query('SELECT title FROM role');
        }).then(function (roles) {


            for (i = 0; i < roles.length; i++) {
                array_of_roles.push(roles[i].title);
            }
        }).then(() => {


            inquirer.prompt({
                    name: "role",
                    type: "list",
                    message: "Which role are you interested in searching?",
                    choices: array_of_roles
                })
                .then((answer) => {

                    const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
                    connection.query(query, (err, res) => {
                        if (err) return err;


                        console.log("\n");
                        console.table(res);
                        mainMenu();
                    });
                });
        });
}


function add_employee() {


    let array_of_roles = [];
    let array_of_managers = [];


    promisemysql.createConnection(connectionProperties).then((conn) => {


        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {


        for (i = 0; i < roles.length; i++) {
            array_of_roles.push(roles[i].title);
        }


        for (i = 0; i < managers.length; i++) {
            array_of_managers.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {


        array_of_managers.unshift('--');

        inquirer.prompt([{

                name: "firstName",
                type: "input",
                message: "First name: ",

                validate: function (input) {
                    if (input === "") {
                        console.log("::::Please Try Again::::");
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {

                name: "lastName",
                type: "input",
                message: "Lastname name: ",

                validate: function (input) {
                    if (input === "") {
                        console.log("::::Please Try Again");
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {

                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: array_of_roles
            }, {

                name: "manager",
                type: "list",
                message: "Who is this employee's manager?",
                choices: array_of_managers
            }
        ]).then((answer) => {


            let roleID;

            let managerID = null;


            for (i = 0; i < roles.length; i++) {
                if (answer.role == roles[i].title) {
                    roleID = roles[i].id;
                }
            }


            for (i = 0; i < managers.length; i++) {
                if (answer.manager == managers[i].Employee) {
                    managerID = managers[i].id;
                }
            }

            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                if (err) return err;


                console.log(`\n::::The employee ${answer.firstName} ${answer.lastName} was added!::::\n `);
                mainMenu();
            });
        });
    });
}


function add_role() {


    let another_array_of_departments = [];


    promisemysql.createConnection(connectionProperties)
        .then((conn) => {


            return conn.query('SELECT id, name FROM department ORDER BY name ASC');

        }).then((departments) => {


            for (i = 0; i < departments.length; i++) {
                another_array_of_departments.push(departments[i].name);
            }

            return departments;
        }).then((departments) => {

            inquirer.prompt([{

                    name: "roleTitle",
                    type: "input",
                    message: "Role title: "
                },
                {

                    name: "salary",
                    type: "number",
                    message: "Salary: "
                },
                {

                    name: "dept",
                    type: "list",
                    message: "Department: ",
                    choices: another_array_of_departments
                }
            ]).then((answer) => {


                let deptID;


                for (i = 0; i < departments.length; i++) {
                    if (answer.dept == departments[i].name) {
                        deptID = departments[i].id;
                    }
                }


                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if (err) return err;
                    console.log(`\n::::The role ${answer.roleTitle} was added!::::\n`);
                    mainMenu();
                });

            });

        });

}


function add_department() {

    inquirer.prompt({

        name: "deptName",
        type: "input",
        message: "Department Name: "
    }).then((answer) => {

        connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
            if (err) return err;
            console.log("\n::::Department added!::::\n ");
            mainMenu();
        });

    });
}

function update_employee_role() {

    let array_of_employees = [];
    let array_of_roles = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {
        return Promise.all([

            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {

        for (i = 0; i < roles.length; i++) {
            array_of_roles.push(roles[i].title);
        }

        for (i = 0; i < employees.length; i++) {
            array_of_employees.push(employees[i].Employee);
        }

        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([{
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: array_of_employees
        }, {

            name: "role",
            type: "list",
            message: "What is their updated role?",
            choices: array_of_roles
        }, ]).then((answer) => {

            let roleID;
            let employeeID;

            for (i = 0; i < roles.length; i++) {
                if (answer.role == roles[i].title) {
                    roleID = roles[i].id;
                }
            }

            for (i = 0; i < employees.length; i++) {
                if (answer.employee == employees[i].Employee) {
                    employeeID = employees[i].id;
                }
            }

            connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                if (err) return err;
                console.log(`\n:::: ${answer.employee} has been updated to ${answer.role}!::::\n `);
                mainMenu();
            });
        });
    });

}

// Update employee manager
function update_employee_manager() {
    let array_of_employees = [];
    promisemysql.createConnection(connectionProperties).then((conn) => {

        return conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {


        for (i = 0; i < employees.length; i++) {
            array_of_employees.push(employees[i].Employee);
        }

        return employees;
    }).then((employees) => {

        inquirer.prompt([{

            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: array_of_employees
        }, {

            name: "manager",
            type: "list",
            message: "Who is the employee's new manager?",
            choices: array_of_employees
        }, ]).then((answer) => {

            let employeeID;
            let managerID;


            for (i = 0; i < employees.length; i++) {
                if (answer.manager == employees[i].Employee) {
                    managerID = employees[i].id;
                }
            }

            for (i = 0; i < employees.length; i++) {
                if (answer.employee == employees[i].Employee) {
                    employeeID = employees[i].id;
                }
            }


            connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                if (err) return err;
                console.log(`\n:::: ${answer.employee}'s manager is now ${answer.manager}!::::\n`);
                mainMenu();
            });
        });
    });
}

function view_all_employees_by_manager() {

    let array_of_managers = [];

    promisemysql.createConnection(connectionProperties)
        .then((conn) => {

            return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id");

        }).then(function (managers) {

            for (i = 0; i < managers.length; i++) {
                array_of_managers.push(managers[i].manager);
            }

            return managers;
        }).then((managers) => {

            inquirer.prompt({
                    name: "manager",
                    type: "list",
                    message: "Which manager are you looking for?",
                    choices: array_of_managers
                })
                .then((answer) => {

                    let managerID;
                    for (i = 0; i < managers.length; i++) {
                        if (answer.manager == managers[i].manager) {
                            managerID = managers[i].id;
                        }
                    }
                    const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;

                    connection.query(query, (err, res) => {
                        if (err) return err;
                        console.log("\n");
                        console.table(res);

                        mainMenu();
                    });
                });
        });
}

function delete_employee() {

    let array_of_employees = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {

        return conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {


        for (i = 0; i < employees.length; i++) {
            array_of_employees.push(employees[i].employee);
        }

        inquirer.prompt([{

            name: "employee",
            type: "list",
            message: "Which employee would you like to delete?",
            choices: array_of_employees
        }, {
            name: "yesNo",
            type: "list",
            message: "Are you sure you want to delete them?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            if (answer.yesNo == "YES") {
                let employeeID;
                for (i = 0; i < employees.length; i++) {
                    if (answer.employee == employees[i].employee) {
                        employeeID = employees[i].id;
                    }
                }

                connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                    if (err) return err;
                    ee
                    console.log(`\n::::Employee '${answer.employee}' was deleted.::::\n `);
                    mainMenu();
                });
            } else {
                console.log(`\n::::Employee '${answer.employee}' was not deleted.::::\n `);

                mainMenu();
            }

        });
    });
}

function deleteRole() {

    let array_of_roles = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {

        return conn.query("SELECT id, title FROM role");
    }).then((roles) => {

        for (i = 0; i < roles.length; i++) {
            array_of_roles.push(roles[i].title);
        }

        inquirer.prompt([{
            name: "continueDelete",
            type: "list",
            message: "Are you sure you want to do this?",
            choices: ["NO", "YES"]
        }]).then((answer) => {
            if (answer.continueDelete === "NO") {
                mainMenu();
            }

        }).then(() => {

            inquirer.prompt([{
                name: "role",
                type: "list",
                message: "Which role would you like to delete?",
                choices: array_of_roles
            }, {
                name: "confirmDelete",
                type: "Input",
                message: "Type the role title EXACTLY to confirm deletion of the role"

            }]).then((answer) => {

                if (answer.confirmDelete === answer.role) {

                    let roleID;
                    for (i = 0; i < roles.length; i++) {
                        if (answer.role == roles[i].title) {
                            roleID = roles[i].id;
                        }
                    }

                    connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                        if (err) return err;

                        console.log(`\n:::: Role '${answer.role}' was deleted.::::\n `);

                        mainMenu();
                    });
                } else {

                    console.log(`\n:::: Role '${answer.role}' was not deleted.::::\n `);

                    mainMenu();
                }

            });
        })
    });
}

function deleteDepartment() {

    let another_array_of_departments = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {

        return conn.query("SELECT id, name FROM department");
    }).then((depts) => {

        for (i = 0; i < depts.length; i++) {
            another_array_of_departments.push(depts[i].name);
        }

        inquirer.prompt([{

            name: "continueDelete",
            type: "list",
            message: "*** WARNING *** Deleting a department will delete all roles and employees associated with the department. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            if (answer.continueDelete === "NO") {
                mainMenu();
            }

        }).then(() => {

            inquirer.prompt([{
                name: "dept",
                type: "list",
                message: "Which department would you like to delete?",
                choices: another_array_of_departments
            }, {

                name: "confirmDelete",
                type: "Input",
                message: "Please type the department name you want to delete: "

            }]).then((answer) => {

                if (answer.confirmDelete === answer.dept) {

                    let deptID;
                    for (i = 0; i < depts.length; i++) {
                        if (answer.dept == depts[i].name) {
                            deptID = depts[i].id;
                        }
                    }

                    connection.query(`DELETE FROM department WHERE id=${deptID};`, (err, res) => {
                        if (err) return err;

                        console.log(`\n ::::Department '${answer.dept}' was deleted.::::\n `);

                        mainMenu();
                    });
                } else {

                    console.log(`\n ::::Department '${answer.dept}' was not deleted.::::\n `);

                    mainMenu();
                }

            });
        })
    });
}