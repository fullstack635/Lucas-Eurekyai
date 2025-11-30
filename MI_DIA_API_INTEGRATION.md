# Mi Día Section - API Integration Documentation

## Overview

The "Mi Día" (My Day) section is now **fully integrated** with the actual API endpoints from the Eureky backend. This document explains how the API integration works.

---

## 🔌 API Endpoints Used

Based on the Postman collection, the following endpoints are integrated:

### 1. **List Items (Tasks)**
- **Endpoint**: `GET /list-items`
- **Purpose**: Fetch all tasks across all user's lists
- **Query Parameters**:
  - `limit`: 100
  - `isCompleted`: false (only show incomplete tasks)
  - `orderBy`: createdAt
  - `orderDirection`: desc

### 2. **Toggle Task Completion**
- **Endpoint**: `POST /list-items/{item_id}/toggle`
- **Purpose**: Mark tasks as complete/incomplete

### 3. **Add New Task**
- **Endpoint**: `POST /list-items`
- **Purpose**: Create a new task in the default list
- **Body**:
```json
{
  "content": "Task content",
  "description": "",
  "priority": "medium",
  "metadata": {}
}
```

### 4. **Update Task**
- **Endpoint**: `PUT /list-items/{item_id}`
- **Purpose**: Update existing task details

### 5. **Delete Task**
- **Endpoint**: `DELETE /list-items/{item_id}`
- **Purpose**: Remove a task

### 6. **Get Calendars**
- **Endpoint**: `GET /calendars`
- **Purpose**: Fetch all connected calendars
- **Query Parameters**:
  - `isActive`: true
  - `syncEnabled`: true
  - `limit`: 20

### 7. **Get Calendar Events**
- **Endpoint**: `GET /calendar-events`
- **Purpose**: Fetch events from all calendars for today
- **Query Parameters**:
  - `start`: Today at 00:00
  - `end`: Tomorrow at 00:00

---

## 📁 File Structure

```
src/
├── features/
│   ├── dashboard/
│   │   ├── hooks/
│   │   │   └── useMiDiaData.js          # Custom hook for Mi Día data
│   │   ├── sections/
│   │   │   └── MiDiaSection.jsx         # Mi Día section component
│   │   └── index.jsx                     # Dashboard main component
│   └── lists/
│       └── hooks/
│           └── useListItemsQuery.js      # React Query hooks for tasks
├── components/
│   ├── CalendarSection.jsx               # Calendar events display
│   ├── TaskList.jsx                      # Task list display
│   └── AddTask.jsx                       # Add task input
└── shared/
    └── services/
        ├── listItems.js                  # List items API service
        └── calendars.js                  # Calendar API service
```

---

## 🎯 Custom Hooks

### `useMiDiaData()` Hook

Located in `src/features/dashboard/hooks/useMiDiaData.js`

**Purpose**: Aggregates all data needed for the "Mi Día" section.

**Returns**:
```javascript
{
  todayTasks: [],              // Tasks scheduled for today
  calendarEvents: [],          // Calendar events for today
  isCalendarConnected: bool,   // Whether calendar is connected
  activeCalendars: [],         // List of active calendars
  isLoading: bool,             // Loading state
  errors: {                    // Error states
    tasksError,
    calendarsError,
    eventsError
  }
}
```

**Features**:
- Filters tasks scheduled for today
- Fetches calendar events for today only
- Checks calendar connection status
- Handles loading and error states

---

## 🔄 Data Flow

### 1. **Component Mount**
```
MiDiaSection.jsx
    ↓
useMiDiaData()
    ↓
├── useAllUserItems() → GET /list-items
├── useCalendars() → GET /calendars
└── useAllCalendarEvents() → GET /calendar-events
```

### 2. **User Adds Task**
```
AddTask.jsx
    ↓
useAddItemToDefaultList()
    ↓
POST /list-items
    ↓
React Query invalidates cache
    ↓
TaskList.jsx auto-refetches
```

### 3. **User Toggles Task**
```
TaskList.jsx
    ↓
useToggleItemCompletion()
    ↓
POST /list-items/{id}/toggle
    ↓
Optimistic UI update
    ↓
Background refetch
```

### 4. **User Connects Calendar**
```
CalendarSection.jsx
    ↓
useGoogleCalendar()
    ↓
GET /calendar-oauth/google/authorize
    ↓
OAuth flow
    ↓
POST /calendar-oauth/google/callback
    ↓
Auto-sync calendars
```

---

## 🛠️ How It Works

### **MiDiaSection.jsx**
```javascript
export const MiDiaSection = () => {
  const { user } = useAuth();
  const { calendarEvents } = useMiDiaData();
  
  return (
    <>
      <h1>Buenos días, {user.name}</h1>
      <CalendarSection events={calendarEvents} />
      <TaskList />
      <AddTask />
    </>
  );
};
```

### **CalendarSection.jsx**
- Displays calendar events from API
- Shows "Connect Calendar" button if not connected
- Handles Google/Outlook/iCloud OAuth flows
- Real-time event fetching

### **TaskList.jsx**
- Fetches tasks using `useAllUserItems()`
- Optimistic UI updates on toggle
- Edit/Delete operations
- Move to different list

### **AddTask.jsx**
- Creates new tasks via `useAddItemToDefaultList()`
- Select target list with popover
- Auto-clears input on success

---

## 🔐 Authentication

All API requests automatically include the JWT token from localStorage:

```javascript
const config = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  }
};
```

**Auto-logout on 401**: If the API returns 401 Unauthorized, the user is automatically redirected to the login page.

---

## 📊 State Management

Uses **React Query (TanStack Query)** for:
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states

### Query Keys
```javascript
listItemsKeys = {
  all: ['listItems'],
  allUserItems: (filters) => ['listItems', 'allUserItems', { filters }],
  list: (listId, filters) => ['listItems', 'list', listId, { filters }]
};
```

---

## 🎨 Features

### ✅ Implemented
1. **Fetch all tasks** from API
2. **Toggle task completion** with optimistic updates
3. **Add new tasks** to default or specific list
4. **Edit tasks** (title, date, priority)
5. **Delete tasks** with confirmation
6. **Move tasks** between lists
7. **Fetch calendar events** for today
8. **Connect calendars** (Google/Outlook/iCloud)
9. **Display calendar events** with time and title
10. **Join meeting links** from calendar events
11. **Auto-refresh** on window focus
12. **Error handling** with notifications
13. **Loading states** with spinners
14. **Responsive design** (mobile + desktop)

### 🔮 Future Enhancements
- Filter tasks by "Personal", "Trabajo", "Freelance" (filters are in UI but not implemented)
- Task priority indicators
- Due date badges
- Recurring tasks support
- Drag and drop task reordering
- Calendar event creation from dashboard

---

## 🧪 Testing

### Manual Testing Steps

1. **Test Task Creation**:
   - Click "Agregar tarea" input
   - Type a task name
   - Press Enter
   - ✅ Task should appear in the list

2. **Test Task Toggle**:
   - Click checkbox on any task
   - ✅ Task should be marked complete (optimistically)
   - ✅ Background API call completes

3. **Test Calendar Connection**:
   - If no calendar connected, click "Conectar calendario"
   - ✅ Modal opens with provider options
   - Select Google/Outlook/iCloud
   - ✅ OAuth flow starts

4. **Test Calendar Events**:
   - Connect calendar with events today
   - ✅ Events display with time ranges
   - ✅ "Únirse" button appears for meetings

---

## 🐛 Error Handling

### API Errors
- Network errors → Toast notification
- 401 Unauthorized → Auto-logout and redirect to login
- 500 Server errors → Error notification with retry

### Calendar Errors
- OAuth failures → Error message in calendar section
- No events → "No hay eventos programados para hoy"
- Calendar sync errors → Retry button shown

### Task Errors
- Failed to add → Toast error, input not cleared
- Failed to toggle → Optimistic update rolled back
- Failed to delete → Task restored, error notification

---

## 📝 Environment Variables

Required in `.env`:

```env
VITE_API_BASE_URL=https://dev-api.eureky.ai
```

For production:
```env
VITE_API_BASE_URL=https://api.eureky.ai
```

---

## 🚀 Deployment Checklist

- [x] API endpoints integrated
- [x] Authentication working
- [x] Error handling implemented
- [x] Loading states added
- [x] Responsive design tested
- [x] Optimistic updates working
- [ ] Environment variables configured
- [ ] Production API URL set
- [ ] Error tracking setup (optional)

---

## 📞 Support

If you encounter any issues with the API integration:

1. Check browser console for errors
2. Verify JWT token in localStorage
3. Test endpoints directly in Postman
4. Check API base URL in `.env`
5. Verify network connectivity

---

## 🎉 Conclusion

The "Mi Día" section is now fully integrated with the actual Eureky API! All features use real endpoints from the Postman collection, including:

✅ Tasks management (CRUD operations)
✅ Calendar integration (Google/Outlook/iCloud)
✅ Real-time updates with React Query
✅ Optimistic UI for better UX
✅ Comprehensive error handling
✅ Auto-logout on session expiry

The integration is production-ready and follows best practices for API integration in React applications.

