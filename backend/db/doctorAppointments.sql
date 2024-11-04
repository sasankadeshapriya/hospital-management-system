-- ================================================================================================================================================================================
-- get all doctor appointments

create or replace view vw_doctor_appointments
as
select * 
from Doctor_Appointments
where AppointmentDate >= current_date AND isActive = 1;

select * from vw_doctor_appointments;

-- ================================================================================================================================================================================
-- get doctor appointments by id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentById(id int)
	BEGIN
		select * 
		from Doctor_Appointments
		where AppointmentDate >= current_date AND D_AppointmentID = id;
	END $$
DELIMITER ;

call getDoctorAppointmentById(5);

-- ================================================================================================================================================================================
-- get doctor appointments by doctor id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByDocId(id int)
	BEGIN
		select * 
		from Doctor_Appointments
		where AppointmentDate >= current_date AND DoctorID = id AND isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByDocId(5);



-- ================================================================================================================================================================================
-- get doctor appointments by doctor id and date

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByDocIdAndDate(id int, Appointment_Date date)
	BEGIN
		select * 
		from Doctor_Appointments
		where AppointmentDate >= current_date AND DoctorID = id AND AppointmentDate = Appointment_Date AND isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByDocIdAndDate(5, '2024-11-13');


-- ================================================================================================================================================================================
-- get doctor appointments by patient id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByPatientId(id int)
	BEGIN
		select * 
		from Doctor_Appointments
		where AppointmentDate >= current_date AND PatientID = id AND isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByPatientId(5);

-- ================================================================================================================================================================================
-- get doctor appointments by queue id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByQueueId(id int)
	BEGIN
		select * 
		from Doctor_Appointments
		where AppointmentDate >= current_date AND QueueID = id AND isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByQueueId(5);


-- ================================================================================================================================================================================
-- insert doctor appointments

-- DELIMITER $$
-- CREATE function insertDoctorAppointment(
-- 		AppointmentDate_ DATE,
-- 		AppointmentTime_ TIME,
-- 		Status_ VARCHAR(50),
-- 		PatientID_ INT,
-- 		DoctorID_ INT,
-- 		AppointmentType_ VARCHAR(20),
-- 		isActive_ boolean,
--         AvailabilityID_ int
-- 	)
-- returns boolean
-- deterministic
-- 	BEGIN
-- 		DECLARE queue_id int;
--         DECLARE appointment_id int;
--         DECLARE last_queue_number INT DEFAULT 0;
--         
-- 		INSERT INTO Doctor_Appointments (AppointmentDate, AppointmentTime, Status, PatientID, DoctorID, AppointmentType, isActive)
--         values (AppointmentDate_, AppointmentTime_, Status_, PatientID_, DoctorID_, AppointmentType_, isActive_);
--         
--         SELECT QueueID INTO queue_id FROM ConsultationQueue WHERE DoctorID = DoctorID_ AND Date = AppointmentDate_;
--         SELECT D_AppointmentID INTO appointment_id FROM Doctor_Appointments WHERE DoctorID = DoctorID_ AND AppointmentDate = AppointmentDate_ and PatientID = PatientID_;
--         
-- 			IF queue_id IS NULL THEN
-- 				INSERT INTO ConsultationQueue(DoctorID, Date, AvailabilityID, AppointmentDateTime)
-- 				VALUES(DoctorID_, AppointmentDate_, AvailabilityID_, CONCAT(AppointmentDate_, ' ', AppointmentTime_));
-- 				
-- 				SET queue_id = LAST_INSERT_ID();
-- 				
-- 				INSERT INTO ConsultationQueue_details(D_AppointmentID, PatientID, QueueNumber, QueueID, DoctorID, Date)
-- 				VALUES (appointment_id, PatientID_, 1, queue_id, DoctorID_, AppointmentDate_);
-- 			ELSE
-- 			
-- 				 SELECT IFNULL(MAX(QueueNumber), 0) + 1 INTO last_queue_number 
-- 				FROM ConsultationQueue_details 
-- 				WHERE QueueID = queue_id;
-- 				
-- 				INSERT INTO ConsultationQueue_details(D_AppointmentID, PatientID, QueueNumber, QueueID, DoctorID, Date)
-- 				VALUES (appointment_id, PatientID_, last_queue_number, queue_id, DoctorID_, AppointmentDate_);
-- 			END IF;
--             
-- 		return true;
-- 	END $$
-- DELIMITER ;


DELIMITER $$
CREATE function insertDoctorAppointment(
		AppointmentDate_ DATE,
		AppointmentTime_ TIME,
		Status_ VARCHAR(50),
		PatientID_ INT,
		DoctorID_ INT,
		AppointmentType_ VARCHAR(20),
		isActive_ boolean,
        AvailabilityID_ int
	)
returns boolean
deterministic
	BEGIN
		DECLARE queue_id int;
        DECLARE appointment_id int;
        DECLARE last_queue_number INT DEFAULT 0;
        
		INSERT INTO Doctor_Appointments (AppointmentDate, AppointmentTime, Status, PatientID, DoctorID, AppointmentType, isActive)
        values (AppointmentDate_, AppointmentTime_, Status_, PatientID_, DoctorID_, AppointmentType_, isActive_);
        
        SELECT QueueID INTO queue_id FROM ConsultationQueue WHERE DoctorID = DoctorID_ AND Date = AppointmentDate_;
        SELECT D_AppointmentID INTO appointment_id FROM Doctor_Appointments WHERE DoctorID = DoctorID_ AND AppointmentDate = AppointmentDate_ and PatientID = PatientID_;
        
			IF queue_id IS NULL THEN
				INSERT INTO ConsultationQueue(DoctorID, Date, AvailabilityID, AppointmentDateTime)
				VALUES(DoctorID_, AppointmentDate_, AvailabilityID_, CONCAT(AppointmentDate_, ' ', AppointmentTime_));
				
				SET queue_id = LAST_INSERT_ID();
				
				INSERT INTO ConsultationQueue_details(D_AppointmentID, PatientID, QueueNumber, QueueID, DoctorID, Date)
				VALUES (appointment_id, PatientID_, 1, queue_id, DoctorID_, AppointmentDate_);
			ELSE
			
				SELECT IFNULL(MAX(QueueNumber), 0) + 1 INTO last_queue_number 
				FROM ConsultationQueue_details 
				WHERE QueueID = queue_id;
				
				INSERT INTO ConsultationQueue_details(D_AppointmentID, PatientID, QueueNumber, QueueID, DoctorID, Date)
				VALUES (appointment_id, PatientID_, last_queue_number, queue_id, DoctorID_, AppointmentDate_);
			END IF;
            
		return true;
	END $$
DELIMITER ;

SELECT insertDoctorAppointment(
    '2024-11-05',  -- AppointmentDate (DATE format)
    '11:30:00',    -- AppointmentTime (TIME format)
    'Scheduled',   -- Status (VARCHAR)
    2,           -- PatientID (INT)
    1,           -- DoctorID (INT)
    'Consultation',-- AppointmentType (VARCHAR)
    TRUE,          -- isActive (BOOLEAN)
    2            -- AvailabilityID (INT)
);

call getDoctorAppointmentByQueueId(5);

select * from Doctor_Appointments;
select * from ConsultationQueue;
select * from ConsultationQueue_details;
