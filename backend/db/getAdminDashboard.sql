use hms;

DELIMITER //

CREATE PROCEDURE GetDashboardStatistics()
BEGIN
    -- 1. Get count of active doctors where account type is 'Doctor'
    SELECT COUNT(*) AS doctorCount
    INTO @doctorCount
    FROM Doctors d
    JOIN UserAccounts ua ON d.UserID = ua.UserID
    WHERE ua.isActive = 1 AND ua.AccountType = 'Doctor';

    -- 2. Get count of active patients
    SELECT COUNT(*) AS patientCount
    INTO @patientCount
    FROM Patients
    WHERE isActive = 1;

    -- 3. Get count of active appointments
    SELECT COUNT(*) AS appointmentCount
    INTO @appointmentCount
    FROM Doctor_Appointments
    WHERE isActive = 1;

    -- 4. Get revenue for 'Hospital Acc' from HospitalAndPhamacy_Acc table
    SELECT Balance AS revenue
    INTO @revenue
    FROM HospitalAndPhamacy_Acc
    WHERE AccountName = 'Hospital Acc';

    -- 5. Get monthly patient gender distribution
    DROP TEMPORARY TABLE IF EXISTS MonthlyPatientGender;
    CREATE TEMPORARY TABLE MonthlyPatientGender (
        month CHAR(3),
        maleCount INT,
        femaleCount INT
    );

    INSERT INTO MonthlyPatientGender (month, maleCount, femaleCount)
    SELECT 
        DATE_FORMAT(DOB, '%b') AS month,
        SUM(CASE WHEN Gender = 'M' THEN 1 ELSE 0 END) AS maleCount,
        SUM(CASE WHEN Gender = 'F' THEN 1 ELSE 0 END) AS femaleCount
    FROM Patients
    WHERE isActive = 1
    GROUP BY month;

    -- 6. Get patient distribution by department
    DROP TEMPORARY TABLE IF EXISTS DepartmentDistribution;
    CREATE TEMPORARY TABLE DepartmentDistribution (
        DepartmentName VARCHAR(100),
        patientPercentage DECIMAL(5, 2)
    );

    INSERT INTO DepartmentDistribution (DepartmentName, patientPercentage)
    SELECT 
        dep.DepartmentName,
        (COUNT(DISTINCT p.PatientID) / (SELECT COUNT(*) FROM Patients WHERE isActive = 1)) * 100 AS patientPercentage
    FROM Departments dep
    JOIN Doctors d ON d.DepartmentID = dep.DepartmentID AND d.isActive = 1
    JOIN Doctor_Appointments da ON da.DoctorID = d.DoctorID AND da.isActive = 1
    JOIN Patients p ON p.PatientID = da.PatientID
    GROUP BY dep.DepartmentID;

    -- Final Select to get all data
    SELECT @doctorCount AS Doctors,
           @patientCount AS Patients,
           @appointmentCount AS Appointments,
           @revenue AS Revenue;

    -- Select statements for temporary tables
    SELECT * FROM MonthlyPatientGender;
    SELECT * FROM DepartmentDistribution;
    
END //

DELIMITER ;

CALL GetDashboardStatistics();