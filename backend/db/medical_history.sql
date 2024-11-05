-- ================================================================================================================================================================================
-- get medical history by id

DELIMITER $$
CREATE PROCEDURE getMedicalHistoryByPatientID(id int)
	BEGIN
		SELECT * FROM MedicalHistory WHERE PatientID = id;
	END $$
DELIMITER ;

call getMedicalHistoryByPatientID(1);

-- ================================================================================================================================================================================
-- add medical history by id

DELIMITER $$

CREATE PROCEDURE insertMedicalHistoryById(
		in_PatientID INT,
		in_Diagnosis TEXT,
		in_TreatmentHistory TEXT,
		in_Allergies TEXT,
		in_PreviousSurgeries TEXT,
		in_FamilyHistory TEXT
)
BEGIN		

			declare mh_count int;
            declare patient_count int;
            
			SELECT count(*) into patient_count from Patients where PatientID = in_PatientID;
			SELECT count(*) into mh_count from MedicalHistory where PatientID = in_PatientID;
			
            if patient_count = 0 then
				select "Patient does not exist. Please add patient first" as Warning;
			else
				if mh_count = 0 then
					insert into MedicalHistory(PatientID, Diagnosis, TreatmentHistory, Allergies, PreviousSurgeries,FamilyHistory)
					values (in_PatientID, in_Diagnosis, in_TreatmentHistory, in_Allergies, in_PreviousSurgeries, in_FamilyHistory);
				else
					update MedicalHistory
					set
						Diagnosis = in_Diagnosis,
						TreatmentHistory = in_TreatmentHistory,
						Allergies = in_Allergies,
						PreviousSurgeries = in_PreviousSurgeries,
						FamilyHistory = in_FamilyHistory
					where PatientID = in_PatientID;
				end if;
			end if;
END $$
DELIMITER ;

call insertMedicalHistoryById(8, " test", "treatment test", "allr test", "sergerie test", "family test");

-- ================================================================================================================================================================================
-- add medical history by id - function

DELIMITER $$
CREATE function updateMedicalHistoryById(
		in_PatientID INT,
		in_Diagnosis TEXT,
		in_TreatmentHistory TEXT,
		in_Allergies TEXT,
		in_PreviousSurgeries TEXT,
		in_FamilyHistory TEXT
)
returns varchar(50)
deterministic
BEGIN
		update MedicalHistory
		set
			Diagnosis = in_Diagnosis,
			TreatmentHistory = in_TreatmentHistory,
			Allergies = in_Allergies,
			PreviousSurgeries = in_PreviousSurgeries,
			FamilyHistory = in_FamilyHistory
		where PatientID = in_PatientID;
        
        return "Medical history updated successfully";
END $$
DELIMITER ;

select updateMedicalHistoryById(6, " test", "treatment test", "allr test", "sergerie test", "family test");


-- ================================================================================================================================================================================
-- delete medical history by id - function

DELIMITER $$
CREATE function updateMedicalHistoryById(
		in_PatientID INT,
		in_Diagnosis TEXT,
		in_TreatmentHistory TEXT,
		in_Allergies TEXT,
		in_PreviousSurgeries TEXT,
		in_FamilyHistory TEXT
)
returns varchar(50)
deterministic
BEGIN
		update MedicalHistory
		set
			Diagnosis = in_Diagnosis,
			TreatmentHistory = in_TreatmentHistory,
			Allergies = in_Allergies,
			PreviousSurgeries = in_PreviousSurgeries,
			FamilyHistory = in_FamilyHistory
		where PatientID = in_PatientID;
        
        return "Medical history updated successfully";
END $$
DELIMITER ;

select updateMedicalHistoryById(6, " test", "treatment test", "allr test", "sergerie test", "family test");


select * from medicalhistory;
select * from patients;