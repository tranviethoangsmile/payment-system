# payment-system
- nhưng yêu cầu chưa thực hiện được: 
 + Sử dụng database postgres [Vì máy của em cài postgres bị lỗi nên em dùng Mysql];
 + Chưa dùng transaction
 + chưa sử dụng redis
==================================
TẠO DATABASE VỚI TÊN: payment_system
CREATE DATABASE payment_system
==================================
CÁCH RUN SERVER: 
- Sau khi clone từ git về máy tính. Mở file lên với vs code.
- Sau đó vào terminal chạy câu lệnh: >> npm start
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

---------
Tạo procedure:
delimiter $$
DROP PROCEDURE IF EXISTS bill_save;
CREATE PROCEDURE bill_save (IN user_name VARCHAR(255), IN product_id INT(11),IN price INT(11))
BEGIN 
	declare exit handler for sqlexception rollback;
	start transaction;
    INSERT INTO users (name) VALUES (user_name);
    INSERT INTO product_transactions(price,user_id,product_id)
	VALUES (price,LAST_INSERT_ID(),product_id);
	commit;
END;
delimiter;
==================================
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
