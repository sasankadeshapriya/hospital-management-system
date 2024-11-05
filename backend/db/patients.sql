use hms;

-- patients
CREATE OR REPLACE VIEW PatientsView AS
      SELECT * FROM Patients where isActive = 1;

select * from PatientsView;
-- ================================================================================================================================================================================      

DELIMITER $$
CREATE PROCEDURE getPatientByID(id int)
	BEGIN
		SELECT * FROM Patients WHERE PatientID = id;
	END $$
DELIMITER ;

CALL getPatientByID(1);

-- ================================================================================================================================================================================

DELIMITER $$
CREATE PROCEDURE updatePatient(
		IN p_PatientID INT,
		IN p_FirstName VARCHAR(100),
		IN p_LastName VARCHAR(100),
		IN p_DOB DATE,
		IN p_Gender CHAR(1),
		IN p_ContactNumber VARCHAR(15),
		IN p_Address VARCHAR(255),
		IN p_CNIC VARCHAR(20),
        IN p_isActive boolean
        )
	BEGIN
		UPDATE Patients
			SET 
				FirstName = p_FirstName,
				LastName = p_LastName,
				DOB = p_DOB,
				Gender = p_Gender,
				ContactNumber = p_ContactNumber,
				Address = p_Address,
				CNIC = p_CNIC,
                isActive = p_isActive
			WHERE PatientID = p_PatientID;
	END $$
DELIMITER ;

CALL updatePatient(5, 'Randil', 'Hasanga', '2000-12-19', 'M', '0763456789', 'Temple Road, Waralla', '563456765V', true);

-- ================================================================================================================================================================================

DELIMITER $$

CREATE PROCEDURE addPatient(
		IN p_FirstName VARCHAR(100),
		IN p_LastName VARCHAR(100),
		IN p_DOB DATE,
		IN p_Gender CHAR(1),
		IN p_ContactNumber VARCHAR(15),
		IN p_Address VARCHAR(255),
		IN p_CNIC VARCHAR(20),
        IN p_isActive bool
)
BEGIN
        DECLARE cnic_no VARCHAR(20);
        DECLARE isAct boolean;
        SELECT CNIC INTO cnic_no FROM Patients WHERE CNIC = p_CNIC;
		SELECT isActive INTO isAct FROM Patients  WHERE CNIC = p_CNIC;
        
        if cnic_no is null then
        
			INSERT INTO Patients (FirstName, LastName, DOB, Gender, ContactNumber, Address, CNIC, isActive)
			VALUES (p_FirstName, p_LastName, p_DOB, p_Gender, p_ContactNumber, p_Address, p_CNIC, p_isActive);
		
        else
			if isAct = 0 then
				UPDATE Patients
				SET 
					FirstName = p_FirstName,
					LastName = p_LastName,
					DOB = p_DOB,
					Gender = p_Gender,
					ContactNumber = p_ContactNumber,
					Address = p_Address,
					CNIC = p_CNIC,
					isActive = p_isActive
				WHERE CNIC = p_CNIC;
			else
				select "Patient already exist" as Warning;
			end if;
		end if;    
END $$
DELIMITER ;

CALL addPatient('W.A.R', 'Hasanga', '2000-12-19', 'M', '0712345681', '789 Black St, Colombo', '20003542332', true);

-- ================================================================================================================================================================================

DELIMITER $$

CREATE PROCEDURE DeletePatientAndAppointments(
    IN p_patientId INT
)
BEGIN
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error in deleting patient or appointments';
    END;

    START TRANSACTION;

    UPDATE Patients 
    SET isActive = 0 
    WHERE PatientID = p_patientId;

    UPDATE Doctor_Appointments 
    SET isActive = 0
    WHERE PatientID = p_patientId;

    UPDATE Lab_Appointments 
    SET isActive = 0 
    WHERE PatientID = p_patientId;

    COMMIT;
END $$

DELIMITER ;

call DeletePatientAndAppointments(6);