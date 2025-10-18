# QA Testing Notes - Restaurant ID Query Parameter Feature

## Feature Overview
This feature allows users to share direct links to specific restaurants by including the restaurant ID in the URL query string. When opening such a link, the application automatically loads the restaurant menu, bypassing the search screen.

## Test Scenarios

### 1. Selecting a Restaurant Adds ID to URL
**Steps:**
1. Open the application at the home page (e.g., `http://localhost:3000`)
2. Enter a restaurant name in the search bar (e.g., "Demo Restaurant")
3. Click the "Cerca" button
4. Observe the URL in the browser address bar

**Expected Result:**
- The URL should update to include `?restaurantId=Demo%20Restaurant` (or the restaurant name you searched for)
- The restaurant menu should be displayed
- The browser's back button should not create history entries for the URL change (using replace)

### 2. Opening Page with restaurantId Parameter Loads Restaurant Directly
**Steps:**
1. Open the application with a restaurant ID in the URL (e.g., `http://localhost:3000?restaurantId=Demo%20Restaurant`)
2. Observe the page behavior

**Expected Result:**
- The search bar should be bypassed
- The restaurant menu should load automatically
- The loading indicator should appear briefly
- The menu items should be displayed when loading completes

### 3. Short Parameter Key Support ('r')
**Steps:**
1. Open the application with the short parameter key (e.g., `http://localhost:3000?r=Demo%20Restaurant`)

**Expected Result:**
- The behavior should be identical to using `restaurantId`
- The restaurant menu should load automatically

### 4. Invalid Restaurant ID Shows Error
**Steps:**
1. Open the application with an invalid restaurant ID (e.g., `http://localhost:3000?restaurantId=NonExistentRestaurant123`)

**Expected Result:**
- An error message should be displayed: "Ristorante non trovato. Verifica il nome e riprova."
- The search bar should remain visible
- Users can enter a different restaurant name to search

### 5. Preserving Other Query Parameters
**Steps:**
1. Open the application with additional query parameters (e.g., `http://localhost:3000?utm_source=email&restaurantId=Demo%20Restaurant`)
2. Observe the URL after the restaurant loads

**Expected Result:**
- The `utm_source` parameter should remain in the URL
- Both parameters should coexist: `?utm_source=email&restaurantId=Demo%20Restaurant`

### 6. URL Sharing
**Steps:**
1. Search for and load a restaurant
2. Copy the URL from the browser address bar
3. Open the URL in a new browser tab or incognito window

**Expected Result:**
- The restaurant should load directly without requiring a search
- All menu items should be visible
- The experience should be identical to the original tab

## Implementation Details

### Technical Components
- **Hook:** `app/hooks/useRestaurantUrl.ts`
  - `readId()`: Reads restaurant ID from URL
  - `saveId(id, replace?)`: Saves restaurant ID to URL
  - `removeId(replace?)`: Removes restaurant ID from URL

- **Modified Component:** `app/menu/MenuPage.tsx`
  - Uses `useRestaurantUrl` hook
  - Auto-loads restaurant on mount if ID is present
  - Saves ID to URL when user searches successfully

### Query Parameter Keys
- Primary: `restaurantId`
- Abbreviated: `r`

Both keys are supported for reading, but only `restaurantId` is used when saving.

## Known Limitations
1. The restaurant ID is currently the restaurant name (`nome_locale`), not a UUID
2. Restaurant names with special characters are URL-encoded
3. The feature requires JavaScript to be enabled

## Browser Compatibility
- Tested with Next.js 15.3.0
- Uses Next.js App Router (not React Router)
- Compatible with modern browsers supporting URLSearchParams API
