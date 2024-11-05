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
            DAV.AvailableDay,
            DAV.StartTime,
            DAV.EndTime,
            DAV.RoomNO
      FROM Doctors D 
      INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
      INNER JOIN Departments DPT ON D.DepartmentID = DPT.DepartmentID
      INNER JOIN DoctorAvailability DAV ON D.DoctorID = DAV.DoctorID
      where D.isActive = 1;

select * from vw_Doctors;

-- ================================================================================================================================================================================
-- get doctors by id

DELIMITER $$
CREATE PROCEDURE getDoctorsById(doc_id int)
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
				DAV.AvailableDay,
				DAV.StartTime,
				DAV.EndTime,
				DAV.RoomNO
		  FROM Doctors D 
		  INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
		  INNER JOIN Departments DPT ON D.DepartmentID = DPT.DepartmentID
		  INNER JOIN DoctorAvailability DAV ON D.DoctorID = DAV.DoctorID
		  where D.isActive = 1 AND D.DoctorID = doc_id;
	END $$
DELIMITER ;

call getDoctorsById(1);
