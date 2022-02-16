//const express = require('express');
//Imports and requires the inquirer for command line prompts
const inquirer = require('inquirer');
//Imports and requires mysql2 
const mysql = require('mysql2');
//Imports and requires console.table
const cTable = require('console.table');
//Imports and requires the promise mysql 
//const promiseSQL = require('mysql2/promise');
//Connects to the DB and port
//const db = require('./db/connection');

//const PORT = process.env.PORT || 3001;
//const app = express();
// Express middleware
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// Declares the connection properties that will be used to established the connection
const connectionProperties = {
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'testpasswordforproject',
  database: 'employee_tracker'
};

// Establishes the connection with the database by using the specified information
const db = mysql.createConnection(connectionProperties);

// Checks if the database connection failed or gave an error
// If not logs that connection established and calls for the prompt function
db.connect(err => {
  if (err) {
    console.log(err);
  }
  console.log("Connected to the Database");
  //promptInitiate();
});

//______________PROMPT PLACE HOLDER_________________
/*
const userPrompt = () => {
  //not sure if I need the return see when testing
  return inquirer.prompt ([
    {

    },
  ])
  .then(answer =>{
    //looks at the pormpt answer then will switch to the right case and execute that code
  })
};*/


//__________________VIEW ALL_________________________
//View all Department function
const viewAllDepartments = () =>{
  db.query(`SELECT * FROM department`, (err, rows) => {
      console.table(rows);
  });
};
viewAllDepartments();
//View all Roles function
const viewAllRoles = () => {
  db.query(`SELECT * FROM department 
          RIGHT JOIN role ON role.department_id = department.id;`, (err, rows) =>{
      console.table(rows);
  })
};
//view all employees function
const viewAllEmployees = () =>{
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.role_title, role.salary, department.department_name,
  CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee 
  INNER JOIN role on role.id = employee.role_id 
  INNER JOIN department on department.id = role.department_id left 
  join employee e on employee.manager_id = e.id;`, (err, rows) => {
      console.table(rows);
  });
};

//________________ADD__________________________________
//Create a department function
const addDepartment= () =>{
  const sql = `INSERT INTO department (department_name)
              VALUES(?)`;
  //const params = ['HR'];

  db.query(sql, params, (err, result) => {
      if(err) {
          console.log(err);
      }
      console.log(result);
  })
  viewAllDepartments();
};

//Add a role function
const addRole = () =>{
  const sql = `INSERT INTO role (role_title, salary, department_id)
              VALUES (?,?,?)`;
  //const params = ['Manager', 80000, 4];

  db.query(sql, params, (err, result) => {
      if(err) {
          console.log(err);
      }
      console.log(result);
  })
  viewAllRoles();
};

//Add an employee function
const addEmployee = () => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
              VALUES(?,?,?,?)`;
  const params = ['First', 'Last', 2, 4];

  db.query(sql, params, (err, result) => {
      if(err) {
          console.log(err);
      }
      console.log(result);
  })
  viewAllEmployees();
};
/*
//________________UPDATE__________________________________
//Update an employee role, by selecting the employee
const updateEmployeeRole = () => {
  let employeeArray = [];
  let roleArray = [];

  promiseSQL
    .createConnection(connectionProperties)
    .then(db => {
      return Promise.all([
        db.query("SELECT id, title FROM role ORDER BY title ASC"),
        db.query(
          "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"
        ),
      ]);
    })
    .then(([role, employee]) => {
      role.map(role => roleArray.push(role.title));

      employee.map(employee => employeeArray.push(employee.employee));

      return Promise.all([role, employee]);
    })
    /*.then(([roles, employees]) => {
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            choices: employeeArray,
            message: "Which employee's role do you want to update?",
          },
          {
            name: "role",
            type: "list",
            message: "Which role do you want to assign the selected employee?",
            choices: roleArray,
          },
        ])
        .then(answer => {
          let role_id;
          let employee_id;

          for (let i = 0; i < roles.length; i++) {
            if (answer.role == roles[i].title) {
              role_id = roles[i].id;
            }
          }

          for (let i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
              employee_id = employees[i].id;
            }
          }

          databaseConnection.query(
            `UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`,
            (err, res) => {
              if (err) {
                console.log(err);
              }
              promptInitiate();
            }
          );
        });
    });
}
*/
