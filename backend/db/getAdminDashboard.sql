use hms;


DELIMITER //
CREATE PROCEDURE GetCounts()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Doctors d JOIN UserAccounts ua ON d.UserID = ua.UserID WHERE ua.isActive = 1 AND ua.AccountType = 'Doctor') AS doctorCount,
        (SELECT COUNT(*) FROM Patients WHERE isActive = 1) AS patientCount,
        (SELECT COUNT(*) FROM Doctor_Appointments WHERE isActive = 1) AS appointmentCount,
        (SELECT Balance FROM HospitalAndPhamacy_Acc WHERE AccountName = 'Hospital Acc') AS revenue;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetMonthlyGenderDistribution()
BEGIN
    SELECT 
        DATE_FORMAT(DOJ, '%b') AS month,
        SUM(CASE WHEN Gender = 'M' THEN 1 ELSE 0 END) AS maleCount,
        SUM(CASE WHEN Gender = 'F' THEN 1 ELSE 0 END) AS femaleCount
    FROM Patients
    WHERE isActive = 1
    GROUP BY month;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetDepartmentDistribution()
BEGIN
    SELECT 
        dep.DepartmentName,
        (COUNT(DISTINCT p.PatientID) / (SELECT COUNT(*) FROM Patients WHERE isActive = 1)) * 100 AS patientPercentage
    FROM Departments dep
    JOIN Doctors d ON d.DepartmentID = dep.DepartmentID AND d.isActive = 1
    JOIN Doctor_Appointments da ON da.DoctorID = d.DoctorID AND da.isActive = 1
    JOIN Patients p ON p.PatientID = da.PatientID
    GROUP BY dep.DepartmentID;
END //
DELIMITER ;