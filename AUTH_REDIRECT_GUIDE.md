# 401 Unauthorized Auto-Redirect Guide

## 🎯 Overview

When any API call returns a **401 Unauthorized** status, the user is **automatically redirected to the login page** and their auth token is cleared.

## 🔧 How It Works

### 1. **API Client Layer** (`apiClient.ts`)

The API client intercepts all 401 errors:

```typescript
// Check for errors (HTTP status or API status field)
if (!response.ok || data.status === 'error') {
    const apiError = new ApiError(...);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
        // Clear auth token
        localStorage.removeItem('authToken');
        // Redirect to login page
        redirectTo('/login');
    }

    throw apiError;
}
```

### 2. **Navigation Setup** (`App.tsx`)

The App component provides the navigate function to the API client:

```typescript
function NavigationSetup({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Provide navigate function to API client for 401 redirects
        setNavigate(navigate);
    }, [navigate]);

    return <>{children}</>;
}
```

### 3. **Flow Diagram**

```
Component makes API call
    ↓
TanStack Query calls queryFn
    ↓
Service layer calls api.get/post/etc
    ↓
apiClient.ts makes fetch request
    ↓
Backend returns 401 Unauthorized
    ↓
apiClient.ts detects 401 status
    ↓
[1] localStorage.removeItem('authToken')
    ↓
[2] navigate('/login')
    ↓
User redirected to login page
    ↓
Error still thrown to TanStack Query
    (so component can show error state if needed)
```

## 📝 Example Scenario

### User on Dashboard Page

```typescript
// User is viewing invoices
function InvoicesPage() {
    const { invoices, isLoading } = useInvoices();

    // This calls the API
    // If auth token expired, API returns 401
    // User automatically redirected to /login
}
```

### What Happens

1. **API Call**: `api.get('/api/method/get_invoices_list')`
2. **Backend Response**: `401 Unauthorized`
3. **API Client Actions**:
    - Clears `localStorage.removeItem('authToken')`
    - Redirects to `/login`
4. **User Experience**: Sees login page immediately
5. **Component**: Receives error state (but user already on login page)

## 🛠️ Customization

### Change Login Route

In `apiClient.ts`, update the redirect path:

```typescript
if (response.status === 401) {
    localStorage.removeItem('authToken');
    redirectTo('/auth/login'); // ← Change this
}
```

### Change Token Storage

If you use cookies or a different storage:

```typescript
if (response.status === 401) {
    // Clear your token however you store it
    Cookies.remove('auth_token');
    sessionStorage.removeItem('token');
    // etc.
    redirectTo('/login');
}
```

### Add Custom Logic Before Redirect

```typescript
if (response.status === 401) {
    // Clear token
    localStorage.removeItem('authToken');

    // Show notification
    console.log('Session expired. Please login again.');

    // Store current location to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);

    // Redirect
    redirectTo('/login');
}
```

### Handle Other Status Codes

Add handling for other HTTP status codes:

```typescript
if (!response.ok || data.status === 'error') {
    const apiError = new ApiError(...);

    // 401 - Unauthorized
    if (response.status === 401) {
        localStorage.removeItem('authToken');
        redirectTo('/login');
    }

    // 403 - Forbidden
    if (response.status === 403) {
        redirectTo('/access-denied');
    }

    // 503 - Service Unavailable
    if (response.status === 503) {
        redirectTo('/maintenance');
    }

    throw apiError;
}
```
