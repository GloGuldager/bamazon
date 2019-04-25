DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

create table products (
id INT NOT NULL auto_increment,
productName varchar (45) null,
departmentName varchar (25) null,
price INT null,
stockQuantity INT null,
primary key (id)
);

insert into products (productName, departmentName, price, stockQuantity)
values ("milk", "grocery", 3, 10);

insert into products (productName, departmentName, price, stockQuantity)
values ("juice", "grocery", 2, 10);

insert into products (productName, departmentName, price, stockQuantity)
values ("bread", "grocery", 2, 20);

insert into products (productName, departmentName, price, stockQuantity)
values ("toothpaste", "drug", 6, 15);

insert into products (productName, departmentName, price, stockQuantity)
values ("aspirin", "drug", 12, 20);

insert into products (productName, departmentName, price, stockQuantity)
values ("bandaid", "drug", 5, 15);

insert into products (productName, departmentName, price, stockQuantity)
values ("earbuds", "electronic", 15, 20);

insert into products (productName, departmentName, price, stockQuantity)
values ("charger", "electronic", 7, 10);

insert into products (productName, departmentName, price, stockQuantity)
values ("batteries", "electronic", 9, 20);

insert into products (productName, departmentName, price, stockQuantity)
values ("shorts", "clothing", 20, 10);

select * from products;


select * from products;

