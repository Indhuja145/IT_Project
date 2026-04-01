# Quick Setup Guide

## Option 1: Install MongoDB Locally

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Run backend: `cd backend && npm start`
4. Run frontend: `cd IT_Project && npm run dev`

## Option 2: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account and cluster
3. Get connection string (looks like: mongodb+srv://username:password@cluster.mongodb.net/)
4. Update backend/.env:
   ```
   MONGODB_URI=your_connection_string_here
   PORT=5000
   ```
5. Run backend: `cd backend && npm start`
6. Run frontend: `cd IT_Project && npm run dev`

## Option 3: Run Without Database (Demo Mode)

Use the demo server below that doesn't require MongoDB.
