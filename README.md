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
GET    /api/mentors?keyword=&visible=
GET    /api/mentors/{id}
POST   /api/mentors
PUT    /api/mentors/{id}
DELETE /api/mentors/{id}
PATCH  /api/mentors/{id}/visibility?visible=true|false

## Note
The security filter is a structural placeholder. Once Sign in/User Authorization is implemented, replace it with the project's real authentication/JWT flow.
