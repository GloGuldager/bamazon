//Open Bamazon Store ***************************************
//NPM DEPENDENCIES
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var chalk = require("chalk");
var displayTable = require('./tableConstructor');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // User will need to provide their own MySQL password
    password: "",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    bamazon();
});

// first display all of the items available for sale. Include the ids, names, and prices of products for sale.

function bamazon() {

    inquirer
        .prompt({
            name: "welcome",
            type: "confirm",
            message: "\n =================================================== \n         Welcome to Bamazon Grocery & Drug! \n =================================================== \n   \nWould you like to look at the items available for sale? \n",
            default: true
        })
        .then(function (answer) {
            // based on their answer, display items available to purchase
            if (answer.welcome === true) {
                inventory();
            }
            else {
                connection.end();
                //user chooses not to continue. 
                console.log(chalk.green.bold("\nOK. Thank you for visiting. Come back anytime. \nJust enter: node bamazonCustomer.js\n"));
            }
        });
}
//Run Product Inventory to display to User ***************************************
function inventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        displayForManager(res);
        purchasePrompt();
    });
}


//Run Prompt Function to see if user wants to purchase anything ***************************************
function purchasePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?",
        default: true

    }]).then(function (user) {
        if (user.continue === true) {
            purchase();
        } else {
            console.log(chalk.green.bold("Thank you! Come back soon! Just enter: node bamazonCustomer.js"));
            connection.end();
        }
    });
}

// Ask and capture user purchase choice ***************************************

function purchase() {

    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "\nGreat! What is the Item # of the product you would like to purchase?\n"
            },
            {
                name: "units",
                type: "number",
                message: "\nHow many units of the item would you like to purchase?\n"
            },

        ])
        .then(function (selection) {
            // get the information of the chosen item

            // query the database for all items available to purchase
            connection.query("SELECT * FROM products WHERE id=?", selection.itemID, function (err, res) {

                for (var i = 0; i < res.length; i++) {

                    if (selection.units > res[i].stockQuantity) {

                        console.log(chalk.green.bold("==================================================="));
                        console.log(chalk.green.bold("Sorry! Not enough of that item in stock."));
                        console.log(chalk.green.bold("==================================================="));
                        newOrder();

                    } else {
                        //list item information for user for confirm prompt
                        console.log(chalk.green.bold("==================================================="));
                        console.log(chalk.green.bold("Awesome! We can fulfull your order."));
                        console.log(chalk.green.bold("==================================================="));
                        console.log(chalk.green.bold("You've selected:"));
                        console.log(chalk.green.bold("----------------"));
                        console.log(chalk.green.bold("Item: " + res[i].productName));
                        console.log(chalk.green.bold("Department: " + res[i].departmentName));
                        console.log(chalk.green.bold("Price: $" + res[i].price));
                        console.log(chalk.green.bold("Quantity: " + selection.units));
                        console.log(chalk.green.bold("----------------"));
                        console.log(chalk.green.bold("Total: $" + res[i].price * selection.units));
                        console.log(chalk.green.bold("===================================================\n"));

                        var newStock = (res[i].stockQuantity - selection.units);
                        var purchaseId = (selection.itemID);
                        //console.log(newStock);
                        confirmPrompt(newStock, purchaseId);
                    }
                }
            });
        })
}

// Confirm purchase and update inventory ***************************************


function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "\nAre you sure you would like to purchase this item and quantity?\n",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            //if user confirms purchase, update mysql database with new stock quantity by subtracting user quantity purchased.

            connection.query("UPDATE products SET ? WHERE ?", [{
                stockQuantity: newStock
            }, {
                id: purchaseId
            }], function(err, res) {});

            console.log(chalk.green.bold("==================================================="));
            console.log(chalk.green.bold("Your purchase has been completed. Thank you."));
            console.log(chalk.green.bold("==================================================="));
            newOrder();
        } else {
            console.log(chalk.green.bold("==================================================="));
            console.log(chalk.green.bold("No worries. Stop back to shop anytime! \NJust enter: node bamazonCustomer.js"));
            console.log(chalk.green.bold("==================================================="));
            connection.end();
        }
    });
}
function newOrder() {

    inquirer
        .prompt({
            name: "welcome",
            type: "confirm",
            message: "\nWould you like to take another look at the inventory?\n",
            default: true
        })
        .then(function (answer) {
            // based on their answer, display items available to purchase
            if (answer.welcome === true) {
                inventory();
            }
            else {
                connection.end();
                console.log(chalk.green.bold("\n Come back again another time\n \nJust enter: node bamazonCustomer.js\n"))
            }
        });
}
//connect to tableConstructor.js to view table of items
var displayForManager = function (results) {
    var display = new displayTable();
    display.displayInventoryTable(results);
}


