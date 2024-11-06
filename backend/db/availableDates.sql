USE hms;

DELIMITER //

CREATE PROCEDURE populateWeeklyAvailability()
BEGIN
    -- Declare necessary variables for looping and fetching data
    DECLARE v_currentDate DATE;
    DECLARE v_endOfWeek DATE;
    DECLARE v_DoctorID INT;
    DECLARE v_roomNO INT;
    DECLARE v_startTime TIME;
    DECLARE v_endTime TIME;
    DECLARE v_dayOfWeek VARCHAR(10);
    DECLARE done INT DEFAULT FALSE;

    -- Declare the doctor_cursor to fetch all distinct DoctorIDs
    DECLARE doctor_cursor CURSOR FOR
        SELECT DISTINCT DoctorID
        FROM DoctorAvailability;

    -- Declare the availability_cursor before the loop, so it is only declared once
    DECLARE availability_cursor CURSOR FOR
        SELECT AvailableDay, RoomNO, StartTime, EndTime
        FROM DoctorAvailability
        WHERE DoctorID = v_DoctorID;

    -- Declare the handler for the end of the doctor_cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Get the current date and calculate the start date (3 days in the future) and end of the week (10 days ahead)
    SET v_currentDate = DATE_ADD(CURDATE(), INTERVAL 3 DAY); -- Start from 3 days in the future
    SET v_endOfWeek = DATE_ADD(v_currentDate, INTERVAL 7 DAY); -- End of the week from the new start date

    -- Open the doctor_cursor
    OPEN doctor_cursor;

    -- Loop through each doctor to process their availability
    read_loop: LOOP
        FETCH doctor_cursor INTO v_DoctorID;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Open the availability_cursor for the current doctor
        OPEN availability_cursor;

        -- Loop through the availability slots for the current doctor
        availability_loop: LOOP
            FETCH availability_cursor INTO v_dayOfWeek, v_roomNO, v_startTime, v_endTime;

            -- If no more availability slots, exit the loop
            IF done THEN
                LEAVE availability_loop;
            END IF;

            -- Reset the current date for each doctor's availability check
            SET v_currentDate = DATE_ADD(CURDATE(), INTERVAL 3 DAY); -- Reset to 3 days in the future

            -- Loop through the week and insert availability records
            WHILE v_currentDate <= v_endOfWeek DO
                -- Check if the current date corresponds to the available day for the doctor
                IF DAYNAME(v_currentDate) = v_dayOfWeek THEN
                    -- Check if the record already exists before inserting
                    IF NOT EXISTS (
                        SELECT 1 FROM DoctorWeeklyAvailability 
                        WHERE DoctorID = v_DoctorID 
                        AND Date = v_currentDate 
                        AND RoomNO = v_roomNO 
                        AND StartTime = v_startTime 
                        AND EndTime = v_endTime
                    ) THEN
                        -- Insert availability record for the doctor in the new table for the week
                        INSERT INTO DoctorWeeklyAvailability (DoctorID, Date, RoomNO, StartTime, EndTime, isAvailable, isActive)
                        VALUES (v_DoctorID, v_currentDate, v_roomNO, v_startTime, v_endTime, TRUE, TRUE);
                    END IF;
                END IF;

                -- Move to the next day
                SET v_currentDate = DATE_ADD(v_currentDate, INTERVAL 1 DAY);
            END WHILE;
        END LOOP;

        -- Close the availability_cursor after processing the current doctor
        CLOSE availability_cursor;

        -- Reset the done flag for the next doctor
        SET done = FALSE;
    END LOOP;

    -- Close the doctor_cursor after all doctors have been processed
    CLOSE doctor_cursor;
END //

DELIMITER ;

-- Show the event scheduler status
SHOW VARIABLES LIKE 'event_scheduler';

-- Enable event
DELIMITER //

CREATE EVENT IF NOT EXISTS event_populateWeeklyAvailability
ON SCHEDULE EVERY 1 WEEK STARTS NOW()  -- Starts immediately from the current time
DO
BEGIN
    -- Call the populateWeeklyAvailability procedure to populate availability for the week
    CALL populateWeeklyAvailability();
END //

DELIMITER ;