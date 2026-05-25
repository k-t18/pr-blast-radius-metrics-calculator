# API Client with TanStack Query

This guide explains how to use the API client with TanStack Query for making API calls with automatic success and error handling.

## 📁 File Structure

```
src/
├── services/
│   └── api/
│       ├── apiClient.ts           # Base fetch client
│       └── README.md              # This file
├── hooks/
│   └── api/
│       ├── useApiQuery.ts         # Query wrapper
│       └── useApiMutation.ts      # Mutation wrapper
└── App.tsx                        # QueryClient configuration
```

## 🚀 Quick Start

### 1. Setup Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://dev-chances.8848digitalerp.com
```

### 2. Configure Authentication

Update the `getAuthToken()` function in `apiClient.ts`:

```typescript
function getAuthToken(): string | null {
    // Option 1: localStorage
    return localStorage.getItem('authToken');

    // Option 2: From auth context/store
    // return useAuthStore.getState().token;

    // Option 3: From cookies
    // return Cookies.get('auth_token');
}
```

### 3. Create a Service

Create a service file for your API endpoints:

```typescript
// src/services/transactions/invoices/invoices.service.ts
import { api } from '../../api/apiClient';

export interface Invoice {
    name: string;
    grand_total: number;
    status: string;
}

export const invoicesService = {
    getList: () => api.get<Invoice[]>('/api/method/get_invoices'),

    getById: (id: string) => api.get<Invoice>(`/api/method/get_invoice?id=${id}`),

    create: (data: Partial<Invoice>) => api.post<Invoice>('/api/method/create_invoice', data),

    update: (id: string, data: Partial<Invoice>) => api.put<Invoice>(`/api/method/update_invoice?id=${id}`, data),

    delete: (id: string) => api.delete(`/api/method/delete_invoice?id=${id}`),
};
```

### 4. Create a Custom Hook

Use `useApiQuery` and `useApiMutation` in your custom hooks:

```typescript
// src/hooks/useInvoices.ts
import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from './api/useApiQuery';
import { useApiMutation } from './api/useApiMutation';
import { invoicesService } from '../services/transactions/invoices/invoices.service';

export function useInvoices() {
    const queryClient = useQueryClient();

    // GET - Fetch invoices
    const { data: invoices, isLoading } = useApiQuery({
        queryKey: ['invoices'],
        queryFn: invoicesService.getList,
        onSuccess: data => {
            console.log(`Loaded ${data.length} invoices`);
        },
        onError: error => {
            console.error('Failed to load:', error);
        },
    });

    // POST - Create invoice
    const createInvoice = useApiMutation({
        mutationFn: invoicesService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
        successMessage: 'Invoice created!',
    });

    return {
        invoices,
        isLoading,
        createInvoice: createInvoice.mutate,
        isCreating: createInvoice.isPending,
    };
}
```

### 5. Use in Components

```typescript
// src/pages/invoices/InvoicesPage.tsx
import { useInvoices } from '../../hooks/useInvoices';

function InvoicesPage() {
    const { invoices, isLoading, createInvoice, isCreating } = useInvoices();

    const handleCreate = () => {
        createInvoice({
            grand_total: 10000,
            status: 'Draft',
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Invoice'}
            </button>

            <ul>
                {invoices?.map(invoice => (
                    <li key={invoice.name}>{invoice.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

## 📚 API Reference

### `api` Object

The main API client with HTTP method helpers:

```typescript
import { api } from './services/api/apiClient';

// GET request
const data = await api.get<DataType>('/endpoint');

// POST request
const result = await api.post<ResultType>('/endpoint', { key: 'value' });

// PUT request
const updated = await api.put<UpdatedType>('/endpoint', { key: 'value' });

// PATCH request
const patched = await api.patch<PatchedType>('/endpoint', { key: 'value' });

// DELETE request
await api.delete('/endpoint');
```

### `useApiQuery` Hook

Wrapper for TanStack Query's `useQuery` with success/error handling:

```typescript
const { data, isLoading, error } = useApiQuery({
    // Required
    queryKey: ['resource'],
    queryFn: () => api.get<DataType>('/endpoint'),

    // Optional callbacks
    onSuccess: data => {
        /* ... */
    },
    onError: error => {
        /* ... */
    },

    // Optional toast settings
    showSuccessToast: false, // default: false
    showErrorToast: true, // default: true
    successMessage: 'Loaded!',

    // All TanStack Query options
    enabled: true,
    staleTime: 60000,
    refetchOnWindowFocus: true,
    // ... etc
});
```

### `useApiMutation` Hook

Wrapper for TanStack Query's `useMutation` with success/error handling:

```typescript
const mutation = useApiMutation({
    // Required
    mutationFn: variables => api.post('/endpoint', variables),

    // Optional callbacks
    onSuccess: (data, variables) => {
        /* ... */
    },
    onError: (error, variables) => {
        /* ... */
    },

    // Optional toast settings
    showSuccessToast: true, // default: true
    showErrorToast: true, // default: true
    successMessage: 'Created successfully!',

    // All TanStack Query options
    // ... etc
});

// Use it
mutation.mutate({ key: 'value' });

// Or with await
await mutation.mutateAsync({ key: 'value' });
```

## 🎯 Common Patterns

### Pattern 1: List with Create/Update/Delete

```typescript
export function useResources() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useApiQuery({
        queryKey: ['resources'],
        queryFn: resourceService.getList,
    });

    const createMutation = useApiMutation({
        mutationFn: resourceService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
    });

    const updateMutation = useApiMutation({
        mutationFn: ({ id, data }) => resourceService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
    });

    const deleteMutation = useApiMutation({
        mutationFn: resourceService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
    });

    return {
        resources: data,
        isLoading,
        create: createMutation.mutate,
        update: updateMutation.mutate,
        delete: deleteMutation.mutate,
    };
}
```

### Pattern 2: Master-Detail

```typescript
// List hook
export function useInvoices() {
    return useApiQuery({
        queryKey: ['invoices'],
        queryFn: invoicesService.getList,
    });
}

// Detail hook
export function useInvoiceDetail(id: string) {
    return useApiQuery({
        queryKey: ['invoice', id],
        queryFn: () => invoicesService.getById(id),
        enabled: !!id, // Only fetch if ID exists
    });
}
```

### Pattern 3: Optimistic Updates

```typescript
const updateMutation = useApiMutation({
    mutationFn: ({ id, data }) => api.put(`/resource/${id}`, data),
    onMutate: async variables => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['resources'] });

        // Snapshot previous value
        const previous = queryClient.getQueryData(['resources']);

        // Optimistically update
        queryClient.setQueryData(['resources'], old => {
            // Update logic here
        });

        return { previous };
    },
    onError: (err, variables, context) => {
        // Rollback on error
        queryClient.setQueryData(['resources'], context?.previous);
    },
    onSettled: () => {
        // Refetch after success or error
        queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
});
```

### Pattern 4: Dependent Queries

```typescript
// First query
const { data: user } = useApiQuery({
    queryKey: ['user'],
    queryFn: userService.getCurrent,
});

// Second query depends on first
const { data: preferences } = useApiQuery({
    queryKey: ['preferences', user?.id],
    queryFn: () => preferencesService.getByUserId(user!.id),
    enabled: !!user?.id, // Only run when user exists
});
```

## 🛠️ Error Handling

### ApiError Structure

```typescript
import { ApiError } from './services/api/apiClient';

try {
    await api.get('/endpoint');
} catch (error) {
    if (error instanceof ApiError) {
        console.log(error.message); // User-friendly message
        console.log(error.statusCode); // HTTP status code
        console.log(error.errorCode); // API error code
        console.log(error.response); // Full response object
    }
}
```

### Global Error Handling

Add to `App.tsx`:

```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            onError: error => {
                if (error instanceof ApiError) {
                    if (error.statusCode === 401) {
                        // Handle unauthorized
                        router.navigate('/login');
                    }
                }
            },
        },
    },
});
```

## 🔧 Advanced Configuration

### Custom Headers per Request

```typescript
api.get('/endpoint', {
    headers: {
        'X-Custom-Header': 'value',
    },
});
```

### Request Cancellation

```typescript
const controller = new AbortController();

const { data } = useApiQuery({
    queryKey: ['data'],
    queryFn: () =>
        api.get('/endpoint', {
            signal: controller.signal,
        }),
});

// Cancel the request
controller.abort();
```

### File Upload

```typescript
const formData = new FormData();
formData.append('file', file);

await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
        Authorization: `token ${token}`,
        // Don't set Content-Type for FormData
    },
    body: formData,
});
```
