-- ================================================================================================================================================================================
-- get all abailability slots

create view vw_availabilitySlots
as
select AvailabilityID, DoctorID as 'Doctor Id',RoomNO as 'Room No', AvailableDay as 'Available Day', StartTime as 'Start Time', EndTime as 'End Time', isActive
 from DoctorAvailability
 where isActive = true;

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
        where DoctorID = id and isActive = true;
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
        where LOWER(AvailableDay) = LOWER(day_) AND isActive = true;
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
        where RoomNO = room_no AND isActive = true;
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
            AND (isActive = true)
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
		insert into DoctorAvailability(DoctorID, RoomNO, AvailableDay, StartTime, EndTime, isActive)
        values(doc_id, room_no, day_, start_time, end_time, true);
	END $$
DELIMITER ;

call insertSlot(1,101, 'monday', '10:00:00', '20:00:00');

-- ================================================================================================================================================================================
-- update slot

DELIMITER $$
CREATE PROCEDURE updateSlot(
		slot_id int,
		doc_id int,
		room_no int,
        day_ VARCHAR(20),
        start_time time,
        end_time time
	)
	BEGIN
		UPDATE DoctorAvailability
        SET
			DoctorID = doc_id,
            RoomNO = room_no,
            AvailableDay = day_,
            StartTime = start_time,
            EndTime = end_time
        WHERE AvailabilityID = slot_id;
	END $$
DELIMITER ;


-- ================================================================================================================================================================================
-- delete slot - trigger / procedure

DELIMITER $$
CREATE PROCEDURE deleteAvailabilitySlotByID(IN slot_id INT)
BEGIN
   UPDATE DoctorAvailability
        SET
			isActive = 0
        WHERE AvailabilityID = slot_id;
END $$
DELIMITER ;

call deleteAvailabilitySlotByID(7);

