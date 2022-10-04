# Ứng dụng hiển thị trực quan đăng ký môn học SGU

## Yêu cầu

<pre>
node -v
v14
</pre>

<pre>
node -v
v16
</pre>

Nếu bạn không biết nodejs là gì thì có thể download tại [link ở đây](https://nodejs.org/en/)

## Mục tiêu

Trước khi diễn ra đăng ký môn học, sinh viên những năm 2017 thường sẽ được vào để coi các môn trước. Như vậy chúng ta có thể vào lấy dữ liệu từng môn để có thể hiện thị thời khóa biểu.

## Chức năng chính

- Hiển thị dữ thời khóa biểu
- Xóa các môn đã chọn
- Nếu bạn chọn 1 môn khác mà trùng thời khóa biểu thì cũng sẽ báo trùng luôn và ô chọn bị disabled, hoặc nếu bạn chọn môn đó rồi thì sẽ không được chọn lại lần nữa mà phải uncheck môn trước đó.
- Export ra file txt
- Nếu import môn có rồi thì sẽ báo trùng và không import vào
- Filter, phân trang, màu sắc,...
- Hiển thị thời khóa biểu theo tuần
- Hover để đọc nhiều dữ liệu hơn

## Cài đặt

### Download source

`git clone https://github.com/Ram4GB/SGUTimeTable.git`

Hoặc nếu bạn không cài git thì có thể [Download zip file](https://github.com/Ram4GB/SGUTimeTable/archive/refs/heads/master.zip)

### Mở folder source

`cd /[đường dẫn bạn tại source]/SGUTimeTable`

### Mở source lên chạy lệnh

`npm i`

Đợi cho NodeJS cài tất cả thư viên

### Kết quả sau khi chạy

```
Compiled successfully!

You can now view tour-management in the browser.

Local: http://localhost:3001
 On Your Network: http://172.30.176.1:3001

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### Hướng dẫn sử dụng test

Mình có tạo 1 thư mục tên là data, các bạn vào từng file copy hết nội dung bên trong và paste vào ô `Thêm mới 1 môn`

1. Nhấn vào nút này
   ![](/img/1.png)

2. Copy nội dung trong mon1.txt vào input
   ![](/img/2.png)

3. Làm tương tự như mon1.txt với mon2.txt và mon3.txt nữa nhé

### Kết quả test

![](/img/3.png)

![](/img/4.png)

![](/img/5.png)

![](/img/6.png)

![](/img/7.png)

### Cài đặt từ thông tin đào tạo chi tiết

<strong>🔥 🔥 [Tại đây](https://github.com/Ram4GB/SGUTimeTable/tree/features/ui_table/Intro)🔥 🔥 </strong>

## Lời kết

Hiện tại mình không còn maintain source này nữa, các bạn có thể dùng nó và cải tiến nó nhé. Mong là nó sẽ là ý tưởng trong đồ án của các bạn. 👨‍🚀👨‍🚀

## Contributor

👨 Thien Truong (https://github.com/truongdinhthien)
