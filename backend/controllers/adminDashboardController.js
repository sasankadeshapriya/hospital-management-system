const db = require('../db');

const getDashboardStatistics = async (req, res) => {
    try {
        // Query 1: Fetch main counts
        const countsQuery = `
            SELECT 
                (SELECT COUNT(*) FROM Doctors d JOIN UserAccounts ua ON d.UserID = ua.UserID WHERE ua.isActive = 1 AND ua.AccountType = 'Doctor') AS doctorCount,
                (SELECT COUNT(*) FROM Patients WHERE isActive = 1) AS patientCount,
                (SELECT COUNT(*) FROM Doctor_Appointments WHERE isActive = 1) AS appointmentCount,
                (SELECT Balance FROM HospitalAndPhamacy_Acc WHERE AccountName = 'Hospital Acc') AS revenue
        `;
        const [countsResult] = await db.queryPromise(countsQuery);

        // Query 2: Fetch monthly patient gender distribution
        const genderDistributionQuery = `
            SELECT 
                DATE_FORMAT(DOB, '%b') AS month,
                SUM(CASE WHEN Gender = 'M' THEN 1 ELSE 0 END) AS maleCount,
                SUM(CASE WHEN Gender = 'F' THEN 1 ELSE 0 END) AS femaleCount
            FROM Patients
            WHERE isActive = 1
            GROUP BY month
        `;
        const genderDistributionResult = await db.queryPromise(genderDistributionQuery);

        // Query 3: Fetch patient distribution by department
        const departmentDistributionQuery = `
            SELECT 
                dep.DepartmentName,
                (COUNT(DISTINCT p.PatientID) / (SELECT COUNT(*) FROM Patients WHERE isActive = 1)) * 100 AS patientPercentage
            FROM Departments dep
            JOIN Doctors d ON d.DepartmentID = dep.DepartmentID AND d.isActive = 1
            JOIN Doctor_Appointments da ON da.DoctorID = d.DoctorID AND da.isActive = 1
            JOIN Patients p ON p.PatientID = da.PatientID
            GROUP BY dep.DepartmentID
        `;
        const departmentDistributionResult = await db.queryPromise(departmentDistributionQuery);

        // Return results
        res.json({
            doctors: countsResult.doctorCount,
            patients: countsResult.patientCount,
            appointments: countsResult.appointmentCount,
            revenue: countsResult.revenue,
            genderDistribution: genderDistributionResult,
            departmentDistribution: departmentDistributionResult
        });
    } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
        res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
};

module.exports = { getDashboardStatistics };
