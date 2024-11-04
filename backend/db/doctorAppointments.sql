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







