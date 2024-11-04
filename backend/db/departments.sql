use hms;

-- -------------------------------------------------------------------------------------------------------------------------------------
-- get all department details
CREATE VIEW DepartmentDetails AS
SELECT 
    d.DepartmentID,
    d.DepartmentName,
    dr.Specialization,
    u.Name AS HOD_Name
FROM 
    Departments d
JOIN 
    Doctors dr ON d.HOD = dr.DoctorID
JOIN 
    UserAccounts u ON dr.UserID = u.UserID;
    
SELECT * FROM DepartmentDetails;

-- -------------------------------------------------------------------------------------------------------------------------------------
-- get doctor list in department
DELIMITER //

CREATE PROCEDURE GetDoctorsByDepartmentID(IN departmentID INT)
BEGIN
    SELECT 
        u.Name AS DoctorName,
        u.Photo AS DoctorPhoto
    FROM 
        Doctors d
    JOIN 
        UserAccounts u ON d.UserID = u.UserID
    WHERE 
        d.DepartmentID = departmentID
        AND d.Status = 'Active'
        AND d.isActive = TRUE; 
END //

DELIMITER ;

CALL GetDoctorsByDepartmentID(1);

-- -------------------------------------------------------------------------------------------------------------------------------------
-- insert department

DELIMITER //

CREATE PROCEDURE InsertDepartment(
    IN departmentName VARCHAR(100),
    IN hod INT
)
BEGIN
    -- Start transaction
    START TRANSACTION;

    -- Insert the new department without any checks
    INSERT INTO Departments (DepartmentName, HOD) VALUES (departmentName, hod);
    
    -- Commit the transaction
    COMMIT;
END //

DELIMITER ;

CALL InsertDepartment('Cardiologydd', 1);


-- -------------------------------------------------------------------------------------------------------------------------------------
-- update department

DELIMITER $$

CREATE FUNCTION IsHODAvailable(hodID INT) 
RETURNS BOOLEAN 
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE available BOOLEAN;

    SELECT COUNT(*) > 0 INTO available
    FROM Doctors
    WHERE DoctorID = hodID AND Status = 'Active' AND isActive = TRUE;

    RETURN available;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE updateDepartment(
    IN p_DepartmentID INT,
    IN p_NewDepartmentName VARCHAR(100),
    IN p_NewHOD INT
)
BEGIN
    DECLARE currentHOD INT;
    DECLARE currentDepartmentName VARCHAR(100);

    -- Fetch the current values for the department
    SELECT HOD, DepartmentName INTO currentHOD, currentDepartmentName
    FROM Departments
    WHERE DepartmentID = p_DepartmentID;

    -- Check if the department exists
    IF currentDepartmentName IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Department not found';
    ELSE
        -- Check if the new HOD ID is available
        IF p_NewHOD IS NOT NULL AND NOT IsHODAvailable(p_NewHOD) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Invalid HOD ID: Doctor not found or not available';
        ELSE
            -- Update the department name if it has changed
            IF p_NewDepartmentName IS NOT NULL AND LOWER(currentDepartmentName) != LOWER(p_NewDepartmentName) THEN
                -- Check if a department with the new name already exists
                IF EXISTS (SELECT 1 FROM Departments WHERE LOWER(DepartmentName) = LOWER(p_NewDepartmentName)) THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Department name already exists';
                ELSE
                    -- Perform the update for the department name
                    UPDATE Departments
                    SET DepartmentName = p_NewDepartmentName
                    WHERE DepartmentID = p_DepartmentID;
                END IF;
            END IF;

            -- Update the HOD if it has changed
            IF p_NewHOD IS NOT NULL AND p_NewHOD != currentHOD THEN
                -- Check if the new HOD is already assigned to another department
                IF EXISTS (SELECT 1 FROM Departments WHERE HOD = p_NewHOD AND DepartmentID != p_DepartmentID) THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: HOD is already assigned to another department';
                ELSE
                    -- Perform the update for HOD
                    UPDATE Departments
                    SET HOD = p_NewHOD
                    WHERE DepartmentID = p_DepartmentID;
                END IF;
            END IF;
        END IF;
    END IF;

END $$

DELIMITER ;

CALL updateDepartment(1, 'Cardiology', 1);
SELECT IsHODAvailable(1) AS IsAvailable;

-- ------------------------------------------------------------------------------
-- delete department
DELIMITER //

CREATE TRIGGER before_department_delete
BEFORE DELETE ON Departments
FOR EACH ROW
BEGIN
    -- Set DepartmentID to NULL for doctors in the deleted department
    UPDATE Doctors
    SET DepartmentID = NULL
    WHERE DepartmentID = OLD.DepartmentID;
END;
//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DeleteDepartment(IN deptID INT)
BEGIN
    -- Start the transaction
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback the transaction if any error occurs
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Archive the department being deleted
    INSERT INTO archiveDepartment (DepartmentID, DepartmentName, HOD)
    SELECT DepartmentID, DepartmentName, HOD
    FROM Departments
    WHERE DepartmentID = deptID;

    -- Delete the department
    DELETE FROM Departments
    WHERE DepartmentID = deptID;

    -- Commit the transaction
    COMMIT;
END;
//

DELIMITER ;

CALL DeleteDepartment(55);