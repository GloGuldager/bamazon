// ### Challenge #2: Manager View (Next Level)

// * Create a new Node application called `bamazonManager.js`. Running this application will:

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

//Setup Required NPM packages ***************************************
var mysql = require("mysql");
var inquirer = require("inquirer");
// var Table = require("cli-table");
var chalk = require("chalk");
var displayTable = require('./tableConstructor');
// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your actionname
    user: "root",

    // User will need to provide their own MySQL password
    password: "",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the startManager function after the connection is made to prompt the action
    startManager();
});

// display choices of queries manager can make
//setup call for each choice function in if/else statement

function startManager() {

    inquirer
        .prompt({
            name: "mgrAction",
            type: "rawlist",
            message: "\nHello Bamazon Manager. What action would you like to take with the inventory?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete Product", "End Inventory Review"]
        })
        .then(function (action) {
            // based on their answer, display items available to purchase
            if (action.mgrAction === "View Products for Sale") {
                invView();
            } else if (action.mgrAction === "View Low Inventory") {
                invLow();
            } else if (action.mgrAction === "Add to Inventory") {
                invAdd();
            } else if (action.mgrAction === "Add New Product") {
                addItem();
            } else if (action.mgrAction === "Delete Product") {
                deleteItem();
            } else {
                connection.end();
            }

        });
}
//use tableConstructor.js to run table

function invView() {
    // query the database for all items available to purchase
    connection.query("SELECT * FROM products", function (err, res) {
        displayForManager(res);
        startManager();
    });
}

function invLow() {

    // query the database for all items available to purchase and find items with low inventory
    connection.query("SELECT * FROM products WHERE stockQuantity <= 5", function (err, res) {
        console.log(chalk.green.bold("\nAll products with 5 or less units still remaining.\n");
        displayForManager(res);
        startManager();
    });
}

// run Add Item to Inventory function for manager
function invAdd() {

    inquirer.prompt([{

        type: "input",
        name: "Id",
        message: "\nPlease enter the ID number of the item to add units to.",
    },
    {
        type: "input",
        name: "Units",
        message: "\nHow many units would you like to add to inventory?",

    }
    ]).then(function (mgrAdd) {

        connection.query('SELECT * FROM products WHERE ?', { ID: mgrAdd.Id }, function (err, res) {
            itemQuantity = res[0].stockQuantity + parseInt(mgrAdd.Units);

            connection.query("UPDATE products SET ? WHERE ?", [{
                stockQuantity: itemQuantity
            }, {
                ID: mgrAdd.Id
            }], function (err, res) { });

            connection.query('SELECT * FROM products WHERE ?', { ID: mgrAdd.Id }, function (err, res) {
                console.log(chalk.green.bold('\n The Stock Quantity was updated and can be viewed in the Inventory\n');
                displayForManager(res);
                startManager();
            });
        });
    });
}

//function to add a NEW ITEM to the inventory
function addItem() {

    inquirer.prompt([{

        type: "input",
        name: "itemName",
        message: "\nPlease enter the name of the new item.",
    },
    {
        type: "input",
        name: "Dept",
        message: "\nPlease enter the department for the new item.",
    },
    {
        type: "input",
        name: "Price",
        message: "\nPlease enter the price of the new item (0.00).",
    },
    {
        type: "input",
        name: "Units",
        message: "\nPlease enter the number of units of the new item.",
    }

    ]).then(function (mgrNew) {

        //connect to database, insert column data with input from user

        connection.query("INSERT INTO products SET ?", {
            productName: mgrNew.itemName,
            departmentName: mgrNew.Dept,
            price: mgrNew.Price,
            stockQuantity: mgrNew.Units
        }, function (err, res) { });
        console.log(chalk.green.bold('\n  The new item has been added. \n');
        connection.query('SELECT * FROM products', function (err, results) {
            displayForManager(results);
            startManager();
        });
    })
}

//function for manager to DELETE an item if desired
function deleteItem() {
    inquirer.prompt([{
    name: "deleteID",
    type: "input",
    message: " \nEnter the Item ID of the item you wish to delete",

}]).then(function(answer) {

    connection.query("DELETE FROM products WHERE ?", {
        ID: answer.deleteID
    }, function(err, res) {
        console.log(chalk.green.bold('\n  The product was deleted \n');
        connection.query('SELECT * FROM products', function(err, res){  
                displayForManager(res);
                startManager();
            });
    });
});
}


//use tableconstructor.js to display table and inventory
var displayForManager = function (results) {
        var display = new displayTable();
        display.displayInventoryTable(results);
    }


