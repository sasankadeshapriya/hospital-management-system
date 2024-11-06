-- ================================================================================================================================================================================      
-- get all doctors

CREATE OR REPLACE VIEW vw_Doctors AS
      SELECT 
            D.DoctorID,
            UA.Name,
            D.Specialization,
            D.Status AS "Employeement Status",
            D.DOJ AS "Date of join",
            UA.Email,
            UA.Address,
            UA.Photo,
            UA.DOB,
            UA.ContactNumber,
            DPT.DepartmentID,
            DPT.DepartmentName,
            CAST(
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'AvailableDay', DAV.AvailableDay,
                        'StartTime', DAV.StartTime,
                        'EndTime', DAV.EndTime,
                        'RoomNO', DAV.RoomNO
                    )
                ) AS JSON
            ) AS Availability
      FROM Doctors D 
      INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
      INNER JOIN Departments DPT ON D.DepartmentID = DPT.DepartmentID
      INNER JOIN DoctorAvailability DAV ON D.DoctorID = DAV.DoctorID
      WHERE D.isActive = 1
      GROUP BY 
            D.DoctorID,
            UA.Name,
            D.Specialization,
            D.Status,
            D.DOJ,
            UA.Email,
            UA.Address,
            UA.Photo,
            UA.DOB,
            UA.ContactNumber,
            DPT.DepartmentID,
            DPT.DepartmentName;

select * from vw_Doctors;

-- ================================================================================================================================================================================
-- get doctors by id

DELIMITER $$
CREATE PROCEDURE getDoctorsById(IN doc_id INT)
BEGIN
    SELECT 
        D.DoctorID,
        UA.Name,
        D.Specialization,
        D.Status AS "Employeement Status",
        D.DOJ AS "Date of join",
        UA.Email,
        UA.Address,
        UA.Photo,
        UA.DOB,
        UA.ContactNumber,
        DPT.DepartmentID,
        DPT.DepartmentName,
        CAST(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'AvailableDay', DAV.AvailableDay,
                    'StartTime', DAV.StartTime,
                    'EndTime', DAV.EndTime,
                    'RoomNO', DAV.RoomNO
                )
            ) AS JSON
        ) AS Availability
    FROM Doctors D 
    INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
    INNER JOIN Departments DPT ON D.DepartmentID = DPT.DepartmentID
    INNER JOIN DoctorAvailability DAV ON D.DoctorID = DAV.DoctorID
    WHERE D.isActive = 1 AND D.DoctorID = doc_id
    GROUP BY D.DoctorID;
END $$
DELIMITER ;

call getDoctorsById(1);


