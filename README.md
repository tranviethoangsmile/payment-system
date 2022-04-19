# payment-system
==================================
TẠO DATABASE VỚI TÊN: payment_system
CREATE DATABASE payment_system
CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE products (
    id int NOT NULL AUTO_INCREMENT,
    product_name varchar(255) NOT NULL,
    price float NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE product_transactions (
	id int NOT NULL AUTO_INCREMENT,
    price float NOT NULL,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

==================================
tạo dữ liệu:
---------------
Product: 
insert into payment_system.products(product_name, price) values ('iphone X', '15000');
insert into payment_system.products(product_name, price) values ('iphone 11', '16000');
insert into payment_system.products(product_name, price) values ('iphone 12', '18000');
insert into payment_system.products(product_name, price) values ('iphone 13', '30000');
insert into payment_system.products(product_name, price) values ('samsung s10', '15000');
insert into payment_system.products(product_name, price) values ('xiami ', '15000');
insert into payment_system.products(product_name, price) values ('LG v10', '15000');
==================================
CÁCH RUN SERVER: 
- Sau khi clone từ git về máy tính. Mở file lên với vs code.
- Sau đó vào terminal chạy câu lệnh: >> npm start

URL: http://localhost:3000
==================================
Danh sách API sử dụng:

[GET] >> /api/product/getall  >> nhận tất cả sản phẩm

[GET] >> /api/product/:tagId  >> Nhận sản phẩm qua ID
    
[POST] >> /api/product/create >> Tạo sản phẩm mới
  
[PATCH] >>  /api/product/update >> cập nhật sản phẩm
  
[GET] >>  /api/product/delete/:tagId >> xoá sản phẩm bằng ID
  
[POST] >> /api/product/search' >> tìm sản phẩm theo tên (gần đúng)
  
[POST] >> /api/transaction/create >> tạo dữ liệu mua hàng
  
[GET] >> /api/transaction/:tagId' >> nhận danh sách sản của 1 user đã mua.
