// Import and require inquirer,mysql2,console.table,util,config.
const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { promisify } = require('util');
const connection = require('./config/connection');

connection.connect((error) => {
    if (error) throw error;

    askUser();
});

const query = promisify(connection.query.bind(connection));

const  askUser = () => {
    inquirer.prompt([
        {
          name: 'choices',
          type: 'list',
          message: 'What would you like to do ❓',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Update an employee role',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Exit ❌'
            ]
        }
      ])
      .then((answers) => {
        const {choices} = answers;
  
          if (choices === 'View all departments') {
              viewAllDepartments();
          }
  
          if (choices === 'View all roles') {
            viewAllRoles();
          }
  
          if (choices === 'View all employees') {
              viewAllEmployees();
          }
  
          if (choices === 'Update an employee role') {
              updateEmployeeRole();
          }
  
          if (choices === 'Add a department') {
              addDepartment();
          }
  
          if (choices === 'Add a role') {
              addRole();
          }
  
          if (choices === 'Add an employee') {
              addEmployee();
          }
  
          if (choices === 'Exit ❌') {
              connection.end();
          }
    });
  };

// View all Departments
const viewAllDepartments = () => {
    const sql = `SELECT departments.id AS id, departments.name AS departments FROM departments`; 
      connection.query(sql, (error, response) => {
      if (error) throw error;
      console.log(`Here is all the DEPARTMENTS 📋:`);
      console.table(response);
      askUser();
    });
  };

// View all Roles
const viewAllRoles = () => {
    console.log(`Here is all the ROLES 📋:`);
    const sql = `SELECT id AS id, title AS title, salary As salary FROM roles;`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        console.table(response);
        askUser();
    });
  };

// View all Employees
const viewAllEmployees = () => {
    let sql = `SELECT empl.id, empl.first_name, empl.last_name, roles.title, departments.name AS department, roles.salary, CONCAT_WS(' ', manag.first_name, manag.last_name) AS manager FROM (((employees empl
        LEFT JOIN roles ON empl.role_id = roles.id)
        LEFT JOIN departments ON roles.department_id = departments.id)
        LEFT JOIN employees manag ON manag.id = empl.manager_id)
        ORDER BY empl.id;`;
  
    connection.query(sql, (error, response) => {
      if (error) throw error;
      console.log(`Here is all the EMPLOYEES 📋:`);
      console.table(response);
      askUser();
    });
  };


// Update Employee Role

const getEmployeesList = async () => {
  const results = await query(`SELECT id AS value, CONCAT_WS(' ', first_name, last_name) AS name FROM employees;`);

  return JSON.parse(JSON.stringify(results));
}

const getRolesList = async () => {
  const results = await query(`SELECT id AS value, title AS name FROM roles;`);

  return JSON.parse(JSON.stringify(results));
}

const getEmployeeRoleById = async (employeeId) => {
  const results = await query(`SELECT title FROM roles
      WHERE id = (SELECT role_id FROM employees WHERE id = ?);`, [employeeId]);

  return results[0].title;
}

const updateEmployeeRole = async () => {
  const employeesList = await getEmployeesList();

  const { employeeId } = await inquirer.prompt({
          name: 'employeeId',
          type: 'list',
          message: `Select the employee:`,
          choices: employeesList,
      });

  const currentRole = await getEmployeeRoleById(employeeId);

  const { isContinue } = await inquirer.prompt({
      name: 'isContinue',
      type: 'confirm',
      message: `The employee's current role is '${currentRole}'. Do you want update it?`,
  });

  if (isContinue) {
      const rolesList = await getRolesList();

      const { roleId } = await inquirer.prompt({
          name: 'roleId',
          type: 'list',
          message: `Select the new employee's role`,
          choices: rolesList,
      });

      await query(`UPDATE employees SET role_id = ? WHERE id = ?;`, [roleId, employeeId]);

      console.log(`The employee's role updated!\n`);
  }

  askUser();
}

// Add a department
const addDepartment = () => {
    inquirer
      .prompt([
        {
          name: 'addDepartment',
          type: 'input',
          message: `What is the department's name?`,
        }
      ])
      .then((answer) => {
        let sql = `INSERT INTO departments (name) VALUES (?)`;
        connection.query(sql, answer.addDepartment, (error, response) => {
          if (error) throw error;
          console.log(`Your new department was created successfully.✔️`);
          viewAllDepartments();
        });
      });
  };

//  Add role 
const addRole = () => {
    const sql = 'SELECT * FROM departments'
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let deptChoiceArray = [];
        response.forEach((department) => {deptChoiceArray.push(department.name);});
        inquirer
          .prompt([
            {
              name: 'departmentRolesName',
              type: 'list',
              message: `Select the department for this role:`,
              choices: deptChoiceArray
            }
          ])
          
          .then((answer) => {
            if (answer.departmentRolesName === 'Create Department') {
              this.addDepartment();
            } else {
              addNewRoles(answer);
            }
          });
  
        const addNewRoles = (departmentData) => {
          inquirer
            .prompt([
              {
                name: 'newRole',
                type: 'input',
                message: `What is the role's title?`,
              },
              {
                name: 'salary',
                type: 'input',
                message: `What is the role's salary 💲?`,
              }
            ])
            .then((answer) => {
              let createdRole = answer.newRole;
              let departmentId;
  
              response.forEach((department) => {
                if (departmentData.departmentRolesName === department.name) {departmentId = department.id;}
              });
  
              let sql =   `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
              let crit = [createdRole, answer.salary, departmentId];
  
              connection.query(sql, crit, (error) => {
                if (error) throw error;
                console.log(`The new role has been created successfully ✔️`);
                askUser();
              });
            });
        };
      });
    };

//  Add employee

const employeeQuestions = [
    {
      type: "input",
      message: "what is the employee's first name?",
      name: "firstName",
    },
    {
      type: "input",
      message: "What is the employee's last name?",
      name: "lastName",
    },
    {
      type: "list",
      message: "What is the employee's role_id?",
      name: "role_id",
      choices: async () => {
        let res = await query(`SELECT * FROM roles`);
        res = res.map((row) => {
          return {
            name: row.title,
            value: row.id,
          };
        });
        return res;
      },
    },
  ];

async function addEmployee() {
    let { firstName, lastName, role_id } = await inquirer.prompt(
      employeeQuestions
    );
    try {
      let res = await query(
        `INSERT INTO employees (first_name, last_name, role_id) VALUES ('${firstName}', '${lastName}', ${role_id})`
      );
      viewAllEmployees();
    } catch (err) {
      console.error(err);
    }
  }


