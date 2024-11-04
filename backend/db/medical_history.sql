-- ================================================================================================================================================================================
-- get medical history by id

DELIMITER $$
CREATE PROCEDURE getMedicalHistoryByPatientID(id int)
	BEGIN
		SELECT * FROM MedicalHistory WHERE PatientID = id;
	END $$
DELIMITER ;

call getMedicalHistoryByPatientID(1);