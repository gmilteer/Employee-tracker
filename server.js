const mysql = require("mysql");
const inquirer = require("inquirer");
const boxen = require("boxen");

let employeeProfile;

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Myrtleamy12!",
  database: "employee_trackerDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  starter();
});

function starter() {
  console.log(
    boxen("Employee Tracker", {
      padding: 1,
      margin: 1,
      borderStyle: "double",
    })
  );
  toDoList();
}

function toDoList() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do today?",
        name: "toDo",
        choices: [
          "View all employees",
          "View all departments",
          "View all Roles",
          "Add a new employee",
          "Add a new Role",
          "Add a new Department",
          "Update an employees Role",
          "Update an employees Department",
          "Remove an employee",
          "Remove Role",
          "Remove Department",

          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.toDo) {
        case "View all employees":
          viewAll();
          break;
        case "View all departments":
          allDepartments();
          break;
        case "View all Roles":
          rolesTable();
          break;
        case "Add a new employee":
          addEmployee();
          break;
        case "Add a new Role":
          addRole();
          break;
        case "Add a new Department":
          addDepartment();
          break;
        case "Update an employees Role":
          updateEmployee();
          break;
        case "Update an employees Department":
          updateEmployeeDepartment();
          break;
        case "Remove an employee":
          deleteEmployee();
          break;
        case "Remove Role":
          removeRole();
          break;
        case "Remove Department":
          removeDepartment();
          break;

        case "Exit":
          console.log("Youre up to date!");
          connection.end();
          break;
      }
    });
}

function askAgain() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Is there anything else you would like to do today?",
        name: "moreChanges",
      },
    ])
    .then((answer) => {
      if (answer.moreChanges === true) {
        toDoList();
      } else {
        console.log("Youre up to date!");
        connection.end();
      }
    });
}

function viewAll() {
  console.log("Selecting all employees...\n");
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    else {
      // Log all results of the SELECT statement
      console.table(results);
      askAgain();
    }
  });
}
function allDepartments() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.log("\n Here are all current Departments. \n");
    console.table(results);
    askAgain();
  });
}
function rolesTable() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    console.log("\n Here are all current Roles");
    console.table(results);
    askAgain();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter Employee ID:",
        name: "id",
      },
      {
        type: "input",
        message: "What is the new employees first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the new employees last name?",
        name: "lastName",
      },
      {
        type: "input",
        message: "What is the new employees role Id?",
        name: "role",
      },
      {
        type: "input",
        message: "What is the new employees manager Id?",
        name: "manager",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          id: answers.id,
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: answers.role,
          manager_id: answers.manager,
        },
        function (err, results) {
          if (err) throw err;
          console.log(results.affectedRows + " employee inserted! \n");
          askAgain();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter Role ID:",
        name: "id",
      },
      {
        type: "input",
        message: "What is the title of the new Role?",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: "roleSalary",
      },
      {
        type: "input",
        message: "Enter the ID of the department this role will fall under",
        name: "department",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          id: answers.id,
          title: answers.roleTitle,
          salary: answers.roleSalary,
          department_id: answers.department,
        },
        function (err, results) {
          if (err) throw err;
          console.log(results.affectedRows + " role inserted! \n");
          askAgain();
        }
      );
    });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter Role ID:",
        name: "id",
      },
      {
        type: "input",
        message: "What is the Title of the new department?",
        name: "newDep",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          id: answer.id,
          name: answer.newDep,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " department inserted! \n");
          askAgain();
        }
      );
    });
}
function updateEmployee() {
  connection.query("SELECT * FROM employee", function (err, results) {
    employeeProfile = results;
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to update?",
          name: "employee",
          choices: results.map(
            (result) =>
              result.first_name + " " + result.last_name + " " + result.role_id
          ),
        },
      ])
      .then((answer) => {
        let employeeInfo = answer.employee.split(" ");
        connection.query("SELECT * FROM role", function (err, res) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "list",
                message:
                  "What role would you like to select for this employee?",
                name: "updatedRole",
                choices: res.map((res) => res.id + " " + res.title),
              },
            ])
            .then((newRole) => {
              let roleId = newRole.updatedRole.split(" ")[0];
              connection.query(
                "UPDATE employee SET role_id = ?",
                [roleId, employeeInfo[2]],
                (err, res) => {
                  if (err) throw err;
                  console.log("Role has been updated! \n ");
                  askAgain();
                }
              );
            });
        });
      });
  });
}
function updateEmployeeDepartment() {
  connection.query("SELECT * FROM employee", function (err, results) {
    employeeProfile = results;
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to update?",
          name: "employee",
          choices: results.map(
            (result) =>
              result.first_name +
              " " +
              result.last_name +
              " " +
              result.department_id
          ),
        },
      ])
      .then((answer) => {
        let employeeInfo = answer.employee.split(" ");
        connection.query("SELECT * FROM department", function (err, res) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "list",
                message:
                  "What department would you like to select for this employee?",
                name: "updatedDepartment",
                choices: res.map((res) => res.id + " " + res.name),
              },
            ])
            .then((newDepartment) => {
              let departmentId = newDepartment.updatedDepartment.split(" ")[0];
              connection.query(
                "UPDATE employee SET role_id = ?",
                [departmentId, employeeInfo[2]],
                (err, res) => {
                  if (err) throw err;
                  console.log("Department has been updated! \n ");
                  askAgain();
                }
              );
            });
        });
      });
  });
}
function deleteEmployee() {
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to remove from the database?",
          name: "remove",
          choices: results.map(
            (results) =>
              results.id + " " + results.first_name + " " + results.last_name
          ),
        },
      ])
      .then((answers) => {
        let selection = answers.remove.split(" ")[0];

        connection.query(
          "DELETE FROM employee WHERE id = ?",
          [selection[0]],
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee has been removed! \n ");
            askAgain();
          }
        );
      });
  });
}
function removeRole() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which role would you like to remove from the database?",
          name: "removeRole",
          choices: results.map(
            (results) =>
              results.id +
              " " +
              results.title +
              " " +
              results.salary +
              " " +
              results.department_id
          ),
        },
      ])
      .then((answers) => {
        let selection = answers.removeRole.split(" ")[0];

        connection.query(
          "DELETE FROM role WHERE id = ?",
          [selection[0]],
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " role has been removed! \n ");
            askAgain();
          }
        );
      });
  });
}
function removeDepartment() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message:
            "Which department would you like to remove from the database?",
          name: "removeDepartment",
          choices: results.map((results) => results.id + " " + results.name),
        },
      ])
      .then((answers) => {
        let selection = answers.removeDepartment.split(" ")[0];

        connection.query(
          "DELETE FROM department WHERE id = ?",
          [selection[0]],
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " department has been removed! \n ");
            askAgain();
          }
        );
      });
  });
}
