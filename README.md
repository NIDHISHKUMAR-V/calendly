# Calendly

A simple Calendly-inspired appointment scheduling system built with **PHP (Backend API)** and **React (Frontend)**.  
Users can view available time slots and book appointments, while admins can manage slots and bookings.

## How to Install & Run the Project

### Prerequisites

Make sure you have the following installed:

- PHP >= 8.0
- MySQL >= 5.7
- Composer
- Node.js >= 18
- npm or yarn
- Git


## Backend (PHP API)

### Backend Setup

```bash
git clone <your-repo-url>
cd backend
composer install
```

## Database Setup

### 1. Create the database:
```bash
- mysql -u root -p calendly < calendly.sql
``` 

### 2. Configure database credentials:
```bash
$host = "localhost";
$db = "calendly";
$user = "your_username";
$pass = "your_password";
```

### 3. Mail Config
Create a mail_config.php file inside the config folder with
```bash
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'example@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('SMTP_FROM', 'example@gmail.com');
define('SMTP_FROM_NAME', 'your-app-name');
```

# Frontend (React)

## Frontend Setup
```bash
cd frontend
npm install
```

## Run Frontend
```bash
npm run dev
```

# Data Model Design

## slots table
| Column | Type | Description |
|------|------|-------------|
| id | INT | Primary key |
| start_time | DATETIME | Slot start time |
| end_time | DATETIME | Slot end time |
| is_booked | BOOLEAN | Booking status |
| created_at | TIMESTAMP | Created timestamp |


## bookings table
| Column | Type | Description |
|------|------|-------------|
| id | INT | Primary key |
| slot_id | INT | FK → slots.id |
| name | VARCHAR | User name |
| email | VARCHAR | User email |
| created_at | TIMESTAMP | Booking timestamp |


# Data Flow
1. Admin creates time slots
2. User fetches available slots
3. User books a slot
4. Email notification is sent to the user