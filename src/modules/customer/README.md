# Customer Module

This module handles customer management for the e-commerce system.

## Structure

```
src/modules/customer/
├── domain/v1/
│   └── Customer.ts              # Customer model and schema
├── application/v1/
│   ├── CustomerService.ts       # Business logic for customer operations
│   └── CustomerUtils.ts        # Utility functions for customer management
├── interface/
│   ├── controllers/v1/
│   │   └── CustomerController.ts # HTTP request handlers
│   └── routes/v1/
│       └── customer.routes.ts    # Route definitions
└── __tests__/
    └── customer.test.ts         # Test cases (requires Jest setup)
```

## Features

### Customer Model

- **Basic Info**: Name, email, phone
- **Address**: Street, city, state, zip code, country
- **Account Status**: Active/inactive
- **Order Statistics**: Total orders, total spent, last order date
- **Role**: Fixed to "customer"

### API Endpoints

All endpoints require admin authentication:

| Method | Endpoint                  | Description                                  |
| ------ | ------------------------- | -------------------------------------------- |
| GET    | `/api/v1/customers`       | Get all customers with pagination            |
| GET    | `/api/v1/customers/stats` | Get customer statistics                      |
| GET    | `/api/v1/customers/:id`   | Get customer by ID                           |
| POST   | `/api/v1/customers`       | Create new customer                          |
| PUT    | `/api/v1/customers/:id`   | Update customer                              |
| DELETE | `/api/v1/customers/:id`   | Soft delete customer (set isActive to false) |

### Query Parameters

For `GET /api/v1/customers`:

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `sortBy` (string): Sort field (default: "createdAt")
- `sortOrder` (string): "asc" or "desc" (default: "desc")

### Request/Response Format

#### Create Customer

```json
POST /api/v1/customers
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  }
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "_id": "507f1f77bcf86cd79943911",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States"
    },
    "role": "customer",
    "isActive": true,
    "totalOrders": 0,
    "totalSpent": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Paginated Response

```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": {
    "customers": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCustomers": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Statistics Response

```json
{
  "success": true,
  "message": "Customer statistics retrieved successfully",
  "data": {
    "totalCustomers": 150,
    "activeCustomers": 142,
    "totalOrders": 1250,
    "totalRevenue": 125000.5,
    "averageOrderValue": 100.0
  }
}
```

## Usage Examples

### Get All Customers

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/customers?page=1&limit=10
```

### Get Customer Statistics

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/customers/stats
```

### Create Customer

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890"
  }' \
  http://localhost:3000/api/v1/customers
```

### Update Customer

```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "+0987654321"
  }' \
  http://localhost:3000/api/v1/customers/507f1f77bcf86cd79943911
```

### Delete Customer (Soft Delete)

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/customers/507f1f77bcf86cd79943911
```

## Integration with Orders

When an order is placed, the customer's statistics should be updated:

```typescript
import { CustomerUtils } from "../application/v1/CustomerUtils";

// Update customer stats after order
await CustomerUtils.updateCustomerOrderStats(customerId, orderTotal);
```

## Security

- All endpoints require admin authentication
- Password field is automatically excluded from responses
- Soft delete is used (sets `isActive` to false)
- Input validation on all required fields

## Error Handling

Common error responses:

#### 401 Unauthorized

```json
{
  "success": false,
  "error": "Authentication required"
}
```

#### 400 Bad Request

```json
{
  "success": false,
  "error": "Email already exists"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "error": "Customer not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Database error"
}
```

## Testing

Run tests with:

```bash
npm test -- customer.test.ts
```

Note: Tests require Jest and Supertest to be properly configured.
