-- ================================================================================================================================================================================
-- get all abailability slots

create view vw_availabilitySlots
as
select AvailabilityID, DoctorID as 'Doctor Id',RoomNO as 'Room No', AvailableDay as 'Available Day', StartTime as 'Start Time', EndTime as 'End Time'
 from DoctorAvailability;

select * from vw_availabilitySlots;

-- ================================================================================================================================================================================
-- get abailability slots by id

DELIMITER $$
CREATE PROCEDURE getAvailabilitySlotsByID(id int)
	BEGIN
		select AvailabilityID, DoctorID as 'Doctor Id',RoomNO as 'Room No', AvailableDay as 'Available Day', StartTime as 'Start Time', EndTime as 'End Time'
		from DoctorAvailability
        where AvailabilityID = id;
	END $$
DELIMITER ;

call getAvailabilitySlotsByID(2);

-- ================================================================================================================================================================================
-- get abailability slots by doctor id

DELIMITER $$
CREATE PROCEDURE getAvailabilitySlotsByDocID(id int)
	BEGIN
		select AvailabilityID, DoctorID as 'Doctor Id',RoomNO as 'Room No', AvailableDay as 'Available Day', StartTime as 'Start Time', EndTime as 'End Time'
		from DoctorAvailability
        where DoctorID = id;
	END $$
DELIMITER ;

call getAvailabilitySlotsByDocID(2);

-- ================================================================================================================================================================================
-- get abailability slots by day

DELIMITER $$
CREATE PROCEDURE getAvailabilitySlotsByDay(day_ VARCHAR(20))
	BEGIN
		select AvailabilityID, DoctorID as 'Doctor Id',RoomNO as 'Room No', AvailableDay as 'Available Day', StartTime as 'Start Time', EndTime as 'End Time'
		from DoctorAvailability
        where LOWER(AvailableDay) = LOWER(day_);
	END $$
DELIMITER ;

call getAvailabilitySlotsByDay('monday');

-- ================================================================================================================================================================================
-- get abailability slots by room no

DELIMITER $$
CREATE PROCEDURE getAvailabilitySlotsByRoomNo(room_no int)
	BEGIN
		select AvailabilityID, DoctorID as 'Doctor Id',RoomNO as 'Room No', AvailableDay as 'Available Day', StartTime as 'Start Time', EndTime as 'End Time'
		from DoctorAvailability
        where RoomNO = room_no;
	END $$
DELIMITER ;

call getAvailabilitySlotsByRoomNo(101);

-- ================================================================================================================================================================================
-- insert slot

-- check availability
DELIMITER $$
CREATE PROCEDURE checkAvailability(
		room_no int,
        day_ VARCHAR(20),
        start_time time,
        end_time time
		
	)
	BEGIN
		select * 
		from DoctorAvailability 
		where RoomNO =  room_no
			AND lower(AvailableDay) = lower(day_)
			AND (
					(start_time between StartTime and EndTime) OR
					(end_time between StartTime and EndTime) OR
					(start_time < StartTime and end_time > EndTime)
				); 
	END $$
DELIMITER ;

call checkAvailability(101, 'monday', '20:00:00', '21:00:00');

-- insert

DELIMITER $$
CREATE PROCEDURE insertSlot(
		doc_id int,
		room_no int,
        day_ VARCHAR(20),
        start_time time,
        end_time time
		
	)
	BEGIN
		insert into DoctorAvailability(DoctorID, RoomNO, AvailableDay, StartTime, EndTime)
        values(doc_id, room_no, day_, start_time, end_time);
	END $$
DELIMITER ;

call insertSlot(101, 'monday', '10:00:00', '20:00:00');



call getAvailabilitySlotsByRoomNo(101);
delete from DoctorAvailability where AvailabilityID = 10;