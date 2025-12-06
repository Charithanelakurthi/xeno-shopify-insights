Shopify Data Ingestion and Insights Service
Xeno FDE Internship Assignment – 2025
This project is a multi-tenant Shopify Data Ingestion and Insights Platform built as part of the Xeno Forward Deployed Engineer (FDE) Internship Assignment – 2025.
The system simulates how enterprise retailers onboard their Shopify stores, ingest customer and order data, and visualize business insights through a secure dashboard.


Assignment Objective
The objective of this project is to design and implement a scalable, multi-tenant data ingestion service that connects to Shopify APIs, ingests real-time e-commerce data, stores this data securely in a relational database, and provides meaningful business insights through a dashboard.


Features Implemented
Shopify Store Setup
A Shopify development store was created and populated with dummy products, customers, and orders for testing purposes.
Data Ingestion Service
The service integrates with Shopify APIs and ingests the following entities:
Customers
Orders
Products
Bonus scope includes custom events such as cart abandoned and checkout started.
All data is stored in a relational database using either MySQL or PostgreSQL.
The system is designed with a multi-tenant architecture where each store is isolated using a tenant_id.


Insights Dashboard
The dashboard includes secure email-based authentication.
The following KPIs are currently displayed:
Total number of customers
Total number of orders
Total revenue
The dashboard also provides analytical views such as:
Orders by date with date range filtering
Top 5 customers by total spending
Interactive charts are used to visualize trends and business performance.


High-Level Architecture
Shopify Store
Webhook or Scheduler
Node.js API Layer (Multi-Tenant)
Relational Database (MySQL or PostgreSQL)
Insights Dashboard (React.js)


Tech Stack
Backend:
Node.js
Express.js
Shopify API
Prisma or Sequelize ORM

Frontend:
React.js
Vite
Chart.js or Recharts

Database:
MySQL or PostgreSQL

Authentication:
Email-based login

Deployment:
Vercel, Render, or Railway


Multi-Tenant Design
Each Shopify store is treated as a separate tenant.
All data is isolated using a tenant_id in every major table, including:
Customers
Orders
Products

Sample Database Tables (Simplified)
TENANTS (tenant_id, store_name, email)
CUSTOMERS (id, name, email, tenant_id)
ORDERS (id, order_date, amount, customer_id, tenant_id)
PRODUCTS (id, title, price, tenant_id)

Shopify Data Sync Strategy
Automated data synchronization is handled using:
Webhooks
Scheduled background jobs
This ensures near real-time data updates between Shopify and the platform.

How to Run the Project
Install dependencies:
npm install

Run the development server:
npm run dev

Assumptions
Each Shopify store is treated as one tenant.
Email authentication is sufficient for tenant onboarding.
The data volume fits within relational database limits.
Shopify API rate limits are managed using retry logic.

Future Enhancements
Redis caching for better performance
Kafka or RabbitMQ for async ingestion
Stripe billing for SaaS onboarding
Admin analytics dashboard
Role-based access control
Data warehouse integration such as Snowflake or BigQuery

Developed By

Nelakurthi Charitha
Final Year Student
Full Stack Developer
Applicant for Xeno Forward Deployed Engineer (FDE) Internship – 2025
