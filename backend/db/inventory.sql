-- ================================================================================================================================================================================
-- get all inventory items

create view vw_inventory
as
select * from Inventory;

-- ================================================================================================================================================================================
-- get expired inventory items

create view vw_inventory_expired
as
select * from Inventory WHERE ExpiryDate < current_date();


-- ================================================================================================================================================================================
-- get item by ID

DELIMITER $$
CREATE PROCEDURE getInventoryItemByID(id int)
	BEGIN
		SELECT * FROM Inventory WHERE InventoryItemID = id;
	END $$
DELIMITER ;

call getInventoryItemByID(1);

-- ================================================================================================================================================================================
-- UPDATE item

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

-- ================================================================================================================================================================================
-- DELETE Inventory Item

DELIMITER $$
CREATE TRIGGER before_inventory_delete
BEFORE DELETE ON Inventory
FOR EACH ROW
BEGIN
    INSERT INTO InventoryArchive
    SET InventoryItemID = OLD.InventoryItemID,
        MedicineName = OLD.MedicineName,
        Quantity = OLD.Quantity,
        ExpiryDate = OLD.ExpiryDate,
        Cost = OLD.Cost,
        deleted_at = NOW();
END $$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE deleteInventoryItemByID(IN itemID INT)
BEGIN
    DELETE FROM Inventory WHERE InventoryItemID = itemID;
END $$
DELIMITER ;

call deleteInventoryItemByID(3);
