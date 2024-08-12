# Spendwise

https://github.com/user-attachments/assets/d285f2bd-1a0c-40ed-a4d6-80bc659f9a71
## Overview

**Spendwise** is a full-stack expense tracking application designed to help users manage and analyze their expenses effectively. The application allows users to add, view, and categorize their expenses, providing insights through visual reports. Spendwise includes features such as real-time updates, PDF report generation, and monthly expense tracking.

## Features

- **Expense Tracking**: Add, view, and categorize expenses.
- **Real-Time Updates**: The home page updates with the latest expenses every time a new expense is submitted.
- **Doughnut Chart**: Visualize expenses by category using a doughnut chart.
- **PDF Reports**: Generate and download PDF reports of monthly expenses, including charts.
- **Email Reports**: Schedule and send monthly PDF reports to users via email.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Email Service**: SendGrid, Nodemailer
- **Chart Library**: Chart.js, react-chartjs-2

## Installation

To get started with Spendwise, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/spendwise.git
    cd spendwise
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and add the following environment variables:
    ```
    MONGODB_URI=your_mongodb_uri
    ```

4. **Run the Frontend**:
    ```bash
    npm run dev
    ```

5. **Run the Backend**:
    ```bash
    nodemon index.js
    ```

6. **Open the Application**:
    Navigate to `http://localhost:5173` in your web browser.

## Usage

- **Adding Expenses**: Use the form on the home page to add new expenses.
- **Viewing Expenses**: The home page displays the last 10 expenses and a doughnut chart showing expense distribution.
- **Generating PDF Reports**: Click on the "Download PDF Report" button to generate and download a PDF report of your monthly expenses.
- **Income Feature**: Get Analysis of the expenses with respect to users income.




