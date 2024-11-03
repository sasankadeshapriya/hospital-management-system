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
    FOREIGN KEY (UserID) REFERENCES UserAccounts(UserID) -- Link to UserAccounts table
);

CREATE TABLE DoctorAvailability (
    AvailabilityID INT PRIMARY KEY AUTO_INCREMENT,  -- Unique identifier for each availability slot
    DoctorID INT NOT NULL,                          -- Foreign key to Doctors table
    RoomNO INT NOT NULL,                            -- Room number for the availability
    AvailableDay ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday') NOT NULL, -- Day of the week
    StartTime TIME NOT NULL,                        -- Start time of the availability slot
    EndTime TIME NOT NULL,                          -- End time of the availability slot
    isActive boolean,
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE  -- Ensures availability is removed if doctor is deleted
);

-- 4. LabTests Table
CREATE TABLE LabTests (
    TestID INT PRIMARY KEY auto_increment,      -- Unique identifier for each test
    TestName VARCHAR(100) NOT NULL,            -- Name of the test (e.g., Blood Test)
    ProcessingTime TIME NOT NULL,              -- Time taken to process the test
    Cost DECIMAL(10, 2) NOT NULL,                -- Cost of the test
    isActive boolean
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

CREATE TABLE InventoryArchive LIKE Inventory;
ALTER TABLE InventoryArchive 
ADD COLUMN deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;



-- 8. PrescriptionDetails Table
CREATE TABLE PrescriptionDetails (
    DetailID INT PRIMARY KEY auto_increment,       -- Unique identifier for each prescription detail
    PrescriptionID INT NOT NULL,                   -- Foreign key to the Prescriptions table
    MedicineName VARCHAR(100) NOT NULL,           -- Name of the prescribed medicine
    Dosage_days int NOT NULL,                   -- Dosage instructions
    Dosage_per_day int NOT NULL,                   -- Dosage instructions
    Instructions TEXT,
    FOREIGN KEY (PrescriptionID) REFERENCES Prescriptions(PrescriptionID)
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


-- archive table for department
CREATE TABLE archiveDepartment (
    ArchiveID INT PRIMARY KEY AUTO_INCREMENT,
    DepartmentID INT NOT NULL,
    DepartmentName VARCHAR(100) NOT NULL,
    HOD INT NOT NULL,
    DeletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

