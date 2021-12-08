//packages
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
const chalk = require("chalk");

console.log(
  chalk.cyan(
    figlet.textSync("Employee-Tracker!", { horizontalLayout: "Awesome Work" })
  )
);

//mysql2 connection
const db = require("./config/connection");

//String Validation
const validString = (input) => {
  const valid = input.match(/^[a-z A-Z]+$/);
  if (input === "" || input === undefined || input.length < 2) {
    return "Please enter a valid name.";
  } else if (valid) {
    return true;
  } else {
    return "Value must be a string of alphabetical characters.";
  }
};

//Number Validation
const validNumber = (input) => {
  if (input === "" || input === undefined) {
    return "Please enter a valid salary.";
  } else if (isNaN(input)) {
    return "Must be a numerical value.";
  } else {
    return true;
  }
};

//options for central lobby
const lobbyOptions = [
  "View All Employees",
  "Add Employee",
  "Update Employee Role",
  "View All Roles",
  "Add Role",
  "View All Departments",
  "Add Department",
  "Quit",
];

//inquirer prompts
const init = () => {
  inquirer
    .prompt({
      type: "list",
      name: "centralLobby",
      message: "What would you like to do?",
      choices: lobbyOptions,
    })
    .then((data) => {
      switch (data.centralLobby) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          quit();
          break;
        default:
          console.log("Something went wrong! Use ctrl c to exit!");
      }
    });
};

//Shows employees table
function viewEmployees() {
  db.query(
    `SELECT employees.id, employees.first_name, employees.last_name, 
    CONCAT(manager.first_name, " ", manager.last_name) AS manager, title, salary, departments.department 
    FROM employees 
    JOIN roles ON employees.role_id = roles.id 
    LEFT JOIN employees manager ON manager.id = employees.manager_id
    JOIN departments ON roles.department_id = departments.id
    ORDER BY employees.id ASC;`,

    function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
      init();
    }
  );
}

//Adds employees to table
function addEmployee() {
  db.query(
    `SELECT * FROM roles JOIN employees ON employees.id = roles.id;`,
    (err, rolesTableResults) => {
      if (err) {
        console.log(err);
      }
      const newRolesData = rolesTableResults.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));

      const newManager = rolesTableResults.map((employees) => ({
        name: `${employees.first_name} ${employees.last_name}`,
        value: employees.id,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
            validate: validString,
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
            validate: validString,
          },
          {
            type: "list",
            name: "employeeRole",
            message: "What is the employee's role?",
            choices: newRolesData,
          },
          {
            type: "list",
            name: "managers",
            message: "Who is the employee's manager?",
            choices: newManager,
          },
        ])
        .then((data) => {
          db.query(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
            VALUES (?, ?, ?, ?)`,
            [data.firstName, data.lastName, data.employeeRole, data.managers],
            (err) => {
              if (err) {
                console.log(err);
              }
              console.log("Successfully added new employee!");
              init();
            }
          );
        });
    }
  );
}

//updates selected role in table
function updateRole() {
  db.query(`SELECT * FROM employees;`, (err, data) => {
    if (err) {
      console.log(err);
    }

    db.query(`SELECT * FROM roles;`, (err, roles) => {
      if (err) {
        console.log(err);
      }
      const namesList = data.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      const rolesList = roles.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeSelect",
            message: "Who's role would you like to update?",
            choices: namesList,
          },
          {
            type: "list",
            name: "roleSelect",
            message: "What is this employee's new role?",
            choices: rolesList,
          },
        ])
        .then((data) => {
          db.query(
            `UPDATE employees SET employees.role_id = ? WHERE employees.id =?;`,
            [data.roleSelect, data.employeeSelect],
            (err, roles) => {
              if (err) {
                console.log(err);
              }
              console.log("Successfully updated employee's role!");
              init();
            }
          );
        });
    });
  });
}

function viewRoles() {
  db.query(
    `SELECT roles.id, title, salary, departments.department AS department_id FROM roles
    JOIN departments ON departments.id = roles.department_id;`,
    function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
      init();
    }
  );
}

function addRole() {
  db.query(`SELECT * FROM departments;`, (err, data) => {
    if (err) {
      console.log(err);
    }
    const departments = data.map((department) => ({
      name: department.department,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
          validate: validString,
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
          validate: validNumber,
        },
        {
          type: "list",
          name: "departments",
          message: "What department does this role belong to?",
          choices: departments,
        },
      ])
      .then((data) => {
        db.query(
          `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`,
          [data.title, data.salary, data.departments],
          (err, data) => {
            if (err) {
              console.log(err);
            }
            console.log(`Succesfully added a new role to StaffHub!`);
            init();
          }
        );
      });
  });
}

//displays all departments
function viewDepartments() {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    init();
  });
}

//adds a new department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "What is the name of the department?",
        validate: validString,
      },
    ])
    .then((data) => {
      //adds new department to the array of departments for list selection
      db.query(
        `INSERT INTO departments (department) VALUES (?)`,
        data.newDepartment,
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log("Successfully added new department!");
          init();
        }
      );
    });
}

//quits with goodbye message
function quit() {
  console.log(
    chalk.cyan(
      figlet.textSync("Have a Good Day!", { horizontalLayout: "full" })
    )
  );
  db.end();
}

//invokes prompts
init();