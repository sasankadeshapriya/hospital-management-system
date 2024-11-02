-- ================================================================================================================================================================================
-- insert labtest

DELIMITER $$
CREATE PROCEDURE insertLabTest(
		lt_TestName VARCHAR(100),
		lt_ProcessingTime TIME,
		lt_Cost DECIMAL(10, 2)
        )
	BEGIN
    
		INSERT INTO LabTests(TestName, ProcessingTime, Cost, isActive)
        VALUES (lt_TestName, lt_ProcessingTime, lt_Cost, true);
	END $$
DELIMITER ;

call insertLabTest("Test1", '01:00:00', 34.00);

-- ================================================================================================================================================================================
-- get all lab tests

create or replace view vw_labtests
as
select * from LabTests where isActive = 1;


-- ================================================================================================================================================================================
-- get lab test by ID

DELIMITER $$
CREATE PROCEDURE getLabTestByID(id int)
	BEGIN
		SELECT * FROM LabTests WHERE TestID = id;
	END $$
DELIMITER ;

call getLabTestByID(1);

-- ================================================================================================================================================================================
-- update labtest

DELIMITER $$
CREATE PROCEDURE updateLabTest(
		lt_TestID INT, 
		lt_TestName VARCHAR(100),
		lt_ProcessingTime TIME,
		lt_Cost DECIMAL(10, 2)
        )
	BEGIN
		UPDATE LabTests
			SET 
				TestName = lt_TestName,
				ProcessingTime = lt_ProcessingTime,
				Cost = lt_Cost
			WHERE TestID = lt_TestID;
	END $$
DELIMITER ;

call updateLabTest(2, "Test1", '01:00:00', 34.00);

-- ================================================================================================================================================================================
-- delete labtest

DELIMITER $$
CREATE PROCEDURE deleteLabTest(id int)
	BEGIN
		UPDATE LabTests
        SET isActive = 0
        WHERE TestID = id;
	END $$
DELIMITER ;

call deleteLabTest(5);
