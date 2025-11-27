# Edit Shipment - Data Not Showing Explanation

## Why Some Fields Are Empty

When you edit a shipment, you'll notice that some fields are empty even though you filled them when creating the shipment. This is because **the backend only stores core shipment data**.

### Fields That ARE Stored and Will Show:
✅ Origin Country
✅ Origin City  
✅ Origin Address
✅ Destination Country
✅ Destination City
✅ Destination Address
✅ Product Type
✅ Weight
✅ Description

### Fields That Are NOT Stored (Will Be Empty):
❌ Sender Name
❌ Sender Phone
❌ Sender Email
❌ Recipient Name
❌ Recipient Phone
❌ Recipient Email
❌ Dimensions (Length, Width, Height)
❌ Declared Value
❌ Quantity
❌ Insurance
❌ Fragile
❌ Special Instructions
❌ Postal Codes

## Why This Happens

The backend `Shipment` model only has these fields:
```java
- origin (String)
- destination (String)
- description (String)
- weight (Double)
- productType (ProductType)
- status (ShipmentStatus)
- trackingNumber (String)
- user (User)
```

The frontend form collects additional information for a better user experience, but this extra data is not persisted to the database.

## Solution Implemented

Added an informational alert at the top of the edit form:
> **Note:** Only core shipment details (origin, destination, weight, product type, description) are stored and editable. Other fields like sender/recipient info, dimensions, and declared value are for reference only and not saved.

## If You Want to Store All Fields

To store all the fields, you would need to:

1. **Update Backend Model** (`Shipment.java`):
```java
// Add these fields
private String senderName;
private String senderPhone;
private String senderEmail;
private String recipientName;
private String recipientPhone;
private String recipientEmail;
private Double length;
private Double width;
private Double height;
private Double declaredValue;
private Integer quantity;
private Boolean insurance;
private Boolean fragile;
private String specialInstructions;
private String originPostalCode;
private String destinationPostalCode;
```

2. **Update Database Schema**:
- Add columns to `shipments` table
- Run database migration

3. **Update Backend DTOs**:
- Update `CreateShipmentRequest`
- Update `UpdateShipmentRequest`

4. **Update Backend Controllers**:
- Handle the new fields in create/update methods

5. **Update Frontend Services**:
- Send all fields to backend

## Current Workaround

For now, users should understand that:
- The form shows all fields for data entry
- Only core fields are saved
- When editing, non-core fields will be empty
- Users can re-enter non-core fields if needed (though they won't be saved)

## User Experience

The current implementation:
✅ Allows users to enter detailed information
✅ Stores essential shipment data
✅ Keeps database simple and focused
✅ Provides clear messaging about what's stored

The trade-off is that some fields won't persist between edits.
