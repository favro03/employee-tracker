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
// Imports and requires the promise mysql npm package
const promiseSQL = require("promise-mysql");
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


//__________________VIEW ALL_________________________
//View all Department function
const viewAllDepartments = () =>{
  db.query(`SELECT * FROM department`, (err, rows) => {
    console.log();
      console.log('=========================');
      console.log('     All Departments     ');
      console.log('=========================');
      console.table(rows);
  });
  userPrompt();
};

//view all managers
const viewAllManagers = () =>{
  db.query(`SELECT * From manager;`, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.log();
    console.log('=========================');
    console.log('     All Managers        ');
    console.log('=========================');
    console.table(rows);
  })
  userPrompt();
}

//View all Roles function

const viewAllRoles = () => {
  db.query(`SELECT role.id, role.role_title, role.salary, department.department_name FROM role 
          Left JOIN department ON role.department_id = department.id;`, (err, rows) =>{
            console.log();
      console.log('=========================');
      console.log('        All Roles        ');
      console.log('=========================');
      console.table(rows);
  })
  userPrompt();
};
//view all employees function
const viewAllEmployees = () =>{
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.role_title, department.department_name, role.salary,
  CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee 
  INNER JOIN role on role.id = employee.role_id 
  INNER JOIN department on department.id = role.department_id left 
  join employee e on employee.manager_id = e.id;`, (err, rows) => {
      console.log();
      console.log('=========================');
      console.log('     All Employees       ');
      console.log('=========================');
      console.table(rows);
  });
  userPrompt();
};

//________________ADD__________________________________
//Create a department function
const addDepartment= () =>{
  inquirer.prompt ([
    {
      type: 'input',
      name: 'departmentName',
      message: "What is the name of the department?",
      validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log ("Please enter the name of the department!");
            return false; 
        }
      }
    },
  ])
  .then(answer =>{
      const sql = `INSERT INTO department (department_name)
                  VALUES('${answer.departmentName}')`;
    db.query(sql, (err, result) => {
      if(err) {
          console.log(err);
      }
  })
  //viewAllDepartments();  
  userPrompt();
  });
};

//Add a role function
const addRole = () =>{
  inquirer.prompt ([
    {
      type: 'input',
      name: 'roleTitle',
      message: "What is the title of the role?",
      validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log ("Please enter the role title!");
            return false; 
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "What is the salary for this role?",
      validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log ("Please enter salary!");
            return false; 
        }
      }
    },
    {
      type: 'input',
      name: 'departmentId',
      message: "What is the department id for this role?",
      validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log ("Please enter a department id for the role!");
            return false; 
        }
      }
    },
  ])
  .then(answer =>{
      const sql = `INSERT INTO role (role_title, salary, department_id) 
      VALUES ('${answer.roleTitle}','${answer.salary}','${answer.departmentId}')`;
    db.query(sql, (err, result) => {
      if(err) {
          console.log(err);
      }
  })
  //viewAllRoles();  
  userPrompt();
  });
};

//Add an employee function
const addEmployee = () => {
  let roleArray = [];
  let managerArray = [];

  db.query("SELECT * FROM role", (err, results) => {
    if (err) {
      console.log(err);
    }
    return results.map(role => roleArray.push(`${role.role_title}`));
  });

  db.query(`SELECT CONCAT(first_name, ' ' ,last_name) AS manager FROM manager;`, (err, results) => {
      if (err) {
        console.log(err);
      }

      results.map(manager => {
        return managerArray.push(`${manager.manager}`);
      });
    }
  );

  inquirer
    .prompt([
      {
        type: "input",
        message: "What id the employee's first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name",
      },
      {
        type: "rawlist",
        message: "What is the employee role?",
        name: "role",
        choices: roleArray,
      },
      {
        name: "manager",
        type: "rawlist",
        message: "What is the employee's manager name?",
        choices: managerArray,
      },
    ])
    .then(answer => {
      const role_id = roleArray.indexOf(answer.role) + 1;

      const manager_id = managerArray.indexOf(answer.manager) + 1;

      const newEmployee = {
        first_name: answer.first_name,
        last_name: answer.last_name,
        manager_id: manager_id,
        role_id,
      };

      db.query(
        "INSERT INTO employee SET ?;",
        newEmployee,
        err => {
          if (err) {
            console.log(err);
          }

          userPrompt();
        }
      );
    });
}
//______________PROMPT PLACE HOLDER_________________

const userPrompt = () => {
  //not sure if I need the return see when testing
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'choice',
      message: "What would you like to do?",
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View All Managers','Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Exit']    
    },
  ])
  .then(promptAnswer =>{
    //looks at the pormpt answer then will switch to the right case and execute that code
    switch(promptAnswer.choice){
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'View All Managers':
        viewAllManagers();
        break;
      case 'Add A Department': 
        addDepartment();
        break;
      case 'Add A Role': 
        addRole();
        break;
      case 'Add An Employee': 
        addEmployee();
        break;
      case 'Update An Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        db.end();
        break;
    }
  })
};

userPrompt();