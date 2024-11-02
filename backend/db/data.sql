INSERT INTO Patients (FirstName, LastName, DOB, Gender, ContactNumber, Address, CNIC, isActive) VALUES
    ('Alice', 'Green', '1988-04-12', 'F', '0712345679', '123 Green St, Colombo', '923456790V', true),
    ('Bob', 'Brown', '1992-09-15', 'M', '0712345680', '456 Brown St, Colombo', '923456791V',true),
    ('Charlie', 'Black', '1985-01-22', 'M', '0712345681', '789 Black St, Colombo', '923456792V',true),
    ('Diana', 'White', '1993-07-30', 'F', '0712345682', '101 White St, Colombo', '923456793V',true),
    ('Ethan', 'Blue', '1990-03-05', 'M', '0712345683', '202 Blue St, Colombo', '923456794V',true);

-- Sample Data for Departments Table
INSERT INTO Departments (DepartmentName, HOD) VALUES
    ('Cardiology', 1),
    ('Neurology', 2),
    ('Oncology', 3),
    ('Pediatrics', 4),
    ('Orthopedics', 5);

-- Sample Data for UserAccounts Table
INSERT INTO UserAccounts (Name, Email, Password, Address, Photo, DOB, ContactNumber, AccountType, isActive) VALUES
    ('Dr. Alice Thompson', 'alice.thompson@example.com', 'password123', '123 Main St, Colombo', '/images/alice.jpg', '1975-05-12', '0711234567', 'Doctor', true),
    ('Dr. Robert Williams', 'robert.williams@example.com', 'password123', '456 Elm St, Galle', '/images/robert.jpg', '1978-08-23', '0717654321', 'Doctor', true),
    ('Dr. Susan Taylor', 'susan.taylor@example.com', 'password123', '789 Oak St, Kandy', '/images/susan.jpg', '1980-03-14', '0771234567', 'Doctor', true),
    ('Dr. John Brown', 'john.brown@example.com', 'password123', '101 Pine St, Matara', '/images/john.jpg', '1983-11-29', '0757654321', 'Doctor', true),
    ('Dr. Emma White', 'emma.white@example.com', 'password123', '202 Cedar St, Kurunegala', '/images/emma.jpg', '1979-06-18', '0719876543', 'Doctor', true),
    ('Sarah Lewis', 'sarah.lewis@example.com', 'password123', '303 Maple St, Negombo', '/images/sarah.jpg', '1985-01-21', '0714567890', 'Receptionist', true),
    ('Linda Lee', 'linda.lee@example.com', 'password123', '404 Birch St, Jaffna', '/images/linda.jpg', '1990-07-14', '0761234567', 'Lab Assistant', true),
    ('James Walker', 'james.walker@example.com', 'password123', '505 Walnut St, Colombo', '/images/james.jpg', '1984-10-08', '0759876543', 'Pharmacist', true);

-- Sample Data for Doctors Table
INSERT INTO Doctors (DepartmentID, UserID, Specialization, Status, DOJ, isActive) VALUES
    (1, 1, 'Cardiologist', 'Active', '2005-04-15', true),
    (2, 2, 'Neurologist', 'Active', '2007-07-20', true),
    (3, 3, 'Oncologist', 'Active', '2010-09-12', true),
    (4, 4, 'Pediatrician', 'Active', '2012-12-01', true),
    (5, 5, 'Orthopedic Surgeon', 'Active', '2014-05-25', true);

-- Sample Data for DoctorAvailability Table
INSERT INTO DoctorAvailability (DoctorID, RoomNO, AvailableDay, StartTime, EndTime) VALUES
    (1, 101, 'Monday', '09:00:00', '17:00:00'),
    ( 1, 101, 'Wednesday', '09:00:00', '17:00:00'),
    (2, 102, 'Tuesday', '10:00:00', '18:00:00'),
    (2, 102, 'Thursday', '10:00:00', '18:00:00'),
    (3, 103, 'Monday', '11:00:00', '15:00:00'),
    (3, 103, 'Friday', '11:00:00', '15:00:00'),
    (4, 104, 'Tuesday', '08:00:00', '16:00:00'),
    (4, 104, 'Thursday', '08:00:00', '16:00:00'),
    (5, 105, 'Wednesday', '09:30:00', '17:30:00'),
    (5, 105, 'Saturday', '09:30:00', '17:30:00');

-- Sample Data for LabTests Table
INSERT INTO LabTests (TestName, ProcessingTime, Cost) VALUES
    ('Blood Test', '01:00:00', 1500.00),
    ('Urine Test', '00:30:00', 800.00),
    ('X-Ray', '01:30:00', 2500.00),
    ('MRI Scan', '02:00:00', 15000.00),
    ('CT Scan', '01:45:00', 12000.00),
    ('Lipid Profile', '01:00:00', 2000.00),
    ('Liver Function Test', '00:45:00', 1800.00),
    ('Thyroid Function Test', '00:45:00', 1200.00),
    ('Blood Sugar Test', '00:30:00', 1000.00),
    ('COVID-19 PCR Test', '02:00:00', 5000.00);

-- Sample Data for ConsultationQueue Table
INSERT INTO ConsultationQueue (DoctorID, Date, AvailabilityID, AppointmentDateTime) VALUES
    (1, '2024-10-28', 1, '2024-10-28 09:00:00'),
    (4, '2024-10-29', 7, '2024-10-29 10:00:00'),
    (2, '2024-10-29', 3, '2024-10-29 10:00:00'),
    (3, '2024-11-03', 5, '2024-11-03 11:00:00'),
    (2, '2024-11-07', 4, '2024-11-07 08:00:00'),
    (5, '2024-11-13', 9, '2024-11-13 09:30:00');

-- Sample Data for Doctor_Appointments Table
INSERT INTO Doctor_Appointments (AppointmentDate, AppointmentTime, Status, PatientID, DoctorID, RoomNumber, QueueNumber, AppointmentType, QueueID, isActive) VALUES
    ('2024-10-28', '09:00:00', 'Pending', 1, 1, '101', 1, 'Consultation', 1, true),
    ('2024-10-29', '10:00:00', 'Pending', 2, 4, '104', 2, 'Consultation', 2, true),
    ('2024-10-29', '10:00:00', 'Pending', 3, 2, '102', 3, 'Consultation', 3, true),
    ('2024-11-03', '11:00:00', 'Pending', 4, 3, '103', 4, 'Consultation', 4, true),
    ('2024-11-07', '08:00:00', 'Pending', 5, 2, '102', 5, 'Consultation', 5, true),
    ('2024-11-13', '09:30:00', 'Pending', 1, 5, '105', 6, 'Consultation', 6, true);

-- Sample Data for Lab_Appointments Table
INSERT INTO Lab_Appointments (AppointmentDate, AppointmentTime, Status, PatientID, LabTestID, RoomNumber, QueueNumber, AppointmentType, isActive) VALUES
    ('2024-10-28', '09:00:00', 'Pending', 1, 1, 'Lab 1', 1, 'Lab', true),
    ('2024-10-29', '10:00:00', 'Pending', 2, 2, 'Lab 2', 2, 'Lab', true),
    ('2024-10-29', '10:00:00', 'Pending', 3, 3, 'Lab 3', 3, 'Lab', true),
    ('2024-11-03', '11:00:00', 'Pending', 4, 4, 'Lab 4', 4, 'Lab', true),
    ('2024-11-07', '08:00:00', 'Pending', 5, 5, 'Lab 5', 5, 'Lab', true),
    ('2024-11-13', '09:30:00', 'Pending', 1, 6, 'Lab 6', 6, 'Lab', true);

-- Sample Data for MedicalHistory Table
INSERT INTO MedicalHistory (PatientID, Diagnosis, TreatmentHistory, Allergies, PreviousSurgeries, FamilyHistory) VALUES
    (1, 'Diabetes', 'Insulin treatment', 'Penicillin', 'Appendectomy', 'Family history of diabetes'),
    (2, 'Hypertension', 'Medication', 'Sulfa', 'Knee replacement', 'Family history of hypertension'),
    (3, 'Asthma', 'Inhaler', 'Aspirin', 'Tonsillectomy', 'Family history of asthma'),
    (4, 'Arthritis', 'Physical therapy', 'Ibuprofen', 'Hip replacement', 'Family history of arthritis'),
    (5, 'Hyperthyroidism', 'Medication', 'Thyroid medication', 'Thyroid surgery', 'Family history of hyperthyroidism');

INSERT INTO Inventory (MedicineName, Quantity, ExpiryDate, Cost) VALUES
    ('Metformin', 100, '2025-05-01', 0.50),
    ('Lisinopril', 200, '2024-12-15', 0.30),
    ('Albuterol', 150, '2025-03-10', 1.20),
    ('Methotrexate', 50, '2026-01-20', 2.00),
    ('Levothyroxine', 300, '2024-11-30', 0.40);

-- Sample Data for Prescriptions Table
INSERT INTO Prescriptions (PatientID, DoctorID, Date) VALUES
    (1, 1, '2024-10-28'),
    (2, 2, '2024-10-29'),
    (3, 3, '2024-10-29'),
    (4, 4, '2024-11-03'),
    (5, 5, '2024-11-07');

-- Sample Data for PrescriptionDetails Table
INSERT INTO PrescriptionDetails (PrescriptionID, MedicineName, Dosage_days,Dosage_per_day, Instructions) VALUES
    (1, 'Metformin', 4, 2, 'With food'),
    (2, 'Lisinopril', 5, 3, 'With water'),
    (3, 'Albuterol', 14, 1, 'Before meals'),
    (4, 'Methotrexate', 3, 3, 'With food'),
    (5, 'Levothyroxine', 5, 1, 'With water');

select * from PrescriptionDetails;
-- Sample Data for Billing Table
INSERT INTO Billing (AppointmentType, PatientID, Amount, PaymentMethod, Date, Type, IsRefunded, D_AppointmentID, L_AppointmentID) VALUES
    ('Consultation', 1, 1000.00, 'Cash', '2024-10-28', 'Consultation', FALSE, 1, NULL),
    ('Lab', 2, 500.00, 'Credit Card', '2024-10-29', 'Lab Test', FALSE, NULL, 1),
    ('Consultation', 3, 1500.00, 'Cash', '2024-10-29', 'Consultation', FALSE, 2, NULL),
    ('Lab', 4, 2000.00, 'Credit Card', '2024-11-03', 'Lab Test', FALSE, NULL, 2),
    ('Consultation', 5, 2500.00, 'Cash', '2024-11-07', 'Consultation', FALSE, 3, NULL);

INSERT INTO Accounts (AccountType) VALUES
    ('Doctor'),
    ('Pharmacist'),
    ('Receptionist'),
     ('Lab Assistant'),
    ('Administrator');
    
INSERT INTO Doctor_Acc (Doc_AccID, DoctorID, AccountName, Balance, AccountID) VALUES
    (1, 1, 'Dr. Alice Thompson', 5000.00, 1),
    (2, 2, 'Dr. Robert Williams', 6000.00, 1),
    (3, 3, 'Dr. Susan Taylor', 7000.00, 1),
    (4, 4, 'Dr. John Brown', 8000.00, 1),
    (5, 5, 'Dr. Emma White', 9000.00, 1);

-- Sample Data for HospitalAndPhamacy_Acc Table
INSERT INTO HospitalAndPhamacy_Acc (HnP_AccID, AccountName, AccountType, Balance, AccountID) VALUES
    (1, 'Main Pharmacy', 'Pharmacy', 15000.00, 2),
    (2, 'Lab Services', 'Lab', 12000.00, 2),
    (3, 'Reception', 'Reception', 8000.00, 2);

-- Sample Data for AccountTransactions Table
INSERT INTO AccountTransactions (BillingID, AccountID, Amount, TransactionDate, AccountType, Description) VALUES
    (1, 1, 1000.00, NOW(), 'Doctor', 'Consultation fee for Patient 1'),
    (2, 2, 500.00, NOW(), 'Pharmacy', 'Lab test fee for Patient 2'),
    (3, 3, 1500.00, NOW(), 'Doctor', 'Consultation fee for Patient 3'),
    (4, 4, 2000.00, NOW(), 'Lab', 'Lab test fee for Patient 4'),
    (5, 5, 2500.00, NOW(), 'Doctor', 'Consultation fee for Patient 5');

-- Sample Data for ConsultationQueue_details Table
INSERT INTO ConsultationQueue_details (D_AppointmentID, PatientID, QueueNumber, QueueID, DoctorID, Date) VALUES
    (1, 1, 1, 1, 1, '2024-10-28'),
    (2, 2, 2, 2, 4, '2024-10-29'),
    (3, 3, 3, 3, 2, '2024-10-29'),
    (4, 4, 4, 4, 3, '2024-11-03'),
    (5, 5, 5, 5, 2, '2024-11-07');

-- Sample Data for LabQueue Table
INSERT INTO LabQueue (QueueID, TestID, Date) VALUES
    (1, 1, '2024-10-28'),
    (2, 2, '2024-10-29'),
    (3, 3, '2024-10-29'),
    (4, 4, '2024-11-03'),
    (5, 5, '2024-11-07');

-- Sample Data for LabQueue_details Table
INSERT INTO LabQueue_details (L_AppointmentID, PatientID, QueueNumber, QueueID, TestID, Date) VALUES
    (1, 1, 1, 1, 1, '2024-10-28'),
    (2, 2, 2, 2, 2, '2024-10-29'),
    (3, 3, 3, 3, 3, '2024-10-29'),
    (4, 4, 4, 4, 4, '2024-11-03'),
    (5, 5, 5, 5, 5, '2024-11-07');

-- Sample Data for Refunds Table
INSERT INTO Refunds (BillingID, AppointmentType, D_AppointmentID, L_AppointmentID, RefundAmount, RefundDate, RefundStatus, Reason) VALUES
    (1, 'Consultation', 1, NULL, 1000.00, NOW(), 'Pending', 'Appointment Canceled'),
    (2, 'Lab', NULL, 1, 500.00, NOW(), 'Pending', 'Test Not Required'),
    (3, 'Consultation', 2, NULL, 1500.00, NOW(), 'Pending', 'Patient No Show'),
    (4, 'Lab', NULL, 2, 2000.00, NOW(), 'Pending', 'Test Cancelled');


-- Sample Data for Notifications Table
INSERT INTO Notifications (PatientID, Message, NotificationDate, IsRead) VALUES
    (1, 'Your appointment is confirmed for October 28, 2024.', '2024-10-01 10:00:00', FALSE),
    (2, 'Your lab test results are ready for review.', '2024-10-02 11:00:00', FALSE),
    (3, 'Reminder: Your consultation is scheduled for October 29, 2024.', '2024-10-03 09:30:00', FALSE),
    (4, 'You have a new message from your doctor.', '2024-10-04 14:00:00', TRUE),
    (5, 'Your prescription has been updated.', '2024-10-05 08:15:00', FALSE);
    
ALTER TABLE Departments ADD  FOREIGN KEY (HOD) REFERENCES Doctors(DoctorID);
ALTER TABLE Doctors ADD  FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID);