use hms;

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

    -- Get the current date and calculate the end of the week (7 days ahead)
    SET v_currentDate = CURDATE();
    SET v_endOfWeek = DATE_ADD(v_currentDate, INTERVAL 7 DAY);

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

            -- Insert availability record for the doctor in the new table for the week
            INSERT INTO DoctorWeeklyAvailability (DoctorID, Date, RoomNO, StartTime, EndTime, isAvailable, isActive)
            VALUES (v_DoctorID, v_currentDate, v_roomNO, v_startTime, v_endTime, TRUE, TRUE);

            -- Move to the next day for the next loop iteration
            SET v_currentDate = DATE_ADD(v_currentDate, INTERVAL 1 DAY);

            -- If we've reached the end of the week, stop the loop
            IF v_currentDate > v_endOfWeek THEN
                LEAVE availability_loop;
            END IF;
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

-- used to on event scheduler
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