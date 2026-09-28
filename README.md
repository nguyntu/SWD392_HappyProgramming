# Happy Programming - Mentor CRUD

## Scope
This is a runnable first CRUD slice based on the supplied Happy Programming requirement:
- Admin: Mentor List supports list/filter/search/show/hide/add/edit.
- Mentor Details supports viewing a mentor.
- Public feature can list mentors and view CV.

The PDF says detailed fields/validation are in `HappyProgramming_Functions.xlsx`; that Excel file was not supplied here. Therefore the Mentor fields in this sample are a minimal implementation and should be aligned with the Excel/supervisor-approved specification before final submission.

## Architecture mapping
React Browser -> React Router/App -> Pages/Components -> Service -> REST API
-> Controller -> Validation/Spring Security Filter -> Service -> Repository (JPA/Hibernate) -> MySQL.
DTOs, Entities, Exceptions and Utils are separated.

## Run backend
1. Create MySQL database with `database.sql` (JPA can also create/update the table).
2. Edit `backend/src/main/resources/application.properties`.
3. Run:
   `cd backend`
   `mvn spring-boot:run`

Backend: http://localhost:8081

## Run frontend
`cd frontend`
`npm install`
`npm run dev`

Frontend: http://localhost:5173

## APIs
### Authentication & User
- `POST   /api/auth/register` (Đăng ký tài khoản mới: Admin, Mentor, Học viên)
- `POST   /api/auth/login` (Đăng nhập, trả về JWT Token và User Info)
- `GET    /api/auth/me` (Lấy thông tin tài khoản hiện tại qua Bearer Token)
- `POST   /api/auth/logout` (Đăng xuất)

### Mentors (CUD yêu cầu quyền ROLE_ADMIN)
- `GET    /api/mentors?keyword=&visible=` (Public)
- `GET    /api/mentors/{id}` (Public)
- `POST   /api/mentors` (Admin only)
- `PUT    /api/mentors/{id}` (Admin only)
- `DELETE /api/mentors/{id}` (Admin only)
- `PATCH  /api/mentors/{id}/visibility?visible=true|false` (Admin only)

## Tài khoản mẫu mặc định (Tự động khởi tạo khi chạy backend)
1. **Admin (Quản trị viên)**:
   - Username: `admin`
   - Password: `admin123`
   - Quyền: `ROLE_ADMIN` (Toàn quyền quản lý mentor, hiển thị/ẩn, thêm, sửa, xóa)
2. **Mentor**:
   - Username: `mentor1`
   - Password: `123456`
   - Quyền: `ROLE_MENTOR`
3. **Học viên**:
   - Username: `student1`
   - Password: `123456`
   - Quyền: `ROLE_USER`

