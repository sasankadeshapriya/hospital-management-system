use hms;

-- ----------------------------------------------------------------------------------
-- create user account when doctor insert availabitity and doctor details
DELIMITER //

CREATE PROCEDURE CreateUserAccountWithAvailability(
    IN p_Name VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Password VARCHAR(100),
    IN p_Address VARCHAR(255),
    IN p_Photo VARCHAR(255),
    IN p_DOB DATE,
    IN p_ContactNumber VARCHAR(15),
    IN p_AccountType VARCHAR(50),
    IN p_isActive BOOLEAN,
    IN p_Specialization VARCHAR(100),
    IN p_Status VARCHAR(50),
    IN p_DOJ DATE,
    IN p_DepartmentID INT,
    IN p_Availability JSON
)
BEGIN
    -- Declare all variables at the beginning
    DECLARE newUserID INT;
    DECLARE newDoctorID INT;
    DECLARE v_day VARCHAR(10);
    DECLARE v_startTime TIME;
    DECLARE v_endTime TIME;
    DECLARE v_roomNO INT;
    DECLARE done INT DEFAULT FALSE;
    
    -- Cursor for iterating over JSON availability array
    DECLARE availabilityCursor CURSOR FOR
        SELECT RoomNO, AvailableDay, StartTime, EndTime
        FROM JSON_TABLE(
            p_Availability,
            '$[*]' COLUMNS (
                RoomNO INT PATH '$.RoomNO',
                AvailableDay VARCHAR(10) PATH '$.AvailableDay',
                StartTime TIME PATH '$.StartTime',
                EndTime TIME PATH '$.EndTime'
            )
        ) AS jt;

    -- Declare the handler for the end of the cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Start a transaction
    START TRANSACTION;

    -- Insert into UserAccounts
    INSERT INTO UserAccounts (Name, Email, Password, Address, Photo, DOB, ContactNumber, AccountType, isActive)
    VALUES (p_Name, p_Email, p_Password, p_Address, p_Photo, p_DOB, p_ContactNumber, p_AccountType, p_isActive);
    SET newUserID = LAST_INSERT_ID();

    -- Insert into Doctors if the AccountType is 'Doctor'
    IF p_AccountType = 'Doctor' THEN
        INSERT INTO Doctors (DepartmentID, UserID, Specialization, Status, DOJ, isActive)
        VALUES (p_DepartmentID, newUserID, p_Specialization, p_Status, p_DOJ, p_isActive);
        SET newDoctorID = LAST_INSERT_ID();

        -- Insert multiple availability slots if provided
        IF p_Availability IS NOT NULL THEN
            OPEN availabilityCursor;
            availabilityLoop: LOOP
                FETCH availabilityCursor INTO v_roomNO, v_day, v_startTime, v_endTime;
                IF done THEN
                    LEAVE availabilityLoop;
                END IF;
                INSERT INTO DoctorAvailability (DoctorID, RoomNO, AvailableDay, StartTime, EndTime)
                VALUES (newDoctorID, v_roomNO, v_day, v_startTime, v_endTime);
            END LOOP availabilityLoop;
            CLOSE availabilityCursor;
        END IF;
    END IF;

    -- Commit the transaction
    COMMIT;
END //

DELIMITER ;

CALL CreateUserAccountWithAvailability(
    'Dr. Sasank Deshapriya',                  -- p_Name
    'sasanka@example.com',          -- p_Email
    'password123',                         -- p_Password
    '123 Main St, Colombo',                -- p_Address
    '/images/alice.jpg',                   -- p_Photo
    '1975-05-12',                          -- p_DOB
    '0711234567',                          -- p_ContactNumber
    'Doctor',                              -- p_AccountType
    true,                                  -- p_isActive
    'Cardiologist',                        -- p_Specialization
    'Active',                              -- p_Status
    '2005-04-15',                          -- p_DOJ
    1,                                     -- p_DepartmentID
    JSON_ARRAY(
        JSON_OBJECT('RoomNO', 101, 'AvailableDay', 'Monday', 'StartTime', '09:00:00', 'EndTime', '17:00:00'),
        JSON_OBJECT('RoomNO', 101, 'AvailableDay', 'Wednesday', 'StartTime', '09:00:00', 'EndTime', '17:00:00')
    )                                      -- p_Availability
);

CALL CreateUserAccountWithAvailability(
    'Sarah Lewis',                         -- p_Name
    'sarah.lewis@example.com',             -- p_Email
    'password123',                         -- p_Password
    '303 Maple St, Negombo',               -- p_Address
    '/images/sarah.jpg',                   -- p_Photo
    '1985-01-21',                          -- p_DOB
    '0714567890',                          -- p_ContactNumber
    'Receptionist',                        -- p_AccountType
    true,                                  -- p_isActive
    NULL,                                  -- p_Specialization
    NULL,                                  -- p_Status
    NULL,                                  -- p_DOJ
    NULL,                                  -- p_DepartmentID
    NULL                                   -- p_Availability
);


-- --------------------------------------------------------------------------
-- delete user account
DELIMITER $$

CREATE PROCEDURE DeleteUserAccount(
    IN p_userId INT
)
BEGIN
    -- Set isActive to 0 in UserAccounts table
    UPDATE UserAccounts
    SET isActive = 0
    WHERE UserID = p_userId;
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER AfterUserAccountDelete
AFTER UPDATE ON UserAccounts
FOR EACH ROW
BEGIN
    -- Check if the user account is set to inactive
    IF NEW.isActive = 0 THEN
        -- Deactivate the corresponding doctor record, if applicable
        UPDATE Doctors
        SET isActive = 0
        WHERE UserID = NEW.UserID;

        -- Optionally deactivate all availability records for this doctor
        UPDATE DoctorAvailability
        SET isActive = 0
        WHERE DoctorID IN (SELECT DoctorID FROM Doctors WHERE UserID = NEW.UserID);
    END IF;
END $$

DELIMITER ;

CALL DeleteUserAccount(11);


-- --------------------------------------------------------------------------
-- Procedure to Edit User Account and Doctor details (without availability)
-- Excluding Password update from EditUserAccount procedure

DELIMITER $$

CREATE PROCEDURE EditUserAccount(
    IN p_userId INT,
    IN p_name VARCHAR(100),
    IN p_address VARCHAR(255),
    IN p_dob DATE,
    IN p_contactNumber VARCHAR(15),
    IN p_accountType VARCHAR(50),
    IN p_isActive BOOLEAN,
    IN p_specialization VARCHAR(100),
    IN p_status VARCHAR(50),
    IN p_departmentID INT
)
BEGIN
    -- Start a transaction
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback on error
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Update UserAccounts table (excluding password)
    UPDATE UserAccounts
    SET Name = p_name,
        Address = p_address,
        DOB = p_dob,
        ContactNumber = p_contactNumber,
        AccountType = p_accountType,
        isActive = p_isActive
    WHERE UserID = p_userId;

    -- Check if the account is a doctor
    IF p_accountType = 'Doctor' THEN
        -- Update Doctors table
        UPDATE Doctors
        SET DepartmentID = p_departmentID,
            Specialization = p_specialization,
            Status = p_status,
            isActive = p_isActive
        WHERE UserID = p_userId;
    END IF;

    -- Commit the transaction
    COMMIT;
END $$

DELIMITER ;


-- ---------------------------------------------
-- Trigger for Audit Logging on User Account Updates

DELIMITER $$

CREATE TRIGGER after_UserAccounts_Update
AFTER UPDATE ON UserAccounts
FOR EACH ROW
BEGIN
    -- Avoid logging the password field changes in the audit log
    INSERT INTO AuditLog (UserID, Action, OldValue, NewValue)
    VALUES (
        OLD.UserID,
        'Update UserAccount',
        JSON_OBJECT(
            'Name', OLD.Name,
            'Address', OLD.Address,
            'DOB', OLD.DOB,
            'ContactNumber', OLD.ContactNumber,
            'AccountType', OLD.AccountType,
            'isActive', OLD.isActive
        ),
        JSON_OBJECT(
            'Name', NEW.Name,
            'Address', NEW.Address,
            'DOB', NEW.DOB,
            'ContactNumber', NEW.ContactNumber,
            'AccountType', NEW.AccountType,
            'isActive', NEW.isActive
        )
    );
END $$

DELIMITER ;

-- --------------------------------------------------------------------------
-- Procedure to Update User Password Separately

DELIMITER $$

CREATE PROCEDURE UpdateUserPassword(
    IN p_userId INT,
    IN p_password VARCHAR(100)
)
BEGIN
    -- Update password in UserAccounts table
    UPDATE UserAccounts
    SET Password = p_password
    WHERE UserID = p_userId;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_Doctors_Update
AFTER UPDATE ON Doctors
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (UserID, Action, OldValue, NewValue)
    VALUES (
        OLD.UserID,
        'Update DoctorDetails',
        JSON_OBJECT(
            'DepartmentID', OLD.DepartmentID,
            'Specialization', OLD.Specialization,
            'Status', OLD.Status,
            'isActive', OLD.isActive
        ),
        JSON_OBJECT(
            'DepartmentID', NEW.DepartmentID,
            'Specialization', NEW.Specialization,
            'Status', NEW.Status,
            'isActive', NEW.isActive
        )
    );
END $$

DELIMITER ;

-- ------------------------------------------------
-- get NonDoctorUser
CREATE VIEW NonDoctorUserDetailsView AS
SELECT 
    UserID,
    Name,
    Email,
    Address,
    Photo,
    DOB,
    ContactNumber,
    AccountType,
    isActive
FROM 
    UserAccounts
WHERE 
    AccountType <> 'Doctor';

SELECT * FROM NonDoctorUserDetailsView WHERE UserID = 6;

-- -------------------------------------
-- get DoctorUserDetailsView

CREATE VIEW DoctorUserDetailsView AS
SELECT 
    ua.UserID,
    ua.Name,
    ua.Email,
    ua.Address,
    ua.Photo,
    ua.DOB,
    ua.ContactNumber,
    ua.AccountType,
    ua.isActive,
    d.Specialization,
    d.Status AS DoctorStatus,
    d.DepartmentID
FROM 
    UserAccounts ua
JOIN 
    Doctors d ON ua.UserID = d.UserID
WHERE 
    ua.AccountType = 'Doctor';

SELECT * FROM DoctorUserDetailsView WHERE UserID = 1;

-- --------------------------------------------------------
-- update user photo
DELIMITER //

CREATE PROCEDURE UpdateUserPhoto(
    IN p_userId INT,
    IN p_photoPath VARCHAR(255)
)
BEGIN
    -- Update the Photo column for the specified user
    UPDATE UserAccounts
    SET Photo = p_photoPath
    WHERE UserID = p_userId AND isActive = true;

    -- Check if the update was successful and provide feedback
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found or inactive';
    END IF;
END //

DELIMITER ;

-- -----------------------------------------------------------------
-- get all user other than doctors 
CREATE VIEW get_all_non_doctor_users AS
SELECT 
    UserID, 
    Name, 
    Email, 
    Address, 
    Photo, 
    DOB, 
    ContactNumber, 
    isActive
FROM 
    UserAccounts
WHERE 
    AccountType != 'Doctor' AND isActive = 1;

SELECT * FROM get_all_non_doctor_users;


DELIMITER //

CREATE TRIGGER after_doctor_insert
AFTER INSERT ON Doctors
FOR EACH ROW
BEGIN
    DECLARE doctorName VARCHAR(100);
    
    -- Fetch the doctor's name from the UserAccounts table based on UserID
    SELECT Name INTO doctorName
    FROM UserAccounts
    WHERE UserID = NEW.UserID;

    -- Insert into Doctor_Acc table after a new doctor is added
    INSERT INTO Doctor_Acc (DoctorID, AccountName, Balance, AccountID)
    VALUES (NEW.DoctorID, doctorName, 0, 1);  -- Assuming AccountID is always 1
END //

DELIMITER ;
