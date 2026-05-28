# Barber Flow & API Integration Analysis Report

This document provides a highly detailed analysis of the **Barber (Owner/Provider) flow**, directories, screen hierarchies, and core REST API integrations in the Barbershop application. You can use this blueprint to replicate similar UI layouts, states, and data-fetching hooks for new screens.

---

## 1. Directory & File Structure

The Barber module is completely modularized under two main directories:
- **Screens**: `src/screens/barber/`
- **Navigation**: `src/navigation/barber/`

### File Hierarchy Trace
```
src/screens/barber/
├── dashboard/
│   ├── BarberDashboard.tsx          # Main metrics panel, daily stats, revenue charts
│   └── BarberDashboardApi.ts        # TanStack query hooks for dashboard statistics
├── bookings/
│   ├── Bookings.tsx                 # List of bookings (Today, Future, Past) with filters
│   ├── BookingDetails.tsx           # Full view details and status actions for appointments
│   └── BookingApi.ts                # React Query hooks for booking records
├── services/
│   ├── Services.tsx                 # Services & Category editor list (Add, Edit, Delete)
│   └── ServiceApi.ts                # React Query CRUD hooks for categories and items
├── profile/
│   ├── Profile.tsx                  # Barber shop details, contact, bio editing
│   └── ProfileApi.ts                # Query hooks for retrieving barber profile
├── setting/
│   ├── Setting.tsx                  # Business hours, schedule intervals, booking slots
│   └── SettingApi.ts                # Post/Get hooks for barbershop configurations
└── notifications/
    └── Notifications.tsx            # Alert log, new bookings announcements
```

---

## 2. API Integration & TanStack Hooks

The application uses `@tanstack/react-query` to interface with the REST API. This ensures caching, immediate UI state updates, and robust offline-first synchronization.

### Core Query & Mutation Map

| Screen / Feature | React Query Hook | HTTP Method | REST API Endpoint Route | Description / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `useGetBarberDashboard` | `GET` | `apiPath.barberDashboard` | Fetches daily performance summary metrics (Revenue, customers, pending requests). |
| **Dashboard** | `useGetDashboardByDate` | `GET` | `apiPath.barberDashboard?selected_date=:date` | Fetches performance metrics filtered by a specific date. |
| **Bookings** | `useOwnerBookings` | `GET` | `apiPath.booking.owner.owner_bookings?type=:type` | Retrieves bookings. Type parameters: `'today' \| 'future' \| 'past'` (optional `&date=`). |
| **Services** | `useGetServices` | `GET` | `apiPath.services.list` | Retrieves the full list of grooming categories and services. |
| **Services** | `useAddService` | `POST` | `apiPath.services.add` | Creates a new service item (name, category, price, duration, image). |
| **Services** | `useUpdateService` | `PUT` | `apiPath.services.update/:id` | Modifies an existing service item details. |
| **Services** | `useDeleteService` | `DELETE` | `apiPath.services.delete/:id` | Deletes a service item with optimistic UI updates. |
| **Services** | `useCategoryAdd` | `POST` | `apiPath.services.add_category` | Creates a new category folder (e.g. "Hair Care", "Beard Styling"). |
| **Services** | `useCategoryDelete` | `DELETE` | `apiPath.services.delete_category/:id` | Removes an entire category folder. |
| **Profile** | `useGetProfile` | `GET` | `apiPath.profiles.owner` | Retrieves barber bio, mobile, profile images, and shop name. |
| **Settings** | `useGetSettings` | `GET` | `apiPath.settings.get` | Fetches operational configurations (shop timings, slot intervals, off-days). |
| **Settings** | `usePostSettings` | `POST` | `apiPath.settings.save` | Updates operational operational configurations in the backend database. |

---

## 3. Screen Walkthrough & Behavioral Flows

### 📊 A. Barber Dashboard (`BarberDashboard.tsx`)
- **Visuals**:
  - Greeting block displaying current calendar date switcher.
  - Quick metrics grid displaying:
    - **Total Bookings** (quantity badge).
    - **Total Revenue** (currency tracker).
    - **New Requests** (alert badge).
  - High-end chart integration (using `react-native-gifted-charts`) plotting daily earnings, slot occupancies, and weekly revenues.
  - Summary row showing "Today's Active Appointments" card scroll.
- **State Logic**:
  - Uses `useGetBarberDashboard` to fetch metrics.
  - Date picker trigger updates `selectedDate` state which calls `useGetDashboardByDate(selectedDate)` dynamically.

### 📅 B. Bookings History (`Bookings.tsx` & `BookingDetails.tsx`)
- **Visuals**:
  - Segmented control filtering appointments into **Today**, **Upcoming (Future)**, and **History (Past)** tabs.
  - Appointment cards: User avatar, name, time slots, booked services, price, and clear green/red status pills.
  - Action overlay sheet for specific bookings allowing the barber to **Accept**, **Complete**, or **Decline** appointment slots in real-time.
- **State Logic**:
  - Hooks into `useOwnerBookings({ type: activeTab })` which automatically triggers refetches when the user taps between segments.

### ✂️ C. Services CRUD Config (`Services.tsx`)
- **Visuals**:
  - Nested list: Categories (folders) at root level. Tapping a category folder expands to show its corresponding service items.
  - Edit/Delete action chevrons on all items.
  - "Add Service" and "Add Category" modal triggers overlaying the card container.
- **State Logic**:
  - Employs **Optimistic UI Updates** on deletion (`onMutate` in `useDeleteService` and `useCategoryDelete`).
  - Upon clicking delete, the item is instantly removed from the UI cache before the HTTP request even returns, preventing lag and creating an instant response! If the request fails, the cache rolls back gracefully.

---

## 4. Replicating the Flow & UI patterns

To build a similar flow or new modular screens:
1. **Design System Consistency**:
   - Always read theme variables using `const { colors, mode } = usePremiumTheme()`.
   - Wrap containers in `colors.canvas` and inner cards in `colors.surface` with `premiumShadow` to maintain consistent premium aesthetics.
2. **API Hook Registration**:
   - Register your REST API path parameters in `src/environment/environment_urls.ts`.
   - Create a clean `*Api.ts` file alongside your screen.
   - Use `useQuery` for fetching readonly details and `useMutation` for POST/PUT/DELETE forms.
3. **Storage Session Handling**:
   - Import `getData` from `helper/storage` to retrieve the active `access_token` session header securely.
   - Pass the token into the `fetchApi` parameter list.
