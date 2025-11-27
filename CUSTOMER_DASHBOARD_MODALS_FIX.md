# Customer Dashboard Modals - Fixed

## Issues Fixed

### 1. Modal Doesn't Close After Submission ✅
**Problem**: After creating or updating a shipment, the modal stayed open

**Solution**: 
- Added `postMessage` to create-shipment component
- Added `postMessage` to edit-shipment component
- Parent window (customer dashboard) listens for these messages and closes the modal

**How it works**:
1. User submits form in modal (iframe)
2. Success alert shows
3. Component sends message to parent: `window.parent.postMessage('shipment-created', '*')`
4. Parent dashboard receives message and closes modal
5. Dashboard refreshes shipment list

### 2. Edit Modal Data Loading
**How it works**:
- Modal loads `/edit-shipment/{id}` in iframe
- Edit component's `ngOnInit()` runs
- `loadShipment()` fetches shipment data from API
- Form is populated with `patchValue()`
- Data should display in the form

**If data still doesn't show**:
Check browser console (F12) for errors when opening edit modal. The edit component should:
1. Fetch shipment by ID
2. Check if status is 'REQUESTED' (only editable status)
3. Parse origin/destination addresses
4. Populate form fields

## Testing

### Test Create Modal
1. Login as customer
2. Go to customer dashboard
3. Click "Create New Shipment"
4. Modal opens with create form
5. Fill in all required fields
6. Click "Create Shipment"
7. Success message appears
8. **Modal should close automatically**
9. Dashboard should refresh showing new shipment

### Test Edit Modal
1. Have a shipment with status 'REQUESTED'
2. Click edit button (pencil icon)
3. Modal opens with edit form
4. **Form should show existing shipment data**
5. Make changes
6. Click "Update Shipment"
7. Success message appears
8. **Modal should close automatically**
9. Dashboard should refresh showing updated data

## Files Modified
- `frontend/src/app/components/customer-dashboard/customer-dashboard.component.ts`
- `frontend/src/app/components/create-shipment/create-shipment.component.ts`
- `frontend/src/app/components/edit-shipment/edit-shipment.component.ts`

## Technical Details

### PostMessage Communication
```typescript
// In create/edit components (child iframe)
if (window.parent !== window) {
  window.parent.postMessage('shipment-created', '*');
} else {
  this.router.navigate(['/customer']);
}
```

```typescript
// In customer dashboard (parent)
window.addEventListener('message', (e) => {
  if (e.data === 'shipment-created' || e.data === 'shipment-updated') {
    this.closeCreateModal();
    this.closeEditModal();
  }
});
```

### Modal Structure
- Uses Bootstrap modal classes
- Iframe loads full create/edit pages
- Modal backdrop for click-outside-to-close
- Close button in header

## Benefits
✅ No page navigation - stay on dashboard
✅ Better UX - modal workflow
✅ Auto-close after success
✅ Auto-refresh data
✅ Reuses existing create/edit components
