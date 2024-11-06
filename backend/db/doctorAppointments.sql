-- ================================================================================================================================================================================
-- get all doctor appointments

create or replace view vw_doctor_appointments
as
select DA.D_AppointmentID,DA.AppointmentDate, DA.AppointmentTime, DA.Status, CONCAT(P.FirstName,' ',P.LastName) AS 'Patient Name', UA.Name AS 'Doctor Name', DA.AppointmentType, DAV.RoomNO, CQD.QueueID, CQD.QueueNumber
from Doctor_Appointments DA
INNER JOIN Doctors D ON DA.DoctorID = D.DoctorID
INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
INNER JOIN Patients P ON P.PatientID = DA.PatientID
INNER JOIN ConsultationQueue_details CQD ON CQD.D_AppointmentID = DA.D_AppointmentID
INNER JOIN ConsultationQueue CQ ON CQ.QueueID = CQD.QueueID
INNER JOIN DoctorAvailability DAV ON DAV.AvailabilityID = CQ.AvailabilityID
where DA.AppointmentDate >= current_date AND DA.isActive = 1;

select * from vw_doctor_appointments;

-- ================================================================================================================================================================================
-- get doctor appointments by id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentById(id int)
	BEGIN
		select DA.D_AppointmentID,DA.AppointmentDate, DA.AppointmentTime, DA.Status, CONCAT(P.FirstName,' ',P.LastName) AS 'Patient Name', UA.Name AS 'Doctor Name', DA.AppointmentType ,DAV.RoomNO, CQD.QueueID,CQD.QueueNumber
		from Doctor_Appointments DA
		INNER JOIN Doctors D ON DA.DoctorID = D.DoctorID
		INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
		INNER JOIN Patients P ON P.PatientID = DA.PatientID
        INNER JOIN ConsultationQueue_details CQD ON CQD.D_AppointmentID = DA.D_AppointmentID
		INNER JOIN ConsultationQueue CQ ON CQ.QueueID = CQD.QueueID
		INNER JOIN DoctorAvailability DAV ON DAV.AvailabilityID = CQ.AvailabilityID
		where DA.AppointmentDate >= current_date AND DA.D_AppointmentID = id;
	END $$
DELIMITER ;

call getDoctorAppointmentById(5);

-- ================================================================================================================================================================================
-- get doctor appointments by doctor id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByDocId(id int)
	BEGIN
		select DA.D_AppointmentID,DA.AppointmentDate, DA.AppointmentTime, DA.Status, CONCAT(P.FirstName,' ',P.LastName) AS 'Patient Name', UA.Name AS 'Doctor Name', DA.AppointmentType ,DAV.RoomNO, CQD.QueueID, CQD.QueueNumber
		from Doctor_Appointments DA
		INNER JOIN Doctors D ON DA.DoctorID = D.DoctorID
		INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
		INNER JOIN Patients P ON P.PatientID = DA.PatientID
        INNER JOIN ConsultationQueue_details CQD ON CQD.D_AppointmentID = DA.D_AppointmentID
		INNER JOIN ConsultationQueue CQ ON CQ.QueueID = CQD.QueueID
		INNER JOIN DoctorAvailability DAV ON DAV.AvailabilityID = CQ.AvailabilityID
		where DA.AppointmentDate >= current_date AND DA.DoctorID = id AND DA.isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByDocId(5);

-- ================================================================================================================================================================================
-- get doctor appointments by doctor id and date

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByDocIdAndDate(id int, Appointment_Date date)
	BEGIN
		select DA.D_AppointmentID,DA.AppointmentDate, DA.AppointmentTime, DA.Status, CONCAT(P.FirstName,' ',P.LastName) AS 'Patient Name', UA.Name AS 'Doctor Name', DA.AppointmentType ,DAV.RoomNO, CQD.QueueID, CQD.QueueNumber
		from Doctor_Appointments DA
		INNER JOIN Doctors D ON DA.DoctorID = D.DoctorID
		INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
		INNER JOIN Patients P ON P.PatientID = DA.PatientID
        INNER JOIN ConsultationQueue_details CQD ON CQD.D_AppointmentID = DA.D_AppointmentID
		INNER JOIN ConsultationQueue CQ ON CQ.QueueID = CQD.QueueID
		INNER JOIN DoctorAvailability DAV ON DAV.AvailabilityID = CQ.AvailabilityID
		where DA.AppointmentDate >= current_date AND DA.DoctorID = id AND DA.AppointmentDate = Appointment_Date AND DA.isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByDocIdAndDate(5, '2024-11-13');

-- ================================================================================================================================================================================
-- get doctor appointments by patient id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByPatientId(id int)
	BEGIN
		select DA.D_AppointmentID,DA.AppointmentDate, DA.AppointmentTime, DA.Status, CONCAT(P.FirstName,' ',P.LastName) AS 'Patient Name', UA.Name AS 'Doctor Name', DA.AppointmentType ,DAV.RoomNO, CQD.QueueID, CQD.QueueNumber
		from Doctor_Appointments DA
		INNER JOIN Doctors D ON DA.DoctorID = D.DoctorID
		INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
		INNER JOIN Patients P ON P.PatientID = DA.PatientID
        INNER JOIN ConsultationQueue_details CQD ON CQD.D_AppointmentID = DA.D_AppointmentID
		INNER JOIN ConsultationQueue CQ ON CQ.QueueID = CQD.QueueID
		INNER JOIN DoctorAvailability DAV ON DAV.AvailabilityID = CQ.AvailabilityID
		where DA.AppointmentDate >= current_date AND DA.PatientID = id AND DA.isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByPatientId(5);

-- ================================================================================================================================================================================
-- get doctor appointments by queue id

DELIMITER $$
CREATE PROCEDURE getDoctorAppointmentByQueueId(id int)
	BEGIN
		select DA.D_AppointmentID,DA.AppointmentDate, DA.AppointmentTime, DA.Status, CONCAT(P.FirstName,' ',P.LastName) AS 'Patient Name', UA.Name AS 'Doctor Name', DA.AppointmentType ,DAV.RoomNO, CQD.QueueID, CQD.QueueNumber
		from Doctor_Appointments DA
		INNER JOIN Doctors D ON DA.DoctorID = D.DoctorID
		INNER JOIN UserAccounts UA ON D.UserID = UA.UserID
		INNER JOIN Patients P ON P.PatientID = DA.PatientID
        INNER JOIN ConsultationQueue_details CQD ON CQD.D_AppointmentID = DA.D_AppointmentID
		INNER JOIN ConsultationQueue CQ ON CQ.QueueID = CQD.QueueID
		INNER JOIN DoctorAvailability DAV ON DAV.AvailabilityID = CQ.AvailabilityID
		where DA.AppointmentDate >= current_date AND CQD.QueueID = id AND CQD.isActive = 1;
	END $$
DELIMITER ;

call getDoctorAppointmentByQueueId(6);

-- ================================================================================================================================================================================
-- insert doctor appointments

DELIMITER $$
CREATE procedure insertDoctorAppointment(
		AppointmentDate_ DATE,
		AppointmentTime_ TIME,
		Status_ VARCHAR(50),
		PatientID_ INT,
		DoctorID_ INT,
		AppointmentType_ VARCHAR(20),
        AvailabilityID_ int
	)
	BEGIN
		DECLARE queue_id int;
        DECLARE billing_id int;
        DECLARE doc_bank_acc_id int;
        DECLARE appointment_id int;
        DECLARE appointment_cost DECIMAL(10, 2);
        DECLARE last_queue_number INT DEFAULT 0;
        
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			ROLLBACK; -- Rollback on error
		END;

		-- Start transaction
		START TRANSACTION;
        
		INSERT INTO Doctor_Appointments (AppointmentDate, AppointmentTime, Status, PatientID, DoctorID, AppointmentType, isActive)
        values (AppointmentDate_, AppointmentTime_, Status_, PatientID_, DoctorID_, AppointmentType_, 1);
        
        SELECT QueueID INTO queue_id FROM ConsultationQueue WHERE DoctorID = DoctorID_ AND Date = AppointmentDate_ AND AvailabilityID = AvailabilityID_;
        SELECT D_AppointmentID INTO appointment_id FROM Doctor_Appointments WHERE DoctorID = DoctorID_ AND AppointmentDate = AppointmentDate_ and PatientID = PatientID_;
        SELECT cost INTO appointment_cost FROM doc_appointment_cost LIMIT 1; -- there is only one raw
        SELECT Doc_AccID INTO doc_bank_acc_id FROM Doctor_Acc WHERE DoctorID = DoctorID_;
        
			IF queue_id IS NULL THEN
				INSERT INTO ConsultationQueue(DoctorID, Date, AvailabilityID, AppointmentDateTime)
				VALUES(DoctorID_, AppointmentDate_, AvailabilityID_, CONCAT(AppointmentDate_, ' ', AppointmentTime_));
				
				SET queue_id = LAST_INSERT_ID();
				
				INSERT INTO ConsultationQueue_details(D_AppointmentID, PatientID, QueueNumber, QueueID, DoctorID, Date, isActive)
				VALUES (appointment_id, PatientID_, 1, queue_id, DoctorID_, AppointmentDate_,1);
                
                -- deposite to doc acc
                UPDATE Doctor_Acc
					SET Balance = Balance + (appointment_cost/2)
				WHERE DoctorID = DoctorID_;
                
                -- deposite to hnp acc
                UPDATE HospitalAndPhamacy_Acc
					SET Balance = Balance + (appointment_cost/2)
				WHERE AccountType = 'Hospital';
                
                -- create bill
                INSERT INTO Billing (AppointmentType, PatientID, Amount, PaymentMethod, Date, IsRefunded, D_AppointmentID, L_AppointmentID)
                VALUES ('Consultation', PatientID_, appointment_cost, "Cash", AppointmentDate_, 0, appointment_id, null);
                
                SET billing_id = LAST_INSERT_ID();
                
                -- update AccountTransactions table
                INSERT INTO AccountTransactions(BillingID, AccountID, Amount, TransactionDate,DoctorID, Doc_AccID, HnP_AccID, AccountType, Description)
                VALUES
					(billing_id, 1, appointment_cost/2, NOW(),DoctorID_, doc_bank_acc_id, null, 'Doctor', 'Doctor fees'),
                    (billing_id, 2, appointment_cost/2, NOW(),null, null, 1, 'Hospital', 'Hospital fees');
				
                SELECT B.BillingID, B.D_AppointmentID, P.PatientID,CONCAT(P.FirstName, ' ', P.LastName) AS "Patient Name", B.Date, D.DoctorID, UA.Name AS "Doctor Name", B.Amount AS "Bill Amount"
                FROM Billing B
                INNER JOIN Patients P ON P.PatientID = B.PatientID
                INNER JOIN Doctor_Appointments DA ON DA.D_AppointmentID = B.D_AppointmentID
                INNER JOIN Doctors D ON D.DoctorID = DA.DoctorID
                INNER JOIN UserAccounts UA ON UA.UserID = D.UserID
                WHERE BillingID = billing_id;
			ELSE
			
				SELECT IFNULL(MAX(QueueNumber), 0) + 1 INTO last_queue_number 
				FROM ConsultationQueue_details 
				WHERE QueueID = queue_id;
				
				INSERT INTO ConsultationQueue_details(D_AppointmentID, PatientID, QueueNumber, QueueID, DoctorID, Date, isActive)
				VALUES (appointment_id, PatientID_, last_queue_number, queue_id, DoctorID_, AppointmentDate_,1);
                
                -- deposite to doc acc
                UPDATE Doctor_Acc
					SET Balance = Balance + (appointment_cost/2)
				WHERE DoctorID = DoctorID_;
                
                -- deposite to hnp acc
                UPDATE HospitalAndPhamacy_Acc
					SET Balance = Balance + (appointment_cost/2)
				WHERE AccountType = 'Hospital';
                
                -- create bill
                INSERT INTO Billing (AppointmentType, PatientID, Amount, PaymentMethod, Date, IsRefunded, D_AppointmentID, L_AppointmentID)
                VALUES ('Consultation', PatientID_, appointment_cost, "Cash", AppointmentDate_, 0, appointment_id, null);
                
                SET billing_id = LAST_INSERT_ID();
                
                -- update AccountTransactions table
                INSERT INTO AccountTransactions(BillingID, AccountID, Amount, TransactionDate,DoctorID, Doc_AccID, HnP_AccID, AccountType, Description)
                VALUES
					(billing_id, 1, appointment_cost/2, NOW(),DoctorID_, doc_bank_acc_id, null, 'Doctor', 'Doctor fees'),
                    (billing_id, 2, appointment_cost/2, NOW(),null, null, 1, 'Hospital', 'Hospital fees');
                    
				SELECT B.BillingID, B.D_AppointmentID, P.PatientID,CONCAT(P.FirstName, ' ', P.LastName) AS "Patient Name", B.Date, D.DoctorID, UA.Name AS "Doctor Name", B.Amount AS "Bill Amount"
                FROM Billing B
                INNER JOIN Patients P ON P.PatientID = B.PatientID
                INNER JOIN Doctor_Appointments DA ON DA.D_AppointmentID = B.D_AppointmentID
                INNER JOIN Doctors D ON D.DoctorID = DA.DoctorID
                INNER JOIN UserAccounts UA ON UA.UserID = D.UserID
                WHERE BillingID = billing_id;
			END IF;
		COMMIT;
	END $$
DELIMITER ;

call insertDoctorAppointment(
	'2024-12-27', '09:30:00', 'Pending', 3, 5, 'Consultation', 5
);

-- ================================================================================================================================================================================
-- delete doctor appointment

DELIMITER $$
CREATE PROCEDURE deleteAppointmentStatusById(id int)
	BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
			BEGIN
				ROLLBACK;
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error in deleting patient or appointments';
			END;

			START TRANSACTION;

			UPDATE Doctor_Appointments 
			SET isActive = 0 
			WHERE D_AppointmentID = id;

			UPDATE ConsultationQueue_details 
			SET isActive = 0
			WHERE D_AppointmentID = id;
            
			COMMIT;
	END $$
DELIMITER ;

call deleteAppointmentStatusById(1);


-- ================================================================================================================================================================================
-- update appointment status

DELIMITER $$
CREATE PROCEDURE updateAppointmentStatusById(id int, ap_status varchar(20))
	BEGIN
		UPDATE Doctor_Appointments 
		SET Status =  ap_status
		WHERE D_AppointmentID = id;
	END $$
DELIMITER ;

call updateAppointmentStatusById(2, 'confirmed');

select * from Doctor_Appointments;
select * from ConsultationQueue;
select * from ConsultationQueue_details;
