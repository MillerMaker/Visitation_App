# Development Environment Setup Guide

This guide walks through setting up the Visitation App development environment for local development.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup (.NET)](#backend-setup-net)
4. [Frontend Setup (React)](#frontend-setup-react)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before getting started, ensure you have the following installed:

### Required Software

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download)
- **SQL Server Express** or **SQL Server Developer Edition** - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Git** - [Download](https://git-scm.com/)

### Recommended Tools

- **Visual Studio Code** with C# extension
- **SQL Server Management Studio (SSMS)** for database management
- **Postman** or **Thunder Client** for API testing

### System Requirements

- Windows 10/11, macOS, or Linux
- At least 4GB RAM
- 2GB disk space

---

## Database Setup

The Visitation App uses Microsoft SQL Server. Follow these steps to set up the database:

### 1. Create the Database

Open **SQL Server Management Studio** (or a SQL query tool) and connect to your SQL Server instance.

Run the following SQL scripts in order:

```sql
-- Create the VisitTrackingDB database if it doesn't exist
CREATE DATABASE [VisitTrackingDB];
GO
USE [VisitTrackingDB];
```

### 2. Create Database Tables

Execute the SQL scripts located in `visitation-backend/SQL Scripts/` in this order:

1. `Create_Users_Table.sql` - Creates the Users table
2. `Create_Locations_Table.sql` - Creates the Locations table
3. `Create_Visits_Table.sql` - Creates the Visits table
4. `Create_Invites_Table.txt` - Creates the Invites table

### 3. Populate Location Data

Run one of the following scripts to populate the Locations table:

- `Fill_Locations_Table.sql` - For local development
- `Fill_Locations_Table_Azure.sql` - If using Azure data sources

### 4. Verify Database Connection

Update the connection string in `visitation-backend/appsettings.Development.json` to match your SQL Server instance:

```json
"DBSettings": {
  "ConnectionString": "Server=YOUR_SERVER_NAME\\SQLEXPRESS;Database=VisitTrackingDB;Integrated Security=True;TrustServerCertificate=True;"
}
```

**Common values:**
- For local SQL Express: `Server=localhost\\SQLEXPRESS;Database=VisitTrackingDB;Integrated Security=True;TrustServerCertificate=True;`
- For named instance: `Server=COMPUTER_NAME\\INSTANCE_NAME;Database=VisitTrackingDB;Integrated Security=True;TrustServerCertificate=True;`

---

## Backend Setup (.NET)

### 1. Install .NET 9

If not already installed, download and install the .NET 9 SDK from the [official website](https://dotnet.microsoft.com/download).

Verify installation:
```bash
dotnet --version
```

### 2. Restore Dependencies

Navigate to the backend directory and restore NuGet packages:

```bash
cd visitation-backend
dotnet restore
```

### 3. Review Configuration

The backend uses configuration files for environment-specific settings:

- **`appsettings.json`** - Production settings (includes placeholder secrets)
- **`appsettings.Development.json`** - Local development settings

#### Key Configuration Values

**JWT Settings** (`appsettings.json`):
```json
"Jwt": {
  "Key": "YOUR_SECRET_KEY_HERE",
  "Issuer": "http://localhost:5257",
  "Audience": "http://localhost:3000",
  "ExpiryInMinutes": 60
}
```

**Database Connection** (`appsettings.Development.json`):
```json
"DBSettings": {
  "ConnectionString": "YOUR_CONNECTION_STRING_HERE"
}
```

**Twilio Settings** (`appsettings.json`):
```json
"Twilio": {
  "AccountSid": "YOUR_ACCOUNT_SID",
  "AuthToken": "YOUR_AUTH_TOKEN"
}
```

### 4. Build the Backend

Build the project to verify everything is set up correctly:

```bash
dotnet build
```

---

## Frontend Setup (React)

### 1. Navigate to Frontend Directory

```bash
cd visitation-app
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- React 19
- React Router DOM
- Leaflet and React Leaflet (mapping)
- Axios (HTTP requests)
- Lucide React (icons)
- Testing libraries
- And other dependencies

### 3. Review Frontend Configuration

The frontend connects to the backend at `http://localhost:5257` by default. This is configured in environment-specific files or API service files.

---

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)

The project includes a convenient npm script that starts both servers simultaneously:

```bash
cd visitation-app
npm run dev
```

This command uses `concurrently` to run:
- .NET backend at `http://localhost:5257`
- React frontend at `http://localhost:3000`

### Option 2: Run Separately

#### Run Backend Only

```bash
cd visitation-backend
dotnet run
```

Backend runs at: `http://localhost:5257`

#### Run Frontend Only

```bash
cd visitation-app
npm start
```

Frontend runs at: `http://localhost:3000`

### Option 3: Run Backend with Watch Mode

For faster development (backend restarts on file changes):

```bash
cd visitation-backend
dotnet watch run
```

---

## Accessing the Application

Once both servers are running:

- **Frontend**: Open `http://localhost:3000` in your browser
- **Backend API**: `http://localhost:5257`
- **OpenAPI Documentation**: `http://localhost:5257/openapi` (if enabled)

---

## Available npm Scripts

From the `visitation-app` directory:

| Command | Purpose |
|---------|---------|
| `npm start` | Start the React development server |
| `npm build` | Build the React app for production |
| `npm test` | Run the test suite |
| `npm run dev` | Start both backend and frontend simultaneously |

---

## Available dotnet Commands

From the `visitation-backend` directory:

| Command | Purpose |
|---------|---------|
| `dotnet run` | Run the backend server |
| `dotnet watch run` | Run with auto-reload on file changes |
| `dotnet build` | Build the project |
| `dotnet publish` | Publish for production deployment |

---

## Environment Variables

### Development Environment

When developing locally, the app uses:

- **Frontend**: Default port `3000`
- **Backend**: Default port `5257`
- **Database**: Local SQL Server instance (configured in `appsettings.Development.json`)

### Important Ports

- **3000** - React development server
- **5257** - .NET backend API
- Make sure these ports are not in use by other applications

---

## Troubleshooting

### Backend Won't Start

**Error**: `Database connection string is missing in configuration.`
- **Solution**: Verify `appsettings.Development.json` has the correct `ConnectionString` value

**Error**: Cannot connect to SQL Server
- **Solution**: 
  - Ensure SQL Server is running
  - Check the server name in your connection string
  - Try using `(local)\\SQLEXPRESS` or `localhost\\SQLEXPRESS`

**Error**: NuGet packages fail to restore
- **Solution**: 
  - Run `dotnet nuget locals all --clear`
  - Run `dotnet restore` again

### Frontend Won't Start

**Error**: `npm: command not found`
- **Solution**: Install Node.js from https://nodejs.org/

**Error**: Port 3000 already in use
- **Solution**: 
  - Kill the process using port 3000
  - Or change the port: `PORT=3001 npm start`

**Error**: Cannot find modules after `npm install`
- **Solution**: 
  - Delete `node_modules` folder
  - Delete `package-lock.json`
  - Run `npm install` again

### Communication Issues Between Frontend and Backend

**Frontend can't reach backend API**
- **Solution**: 
  - Ensure backend is running at `http://localhost:5257`
  - Check CORS settings in `Program.cs`
  - Verify API endpoint URLs in frontend code

**WebSocket connection fails**
- **Solution**: 
  - Verify WebSocket is enabled in backend
  - Check firewall settings
  - Ensure backend is running

### Database Issues

**Cannot see tables in database**
- **Solution**: 
  - Verify you ran all SQL scripts in the correct order
  - Refresh the database in SSMS
  - Check that the connection string points to the correct database

**Data not persisting**
- **Solution**: 
  - Verify database connection string is correct
  - Check SQL Server is running and accessible
  - Review database permissions

---

## Next Steps

1. **Explore the codebase**:
   - Backend: `visitation-backend/src/` contains controllers, models, and services
   - Frontend: `visitation-app/src/` contains pages, components, and utilities

2. **Set up your IDE**:
   - Install recommended VS Code extensions for C# and React
   - Configure code formatting and linting

3. **Read additional documentation**:
   - Check `Documentation/` folder for architecture diagrams and design docs
   - Review entity relationship diagram for database schema

4. **Start developing**:
   - Make changes and test locally
   - Use browser DevTools and Network tab to debug
   - Check backend logs in terminal for API issues

---

## Additional Resources

- [React Documentation](https://react.dev)
- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [SQL Server Documentation](https://learn.microsoft.com/en-us/sql/)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Router Documentation](https://reactrouter.com/)

---

## Getting Help

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review existing GitHub issues
3. Check the console/terminal for error messages
4. Verify all prerequisites are installed
5. Try a clean build: `dotnet clean` and `npm ci`
