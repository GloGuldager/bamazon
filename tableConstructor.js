// Displays Inventory Table for Manager, Results from a SELECT query are passed in as parameter and used 
var Table = require('cli-table');
var chalk = require("chalk");
var displayTable = function() {

    this.table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [6, 20, 20, 8, 8]
    });

    this.displayInventoryTable = function(results) {
    	this.results = results;
	    for (var i=0; i <this.results.length; i++) {
	        this.table.push(
	            [this.results[i].id, this.results[i].productName, this.results[i].departmentName, '$'+ this.results[i].price, this.results[i].stockQuantity] );
        }
        console.log("");
        console.log(chalk.green.bold("============== Current Bamazon Grocery & Drug Inventory =============="));
        console.log("");
        console.log('\n' + this.table.toString());
        console.log("");

	};
}
module.exports = displayTable;
