//Imports and requires the inquirer for command line prompts
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


// Declares the connection properties that will be used to established the connection
const connectionProperties = {
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'testpasswordforproject',
  database: 'employee_tracker'
};

// Establishes the connection with the database by using the obve information
const db = mysql.createConnection(connectionProperties);

// Checks if the database connection failed or gave an error
// If not logs that connection established and calls for the prompt function
db.connect(err => {
  if (err) {
    console.log(err);
  }
  //console.log("Connected to the Database");
  userPrompt();
});


//__________________VIEW ALL FUNCTIONS_________________________
//View all Department function
const viewAllDepartments = () =>{
  db.query(`SELECT * FROM department`, (err, rows) => {
    if(err){
      console.log(err);
    }
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
    if(err){
      console.log(err);
    }
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
  CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager FROM employee 
  INNER JOIN role on role.id = employee.role_id 
  INNER JOIN department on department.id = role.department_id 
  LEFT join manager on employee.manager_id = manager.id;`, (err, rows) => {
    if(err){
      console.log(err);
    }
    console.log();
    console.log('=========================');
    console.log('     All Employees       ');
    console.log('=========================');
    console.table(rows);
  });
  userPrompt();
};

const viewEmployeesByManager = () => {
  db.query(`SELECT CONCAT(manager.first_name, ' ' ,manager.last_name) AS Manager, CONCAT(employee.first_name, ' ' ,employee.last_name) AS Employee FROM manager RIGHT JOIN employee ON manager.id = employee.manager_id;`, (err,rows) => {
    if(err){
      console.log(err);
    }
    console.log();
    console.log('=========================');
    console.log('   Employees by Manager  ');
    console.log('=========================');
    console.table(rows);
  });
  userPrompt();
};
const viewEmployeesByDepartment= () => {
  db.query(`SELECT department.department_name AS Department, CONCAT(employee.first_name, ' ' ,employee.last_name) AS Employee FROM employee 
  INNER JOIN role ON role.id = employee.role_id 
  INNER JOIN department ON department.id = role.department_id;`, (err,rows) => {
    if(err){
      console.log(err);
    }
    console.log();
    console.log('=========================');
    console.log(' Employees by Department ');
    console.log('=========================');
    console.table(rows);
  });
  userPrompt();
};
const viewDepartmentBudget = () =>{
  db.query(`SELECT department.department_name AS department, SUM(salary) AS budget FROM  role 
  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id;`, (err, rows) => {
    if (err){
      console.log(err);
    }
    console.log();
    console.log('=========================');
    console.log('    Department Budget    ');
    console.log('=========================');
    console.table(rows);
  });
  userPrompt();
};

//________________ADD NEW FUNCTIONS__________________________________
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
  let departmentArr = [];
  db.query(`SELECT * FROM department;`, (err, results) => {
    if (err) {
      console.log(err);
    }

    results.map(department => {
      return departmentArr.push(`${department.department_name}`);
    });
  }
);
  inquirer.prompt ([
    {
      type: 'input',
      name: 'roleTitle',
      message: "What is the Role you want to add?",
      validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log ("Please enter the new role!");
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
      type: 'rawlist',
      name: 'departmentChoice',
      message: "What is the department id for this role?",
      choices: departmentArr,
    },
  ])
  .then(answer =>{
      departmentID = departmentArr.indexOf(answer.departmentChoice) + 1;
      const sql = `INSERT INTO role (role_title, salary, department_id) 
      VALUES ('${answer.roleTitle}','${answer.salary}','${departmentID}')`;
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
        type: "rawlist",
        message: "What is the employee's manager name?",
        name: "manager",
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

      db.query(`INSERT INTO employee SET ?;`, newEmployee, err => {
          if (err) {
            console.log(err);
          }

          userPrompt();
        }
      );
    });
}

//________________UPDATE FUNCTIONS__________________________________
//function to update an employee's role
const updateEmployeeRole = () => {
  let employeeArr = [];
  let roleArr = [];
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, employee.role_id, role.role_title AS title FROM employee JOIN role ON employee.role_id = role.id;`, (err, rows) => {
        if (err) {
          console.log(err);
        }
        inquirer.
          prompt([
          {
            name: 'employeeSelection',
            type: 'rawlist',
            message: "What employee needs updating?",
            choices: function() {
                for(let i=0; i < rows.length; i++) {
                    employeeArr.push(rows[i].Employee);
                }
                return employeeArr;
            },
            
        },
        {
            name: 'role',
            type: 'rawlist',
            message: "update the chosen role for the chosen person",
            choices: function() {
                for(let j=0; j < rows.length; j++) {
                    roleArr.push(rows[j].title);
                }
                return roleArr;
            },
        }
      ])
    .then(answer =>{
       
        let roleID = roleArr.indexOf(answer.role) + 1;
        let chosenItem = employeeArr.indexOf(answer.employeeSelection) + 1;
        
        db.query (`UPDATE employee SET role_id = ${roleID} WHERE id = ${chosenItem};`), (err,res) => {
          if (err) {
            console.log(err);
          }
        }
   
    userPrompt();
    
      });
  });
}

//Update employee manager
const updateEmployeeManager = () => {
  let employeeArr = [];
  let managerArr = [];
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager  FROM employee JOIN manager ON employee.manager_id = manager.id;`, (err, rows) => {
        if (err) {
          console.log(err);
        }
        inquirer.
          prompt([
          {
            name: 'employeeSelection',
            type: 'rawlist',
            message: "What employee needs updating?",
            choices: function() {
                for(let i=0; i < rows.length; i++) {
                    employeeArr.push(rows[i].Employee);
                }
                return employeeArr;
            },
            
        },
        {
            name: 'manager',
            type: 'rawlist',
            message: "update the chosen role for the chosen person",
            choices: function() {
                for(let j=0; j < rows.length; j++) {
                    managerArr.push(rows[j].Manager);
                }
                return managerArr;
            },
        }
      ])
    .then(answer =>{
       
        let managerID = managerArr.indexOf(answer.manager) + 1;
        let chosenItem = employeeArr.indexOf(answer.employeeSelection) + 1;
        
        db.query (`UPDATE employee SET manager_id = ${managerID} WHERE id = ${chosenItem};`), (err,res) => {
          if (err) {
            console.log(err);
          }
        }
   
    userPrompt();
    
      });
  });
}
//______________DELETE FUNCTIONS_________________________
// Delete an Employee
const deleteEmployee = () => {
  let employeeArr = [];
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS Employee FROM employee;`, (err, rows) => {
        if (err) {
          console.log(err);
        }
        inquirer.
          prompt([
          {
            name: 'employeeSelection',
            type: 'rawlist',
            message: "What employee do you want to remove?",
            choices: function() {
                for(let i=0; i < rows.length; i++) {
                    employeeArr.push(rows[i].Employee);
                }
                return employeeArr;
            },
        },
      ])
    .then(answer =>{
      let chosenItem = employeeArr.indexOf(answer.employeeSelection) + 1;
        
      db.query (`DELETE FROM employee WHERE employee.id = ${chosenItem};`), (err,res) => {
        if (err) {
          console.log(err);
        }
      }
   
    userPrompt();
    
    });
  });
}
// Delete a role
const deleteRole = () => {
  let roleArr = [];
  db.query(`SELECT id, role_title AS role  FROM role;`, (err, rows) => {
        if (err) {
          console.log(err);
        }
        inquirer.
          prompt([
          {
            name: 'roleSelection',
            type: 'rawlist',
            message: "What role do you want to remove?",
            choices: function() {
                for(let i=0; i < rows.length; i++) {
                    roleArr.push(rows[i].role);
                }
                return roleArr;
            },
        },
      ])
    .then(answer =>{
      let chosenItem = roleArr.indexOf(answer.roleSelection) + 1;
        
      db.query (`DELETE FROM role WHERE role.id = ${chosenItem};`), (err,res) => {
        if (err) {
          console.log(err);
        }
      }
   
    userPrompt();
    
    });
  });
}
// Delete a department
const deleteDepartment = () => {
  let departmentArr = [];
  db.query(`SELECT id, department_name AS department  FROM department;`, (err, rows) => {
        if (err) {
          console.log(err);
        }
        inquirer.
          prompt([
          {
            name: 'departmentSelection',
            type: 'rawlist',
            message: "What department do you want to remove?",
            choices: function() {
                for(let i=0; i < rows.length; i++) {
                    departmentArr.push(rows[i].department);
                }
                return departmentArr;
            },
        },
      ])
    .then(answer =>{
      let chosenItem = departmentArr.indexOf(answer.departmentSelection) + 1;
        
      db.query (`DELETE FROM department WHERE department.id = ${chosenItem};`), (err,res) => {
        if (err) {
          console.log(err);
        }
      }
   
    userPrompt();
    
    });
  });
}
//______________USER PROMPT______________________________

const userPrompt = () => {
  //not sure if I need the return see when testing
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'choice',
      message: "What would you like to do?",
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View All Managers', 'Veiw Employee by Manager', 'View Employee by Department', 'View Department Budget', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Update An Employee Manager', 'Remove an Employee', 'Remove a Role', 'Remove a Department', 'Exit']    
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
      case 'Veiw Employee by Manager':
        viewEmployeesByManager();
        break;
      case 'View Employee by Department':
        viewEmployeesByDepartment();
        break;
      case 'View Department Budget':
        viewDepartmentBudget();
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
      case 'Update An Employee Manager':
        updateEmployeeManager();
        break;
      case 'Remove an Employee':
        deleteEmployee();
        break;
      case 'Remove a Role':
        deleteRole();
        break;
      case 'Remove a Department':
        deleteDepartment();
        break;
      case 'Exit':
        db.end();
        break;
    }
  })
};
