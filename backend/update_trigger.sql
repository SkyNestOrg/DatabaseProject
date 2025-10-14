--@block
DROP TRIGGER IF EXISTS update_bill_after_service_completed;
--@block
DROP TRIGGER IF EXISTS update_bill_after_service_completed;
CREATE TRIGGER update_bill_after_service_completed
AFTER
UPDATE ON service_request FOR EACH ROW BEGIN
DECLARE service_charge DECIMAL(10, 2);
DECLARE tax_percentage DECIMAL(10, 2) DEFAULT 0;
DECLARE current_service_total DECIMAL(10, 2);
DECLARE current_room_total DECIMAL(10, 2);
DECLARE current_due_amount DECIMAL(10, 2);
DECLARE service_increase DECIMAL(10, 2);
DECLARE tax_increase DECIMAL(10, 2);
-- Only when status changes to 'Completed'
IF NEW.status = 'Completed'
AND OLD.status <> 'Completed' THEN
SELECT unit_quantity_charges INTO service_charge
FROM service
WHERE service_type = NEW.request_type
    AND branch_id = NEW.branch_id
LIMIT 1;
IF service_charge IS NOT NULL THEN
SELECT b.service_total,
    b.room_total,
    b.due_amount,
    COALESCE(
        (
            SELECT latest_tax_percentage
            FROM taxes_and_charges
            ORDER BY revision_date DESC
            LIMIT 1
        ), 0
    ) INTO current_service_total,
    current_room_total,
    current_due_amount,
    tax_percentage
FROM bill b
WHERE b.booking_id = NEW.booking_id
LIMIT 1;
SET service_increase = service_charge * NEW.quantity;
SET tax_increase = service_increase * tax_percentage / 100;
UPDATE bill
SET service_total = current_service_total + service_increase,
    tax_amount = (
        current_room_total + current_service_total + service_increase
    ) * tax_percentage / 100,
    due_amount = current_due_amount + service_increase + tax_increase
WHERE booking_id = NEW.booking_id;
END IF;
END IF;
END;