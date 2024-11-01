CREATE DATABASE HMS;
USE HMS;


-- 1. Patients Table
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY auto_increment,  -- Unique identifier for each patient
    FirstName VARCHAR(100) NOT NULL,          -- First name of the patient
    LastName VARCHAR(100) NOT NULL,           -- Last name of the patient
    DOB DATE NOT NULL,                         -- Date of birth
    Gender CHAR(1) NOT NULL,                  -- Gender: 'M' or 'F'
    ContactNumber VARCHAR(15) NOT NULL,       -- Patient's contact number
    Address VARCHAR(255) NOT NULL,             -- Residential address	
    CNIC VARCHAR(20) NOT NULL,           -- Unique CNIC number
    isActive boolean not null
);

create unique index idx_cnic on Patients(CNIC);

-- 2. Departments Table
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    DepartmentName VARCHAR(100) NOT NULL,
    HOD INT NOT NULL
);



-- 16. UserAccounts Table
CREATE TABLE UserAccounts (
    UserID INT PRIMARY KEY auto_increment,          -- Unique identifier for each user account
    Name VARCHAR(100) NOT NULL,                     -- Name of the user
    Email VARCHAR(100) NOT NULL,                    -- Email of the user
    Password VARCHAR(100) NOT NULL,                 -- Password for the user
    Address VARCHAR(255) NOT NULL,                  -- Address of the user
    Photo VARCHAR(255),                             -- Path to the user's photo
    DOB DATE NOT NULL,                              -- Date of birth of the user
    ContactNumber VARCHAR(15) NOT NULL,            -- Contact number of the user
    AccountType VARCHAR(50) NOT NULL,                -- Type of account (Doctor, Lab Assistant, Receptionist, Pharmacist)
    isActive boolean not null
);



-- 3. Doctors Table
CREATE TABLE Doctors (
    DoctorID INT PRIMARY KEY auto_increment,     -- Unique identifier for each doctor
    DepartmentID INT,                           -- Foreign key to the Departments table
    UserID INT NOT NULL,                        -- Foreign key to the UserAccounts table
    Specialization VARCHAR(100) NOT NULL,       -- Medical specialization
    Status VARCHAR(50) NOT NULL,                -- Employment status
    DOJ DATE NOT NULL,                          -- Date of joining
    isActive boolean not null,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
    FOREIGN KEY (UserID) REFERENCES UserAccounts(UserID) -- Link to UserAccounts table
);


CREATE TABLE DoctorAvailability (
    AvailabilityID INT PRIMARY KEY AUTO_INCREMENT,  -- Unique identifier for each availability slot
    DoctorID INT NOT NULL,                          -- Foreign key to Doctors table
    RoomNO INT NOT NULL,                            -- Room number for the availability
    AvailableDay ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL, -- Day of the week
    StartTime TIME NOT NULL,                        -- Start time of the availability slot
    EndTime TIME NOT NULL,                          -- End time of the availability slot
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE  -- Ensures availability is removed if doctor is deleted
);


-- 4. LabTests Table
CREATE TABLE LabTests (
    TestID INT PRIMARY KEY auto_increment,      -- Unique identifier for each test
    TestName VARCHAR(100) NOT NULL,            -- Name of the test (e.g., Blood Test)
    ProcessingTime TIME NOT NULL,              -- Time taken to process the test
    Cost DECIMAL(10, 2) NOT NULL                -- Cost of the test
);



CREATE TABLE ConsultationQueue (
    QueueID INT auto_increment,         -- Unique identifier for each consultation queue entry
    DoctorID INT NOT NULL,                     -- Foreign key to the Doctors table
    Date DATE NOT NULL,
    AvailabilityID INT NOT NULL,                    -- Foreign key to the DoctorAvailability table
    AppointmentDateTime DATETIME NOT NULL,                  -- Date of the appointment
    PRIMARY KEY (QueueID, DoctorID, Date),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE,  -- Link to Doctors table
    FOREIGN KEY (AvailabilityID) REFERENCES DoctorAvailability(AvailabilityID) ON DELETE CASCADE  -- Link to DoctorAvailability table
);



-- 5. Appointments Table
CREATE TABLE Doctor_Appointments (
    D_AppointmentID INT PRIMARY KEY auto_increment, -- Unique identifier for each appointment
    AppointmentDate DATE NOT NULL,                  -- Appointment date
    AppointmentTime TIME NOT NULL,                  -- Appointment time
    Status VARCHAR(50) NOT NULL,                    -- Status (Pending, Confirmed, Completed)
    PatientID INT NOT NULL,                         -- Foreign key to the Patients table
    DoctorID INT,                                   -- Foreign key to the Doctors table
    RoomNumber VARCHAR(50) NOT NULL,                -- Room number for the appointment
    QueueNumber INT NOT NULL,                       -- Queue number for the patient
    AppointmentType ENUM('Consultation', 'Lab'),           -- Type of appointment (Consultation or Lab Test)
    QueueID INT NOT NULL,                       -- Foreign key to the ConsultationQueue table
    isActive boolean not null,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID),
    FOREIGN KEY (QueueID) REFERENCES ConsultationQueue(QueueID) -- Link to ConsultationQueue
);





CREATE TABLE Lab_Appointments (
    L_AppointmentID INT PRIMARY KEY auto_increment, -- Unique identifier for each appointment
    AppointmentDate DATE NOT NULL,               -- Appointment date
    AppointmentTime TIME NOT NULL,               -- Appointment time
    Status VARCHAR(50) NOT NULL,                 -- Status (Pending, Confirmed, Completed)
    PatientID INT NOT NULL,                      -- Foreign key to the Patients table
    LabTestID INT,                                -- Foreign key to the Doctors table
    RoomNumber VARCHAR(50) NOT NULL,            -- Room number for the appointment
    QueueNumber INT NOT NULL,                    -- Queue number for the patient
    AppointmentType ENUM('Consultation', 'Lab'),       -- Type of appointment (Consultation or Lab Test)
    isActive boolean not null,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (LabTestID) REFERENCES LabTests(TestID)
);

-- 6. MedicalHistory Table
CREATE TABLE MedicalHistory (
    MedicalHistoryID INT PRIMARY KEY auto_increment, -- Unique identifier for each entry
    PatientID INT NOT NULL,                          -- Foreign key to the Patients table
    Diagnosis TEXT,                                  -- Patient's diagnosis
    TreatmentHistory TEXT,                           -- History of treatments
    Allergies TEXT,                                  -- Known allergies
    PreviousSurgeries TEXT,                          -- Previous surgeries
    FamilyHistory TEXT,                              -- Family medical history
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);

-- 7. Prescriptions Table
CREATE TABLE Prescriptions (
    PrescriptionID INT PRIMARY KEY auto_increment,  -- Unique identifier for each prescription
    PatientID INT NOT NULL,                         -- Foreign key to the Patients table
    DoctorID INT NOT NULL,                          -- Foreign key to the Doctors table
    Date DATE NOT NULL,                             -- Date of prescription
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);

-- 10. Inventory Table
CREATE TABLE Inventory (
    InventoryItemID INT PRIMARY KEY auto_increment,     -- Unique identifier for each inventory item
    MedicineName VARCHAR(100) NOT NULL,            -- Name of the medicine
    Quantity INT NOT NULL,                          -- Quantity in stock
    ExpiryDate DATE NOT NULL,                       -- Expiry date of the medicine
    Cost DECIMAL(10, 2) NOT NULL                    -- Cost per unit
);

-- 8. PrescriptionDetails Table
CREATE TABLE PrescriptionDetails (
    DetailID INT PRIMARY KEY auto_increment,       -- Unique identifier for each prescription detail
    PrescriptionID INT NOT NULL,                   -- Foreign key to the Prescriptions table
    MedicineName VARCHAR(100) NOT NULL,           -- Name of the prescribed medicine
    Dosage VARCHAR(50) NOT NULL,                   -- Dosage instructions
    Instructions TEXT,
	InventoryItemID INT,                           -- Additional instructions for the patient
    FOREIGN KEY (PrescriptionID) REFERENCES Prescriptions(PrescriptionID),
	FOREIGN KEY (InventoryItemID) REFERENCES Inventory(InventoryItemID)
);

-- 9. Billing Table
CREATE TABLE Billing (
    BillingID INT PRIMARY KEY AUTO_INCREMENT,      -- Unique identifier for each billing record
    AppointmentType ENUM('Consultation', 'Lab'),
    PatientID INT NOT NULL,                        -- Foreign key to the Patients table
    Amount DECIMAL(10, 2) NOT NULL,                -- Amount charged
    PaymentMethod VARCHAR(50) NOT NULL,            -- Payment method (Cash, Credit Card, etc.)
    Date DATE NOT NULL,                            -- Billing date
    Type VARCHAR(50) NOT NULL,                     -- Billing type (Consultation, Lab Test, Pharmacy)
    IsRefunded BOOLEAN NOT NULL DEFAULT FALSE,     -- Flag to indicate if the billing record is a refund
    D_AppointmentID INT,
    L_AppointmentID INT,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (D_AppointmentID) REFERENCES Doctor_Appointments(D_AppointmentID),
    FOREIGN KEY (L_AppointmentID) REFERENCES Lab_Appointments(L_AppointmentID)
);



-- 11. Accounts Table
CREATE TABLE Accounts (
    AccountID INT PRIMARY KEY auto_increment,       -- Unique identifier for each account
    AccountType VARCHAR(50) NOT NULL              -- Account type (Doctor, Pharmacist, Receptionist, Lab Assistant)
);

CREATE TABLE Doctor_Acc (
	Doc_AccID INT PRIMARY KEY,
    DoctorID INT,       -- Unique identifier for each account
    AccountName VARCHAR(100) NOT NULL,             -- Name associated with the account
    Balance DECIMAL(10, 2) NOT NULL,
	AccountID INT,
	FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID),
	FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);

CREATE TABLE HospitalAndPhamacy_Acc (
	HnP_AccID INT PRIMARY KEY,
    AccountName VARCHAR(100) NOT NULL,             -- Name associated with the account
    AccountType VARCHAR(50) NOT NULL,
    Balance DECIMAL(10, 2) NOT NULL,
	AccountID INT,
	FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
);

-- 12. AccountTransactions Table
CREATE TABLE AccountTransactions (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,  -- Unique identifier for each transaction
    BillingID INT NOT NULL,                        -- Foreign key to Billing table
    AccountID INT NOT NULL,                        -- Foreign key to Accounts table
    Amount DECIMAL(10, 2) NOT NULL,                -- Amount involved in the transaction (positive or negative)
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of the transaction
    AccountType VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID),
    FOREIGN KEY (BillingID) REFERENCES Billing(BillingID)
);

CREATE TABLE ConsultationQueue_details (
    QueueDetailID INT PRIMARY KEY auto_increment,
	D_AppointmentID INT NOT NULL,
    PatientID INT NOT NULL,
	QueueNumber INT NOT NULL,
	QueueID INT NOT NULL,
	DoctorID INT NOT NULL,
	Date DATE NOT NULL,
    FOREIGN KEY (QueueID, DoctorID, Date) REFERENCES ConsultationQueue(QueueID, DoctorID, Date),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
	FOREIGN KEY (D_AppointmentID) REFERENCES Doctor_Appointments(D_AppointmentID)
);

CREATE TABLE LabQueue (
    QueueID INT auto_increment,
    TestID INT NOT NULL,
    Date DATE NOT NULL,
    PRIMARY KEY (QueueID, TestID, Date),
    FOREIGN KEY (TestID) REFERENCES LabTests(TestID)
);

CREATE TABLE LabQueue_details (
    QueueDetailID INT PRIMARY KEY auto_increment,
	L_AppointmentID INT NOT NULL,
    PatientID INT NOT NULL,
	QueueNumber INT NOT NULL,
	QueueID INT NOT NULL,
	TestID INT NOT NULL,
	Date DATE NOT NULL,
    FOREIGN KEY (QueueID, TestID, Date) REFERENCES LabQueue(QueueID, TestID, Date),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
	FOREIGN KEY (L_AppointmentID) REFERENCES Lab_Appointments(L_AppointmentID)
);

CREATE TABLE Refunds (
    RefundID INT PRIMARY KEY AUTO_INCREMENT,               -- Unique identifier for each refund
    BillingID INT NOT NULL,                                -- Link to the billing entry being refunded
    AppointmentType ENUM('Consultation', 'Lab') NOT NULL,               
    D_AppointmentID INT,                                   -- Foreign key to Doctor_Appointments (if AppointmentType is 1)
    L_AppointmentID INT,                                   -- Foreign key to Lab_Appointments (if AppointmentType is 0)
    RefundAmount DECIMAL(10, 2) NOT NULL,                  -- Amount refunded
    RefundDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        -- Date and time of refund
    RefundStatus VARCHAR(20) DEFAULT 'Pending',            -- Status of the refund: Pending, Approved, or Rejected
    Reason VARCHAR(255) DEFAULT 'Appointment Canceled',    -- Reason for the refund
    FOREIGN KEY (BillingID) REFERENCES Billing(BillingID), -- Link to the Billing table
    FOREIGN KEY (D_AppointmentID) REFERENCES Doctor_Appointments(D_AppointmentID),
    FOREIGN KEY (L_AppointmentID) REFERENCES Lab_Appointments(L_AppointmentID)
);

CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT NOT NULL,
    Message VARCHAR(255) NOT NULL,
    NotificationDate DATETIME NOT NULL,
    IsRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);


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
INSERT INTO PrescriptionDetails (PrescriptionID, MedicineName, Dosage, Instructions, InventoryItemID) VALUES
    (1, 'Metformin', 'Take 2 tablets twice a day', 'With food', 1),
    (2, 'Lisinopril', 'Take 1 tablet once a day', 'With water', 2),
    (3, 'Albuterol', 'Take 2 puffs twice a day', 'Before meals', 3),
    (4, 'Methotrexate', 'Take 1 tablet once a week', 'With food', 4),
    (5, 'Levothyroxine', 'Take 1 tablet once a day', 'With water', 5);

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

-- ================================================================================================================================================================================

-- patients
CREATE OR REPLACE VIEW PatientsView AS
      SELECT * FROM Patients where isActive = 1;

select * from PatientsView;
-- ================================================================================================================================================================================      

DELIMITER $$
CREATE PROCEDURE getPatientByID(id int)
	BEGIN
		SELECT * FROM Patients WHERE PatientID = id;
	END $$
DELIMITER ;

CALL getPatientByID(1);

-- ================================================================================================================================================================================

DELIMITER $$
CREATE PROCEDURE updatePatient(
		IN p_PatientID INT,
		IN p_FirstName VARCHAR(100),
		IN p_LastName VARCHAR(100),
		IN p_DOB DATE,
		IN p_Gender CHAR(1),
		IN p_ContactNumber VARCHAR(15),
		IN p_Address VARCHAR(255),
		IN p_CNIC VARCHAR(20),
        IN p_isActive boolean
        )
	BEGIN
		UPDATE Patients
			SET 
				FirstName = p_FirstName,
				LastName = p_LastName,
				DOB = p_DOB,
				Gender = p_Gender,
				ContactNumber = p_ContactNumber,
				Address = p_Address,
				CNIC = p_CNIC,
                isActive = p_isActive
			WHERE PatientID = p_PatientID;
	END $$
DELIMITER ;

CALL updatePatient(5, 'Randil', 'Hasanga', '2000-12-19', 'M', '0763456789', 'Temple Road, Waralla', '563456765V', true);

-- ================================================================================================================================================================================

DELIMITER $$

CREATE PROCEDURE addPatient(
		IN p_FirstName VARCHAR(100),
		IN p_LastName VARCHAR(100),
		IN p_DOB DATE,
		IN p_Gender CHAR(1),
		IN p_ContactNumber VARCHAR(15),
		IN p_Address VARCHAR(255),
		IN p_CNIC VARCHAR(20),
        IN p_isActive bool
)
BEGIN
        -- Insert new patient
        INSERT INTO Patients (FirstName, LastName, DOB, Gender, ContactNumber, Address, CNIC, isActive)
        VALUES (p_FirstName, p_LastName, p_DOB, p_Gender, p_ContactNumber, p_Address, p_CNIC, p_isActive);
    
END $$

DELIMITER ;

CALL addPatient('Kavindu', 'Sasanka', '2000-12-19', 'M', '0763456789', 'Temple Road, Waralla', '5656', true);

-- ================================================================================================================================================================================

DELIMITER $$

CREATE PROCEDURE DeletePatientAndAppointments(
    IN p_patientId INT
)
BEGIN
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error in deleting patient or appointments';
    END;

    START TRANSACTION;

    UPDATE Patients 
    SET isActive = 0 
    WHERE PatientID = p_patientId;

    UPDATE Doctor_Appointments 
    SET isActive = 0
    WHERE PatientID = p_patientId;

    UPDATE Lab_Appointments 
    SET isActive = 0 
    WHERE PatientID = p_patientId;

    COMMIT;
END $$

DELIMITER ;

call DeletePatientAndAppointments(3);

-- ================================================================================================================================================================================
-- ================================================================================================================================================================================

create view vw_inventory
as
select * from Inventory;

-- ================================================================================================================================================================================

DELIMITER $$
CREATE PROCEDURE getInventoryItemByID(id int)
	BEGIN
		SELECT * FROM Inventory WHERE InventoryItemID = id;
	END $$
DELIMITER ;

call getInventoryItemByID(1);

-- ================================================================================================================================================================================

DELIMITER $$
CREATE PROCEDURE updateInventoryItem(
		i_InventoryItemID INT ,    
		i_MedicineName VARCHAR(100),  
		i_Quantity INT, 
		i_ExpiryDate DATE,
		i_Cost DECIMAL(10, 2)
        )
	BEGIN
		UPDATE Inventory
			SET 
				MedicineName = i_MedicineName,
				Quantity = i_Quantity,
				ExpiryDate = i_ExpiryDate,
				Cost = i_Cost
			WHERE InventoryItemID = i_InventoryItemID;
	END $$
DELIMITER ;

call updateInventoryItem(4, "panadol", 33, '2026-10-31', 0.40);

select * from vw_inventory;



