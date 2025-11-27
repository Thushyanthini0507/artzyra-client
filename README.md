# Artzyra Authentication System

Complete authentication system with role-based access control for admin, artists, customers, and public users.

## Features

- Login modal for all user types
- Customer registration modal
- Artist registration page
- Admin approval workflows for customers and artists
- Role-based dashboards
- Protected routes with middleware
- Shadcn UI components
- Zod validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp env.example .env.local
```

3. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run development server:
```bash
npm run dev
```

## Required API Endpoints

Your Express API should implement these endpoints:

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
  - Response: `{ user, token }`

- `POST /api/auth/register/customer` - Customer registration
  - Body: `{ name, email, password, phone, address: { street, city, state, zipCode, country } }`
  - Response: `{ success, message }`

- `POST /api/auth/register/artist` - Artist registration
  - Body: `{ shopName, email, password, name, phone, bio, category, skills, hourlyRate, availability }`
  - Response: `{ success, message }`

- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

- `POST /api/auth/logout` - Logout user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success }`

### Admin Endpoints
- `GET /api/admin/customers/pending` - Get pending customer registrations
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ data: Customer[] }`

- `PUT /api/admin/customers/:id/approve` - Approve customer
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

- `PUT /api/admin/customers/:id/reject` - Reject customer
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

- `GET /api/admin/artists/pending` - Get pending artist registrations
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ data: Artist[] }`

- `PUT /api/admin/artists/:id/approve` - Approve artist
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

- `PUT /api/admin/artists/:id/reject` - Reject artist
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

## User Roles

- **Public**: Can browse home page, register as customer or artist
- **Customer**: Can browse artists, create projects, message artists
- **Artist**: Can manage portfolio, view projects, communicate with customers
- **Admin**: Can approve/reject customer and artist registrations

## Portal Structure

### Public Portal
- Home page with navbar and footer
- Login modal (Sign In button)
- Customer registration modal (Sign Up button)
- Artist registration page (Become an Artist button)

### Customer Portal
- Top navbar layout
- Dashboard with project overview
- Browse artists
- Messages

### Artist Portal
- Sidebar layout
- Dashboard with earnings and projects
- Portfolio management
- Project tracking

### Admin Portal
- Sidebar layout
- Dashboard with overview
- Customer approvals page
- Artist approvals page
- Confirmation dialogs for all actions

## Navigation

- `/` - Home page (public)
- `/auth/register/artist` - Artist registration (public navbar + simple footer)
- `/customer` - Customer dashboard (protected)
- `/artist` - Artist dashboard (protected)
- `/admin` - Admin dashboard (protected)
- `/admin/customers` - Customer approvals (protected)
- `/admin/artists` - Artist approvals (protected)

## Components

### Layouts
- `PublicLayout` - Navbar + content + footer
- `CustomerLayout` - Navbar + content
- `AdminLayout` - Sidebar + content
- `ArtistLayout` - Sidebar + content

### Forms
- `LoginModal` - Login form with Zod validation
- `CustomerRegisterModal` - Customer registration with Zod validation
- Artist registration page - Full form with Zod validation

### Navigation
- `Navbar` - Top navigation with auth buttons
- `AppSidebar` - Sidebar for admin and artist portals
- `Footer` - Full footer for home page
- `SimpleFooter` - Minimal footer for registration pages

## Development

The application uses:
- Next.js 16 (App Router)
- Shadcn UI components
- Zod for validation
- React Hook Form for form handling
- TypeScript for type safety
