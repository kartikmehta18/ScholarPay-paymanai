
# 🎓 ScholarPay – Powered by PaymanAI

# [Live Link 🔗](https://scholarpay-paymanai.vercel.app/)
# [Live Video Demo 🔗](https://youtu.be/IA3OS1vMSHo?si=Dcj7mDcfAyDnCHAT)
 
ScholarPay – Powered by PaymanAI is a smart and user-friendly scholarship management system built with React, TypeScript, and Tailwind CSS. It supports dual login for students and government officials using PaymanAI OAuth and Supabase. Students can view their wallet balance, manage payees, and apply for scholarships by selecting an existing payee or requesting a new one. Government officials can review and approve applications, create payee accounts if needed, and release funds via PaymanAI. The system ensures real-time updates of wallets, payees, and transactions on both dashboards, offering a transparent and efficient scholarship distribution process.


<!-- ## 🏗️ System Architecture

![alt text](<Screenshot 2025-06-10 230258.png>)
![alt text](<Screenshot 2025-06-10 214613.png>)
![alt text](image3.png>)
![alt text](<Screenshot 2025-06-10 214832.png>)
![alt text](<Screenshot 2025-06-10 214825.png>)
![alt text](<Screenshot 2025-06-10 214901.png>)
![alt text](<Screenshot 2025-06-10 214921.png>)
![alt text](<Screenshot 2025-06-10 214946.png>)
![alt text](<Screenshot 2025-06-10 215145.png>)
![alt text](<Screenshot 2025-06-10 214418-1.png>)
![alt text](<Screenshot 2025-06-10 214436.png>)
![alt text](<Screenshot 2025-06-10 214519.png>)
![alt text](image-1.png)
![alt text](<Screenshot 2025-06-10 214653.png>)
![alt text](image-2.png)
![alt text](<Screenshot 2025-06-10 214759.png>) -->

<table>
  <tr>
    <td>
      <h4>Hero Section</h4>
      <img src="https://github.com/user-attachments/assets/095674d8-37e9-438b-aa18-ad66bae6f509" width="250"/>
    </td>
    <td>
      <h4>Payman OAuth</h4>
      <img src="https://github.com/user-attachments/assets/c13ea4be-d3df-4c2d-9b16-35aaa5f0ecb8" width="250"/>
    </td>
    <td>
      <h4>Payman OAuth login (dashboard)</h4>
      <img src="https://github.com/user-attachments/assets/52424f01-50c4-492b-822e-f46d4ae7b92a" width="250"/>
    </td>
  </tr>
  <tr>
    <!-- <td>
      <h4>Component 3</h4>
      <img src="https://github.com/user-attachments/assets/0a4b6e1f-8fa6-44c1-8f09-80058368169e" width="250"/>
    </td> -->
    <td>
      <h4>Registration</h4>
      <img src="https://github.com/user-attachments/assets/a7a1ee13-7431-40ff-9f9c-3ef66cf62325" width="250"/>
    </td>
    <td>
      <h4>Stu-dashboard</h4>
      <img src="https://github.com/user-attachments/assets/ab87989d-52cc-4d19-b3b9-e1d051cb9591" width="250"/>
    </td>
     <td>
      <h4>Application page</h4>
      <img src="https://github.com/user-attachments/assets/52bcdbf6-415f-45d4-a472-7160e97c1cf2" width="250"/>
    </td>
  </tr>
  <tr>
    <td>
      <h4>Application Form</h4>
      <img src="https://github.com/user-attachments/assets/0e3da2e9-596c-4cfb-9689-5b22dc2753e0" width="250"/>
    </td>
    <!-- <td>
      <h4>Component 8</h4>
      <img src="https://github.com/user-attachments/assets/492b8bb0-0e6f-4772-be61-cfba7f453656" width="250"/>
    </td> -->
     <td>
      <h4>Gov-dashboard</h4>
      <img src="https://github.com/user-attachments/assets/c4c148be-a429-47ec-8c22-f818a2b69738" width="250"/>
    </td>
    <td>
      <h4>Application-Review</h4>
      <img src="https://github.com/user-attachments/assets/e605cb8c-7026-4be3-bb68-9f7b0ae45696" width="250"/>
    </td>
  </tr>
  <tr>
    <td>
      <h4>Payees Fetch /Pay (also create)</h4>
      <img src="https://github.com/user-attachments/assets/ef6cd97f-df5d-46e3-83a2-185e0e64b3fc" width="250"/>
    </td>
     <td>
      <h4> paymanai Dashboard payees prev</h4>
      <img src="https://github.com/user-attachments/assets/4254c258-6063-4e34-9bc4-46ad01c102ca" width="250"/>
    </td>
     <td>
      <h4>Wallet history</h4>
      <img src="https://github.com/user-attachments/assets/7da1307c-bd5f-4898-af1f-4b29c914c9dd" width="250"/>
    </td>
  </tr>
  <tr>
   <td>
      <h4>PaymanAi transaction history</h4>
      <img src="https://github.com/user-attachments/assets/6451965f-bd74-49ae-9865-c9cce1f3c139" width="250"/>
    </td>
     <td>
      <h4>Fetch transaction history</h4>
      <img src="https://github.com/user-attachments/assets/05142fc2-68c9-4805-bbef-d7e85cfb99fc" width="250"/>
    </td>
  </tr>

</table>




## Key Integrations
**PaymanAI SDK**

**OAuth authentication**

**Wallet balance fetch**

**Transaction processing**

**Payee creation and linking**

## ✅ Benefits
🚀 Fully digitized and paperless scholarship process

🔐 Secure and role-based workflows

🔄 Real-time sync across dashboards

📊 Transparent fund tracking and approval audit

📱 Responsive, mobile-first design for accessibility

### For Students
- **User Authentication**: Secure login/registration system
- **Application Submission**: Submit scholarship applications with detailed information
- **Application Tracking**: View application status and history
- **Payment Integration**: Connect to Payman wallet for receiving funds
- **Dashboard Overview**: Personal statistics and recent applications

### For Government Officials
- **Application Review**: Review and approve/reject student applications
- **Payee Management**: Manage student payees in the system
- **Payment Processing**: Process payments to approved students
- **Payment History**: Track all payment transactions
- **Comprehensive Dashboard**: Statistics and system overview


## 📊 Application Flow Diagram

### Student Application Flow
```
Student Login
     │
     ▼
┌─────────────────┐
│ Student Dashboard│
│                 │
│ 1. Overview     │
│ 2. Applications │
│ 3. Payments     │
└─────────────────┘
     │
     ▼ (Click "New Application")
┌─────────────────┐
│ Application Form│
│                 │
│ - Scholarship   │
│ - Amount        │
│ - Description   │
│ - Category      │
└─────────────────┘
     │
     ▼ (Submit)
┌─────────────────┐
│  Auto Actions   │
│                 │
│ 1. Save to      │
│    localStorage │
│ 2. Create Payee │
│    in Payman    │
│ 3. Show Success │
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Application     │
│ Appears in:     │
│                 │
│ - Student       │
│   Dashboard     │
│ - Government    │
│   Review Queue  │
└─────────────────┘
```

### Government Review Flow
```
Government Login
     │
     ▼
┌─────────────────┐
│Government Portal│
│                 │
│ 1. Overview     │
│ 2. Applications │
│ 3. Payees       │
│ 4. Payments     │
│ 5. History      │
└─────────────────┘
     │
     ▼ (Applications Tab)
┌─────────────────┐
│ Pending Reviews │
│                 │
│ - Student Info  │
│ - Application   │
│   Details       │
│ - Amount        │
└─────────────────┘
     │
     ▼ (Click Review)
┌─────────────────┐
│ Review Dialog   │
│                 │
│ - Full Details  │
│ - Comments      │
│ - Approve/      │
│   Reject        │
└─────────────────┘
     │
     ▼ (Decision Made)
┌─────────────────┐
│ Status Update   │
│                 │
│ 1. Update in    │
│    localStorage │
│ 2. Notify       │
│    Student      │
│ 3. Add to       │
│    Payment      │
│    Queue        │
└─────────────────┘
```
## 🗂️ Project Structure

```
src/
├── components/
│   ├── student/
│   │   ├── StudentDashboard.tsx      # Main student interface
│   │   ├── ScholarshipApplicationForm.tsx  # Application form
│   │   ├── PaymanOAuth.tsx           # Wallet integration
│   │   └── StudentPayeeSelector.tsx  # Payment selection
│   │
│   ├── government/
│   │   ├── GovernmentDashboard.tsx   # Main government interface
│   │   ├── ApplicationReview.tsx     # Review applications
│   │   ├── PayeeManagement.tsx       # Manage payees
│   │   ├── PaymentProcessor.tsx      # Process payments
│   │   ├── PaymentHistory.tsx        # Payment tracking
│   │   └── WalletOverview.tsx        # Wallet status
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx             # User login
│   │   └── RegisterForm.tsx          # User registration
│   │
│   └── ui/                           # Reusable UI components
│
├── services/
│   ├── applicationService.ts         # Application data management
│   └── paymanService.ts             # Payment service integration
│
├── contexts/
│   └── AuthContext.tsx              # Authentication state
│
└── pages/
    ├── Index.tsx                    # Landing page
    ├── Auth.tsx                     # Authentication page
    └── PaymanCallback.tsx           # Payment callback
```

## 🔄 Data Flow

### Application Lifecycle
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PENDING   │───▶│  APPROVED   │───▶│    PAID     │    │  REJECTED   │
│             │    │             │    │             │    │             │
│ Student     │    │ Government  │    │ Payment     │    │ Government  │
│ Submitted   │    │ Approved    │    │ Processed   │    │ Rejected    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Shows in:    │    │Shows in:    │    │Shows in:    │    │Shows in:    │
│- Student    │    │- Student    │    │- Student    │    │- Student    │
│  Dashboard  │    │  Dashboard  │    │  Dashboard  │    │  Dashboard  │
│- Gov Queue  │    │- Payment    │    │- Payment    │    │- Gov Review │
│             │    │  Queue      │    │  History    │    │  History    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/kartikmehta18/ScholarPay-paymanai

# Navigate to project directory
cd scholarship-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
The application uses local storage for data persistence and includes demo data for testing.

## 🎯 Usage Guide

### For Students

1. **Registration/Login**
   - Navigate to the auth page
   - Register with email and password
   - Select "Student" as user type

2. **Applying for Scholarships**
   - Go to Applications tab in dashboard
   - Click "New Application"
   - Fill out the application form:
     - Scholarship name
     - Requested amount
     - Description and requirements
     - Category selection
   - Submit application (automatically creates payee account)

3. **Tracking Applications**
   - View all applications in the Applications tab
   - Check status updates in real-time
   - See payment history once approved

### For Government Officials

1. **Login**
   - Use government credentials
   - Access government portal

2. **Reviewing Applications**
   - Navigate to Applications tab
   - Review pending applications
   - Click "Review" to see full details
   - Approve or reject with comments

3. **Managing Payments**
   - Use Payments tab to process approved applications
   - Track payment history in History tab
   - Manage payees in Payees tab

## 🔧 Technical Details

### Key Technologies
- **Frontend: React**: React + TypeScript + Tailwind CSS
- **Authentication**: PaymanAI OAuth + Supabase Auth
- **Backend**: Supabase (Serverless Functions or Postgres)
- **Payments**: PaymanAI SDK (For fund disbursal, payee management)
- **Lucide React**: Icons
- **Radix UI**: Component library


## 🔒 Security Features

- User authentication and authorization
- Role-based access control
- Input validation and sanitization
- Secure payment processing integration
- Error handling and user feedback

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️&☕ by kartikmehta18.xyz*
