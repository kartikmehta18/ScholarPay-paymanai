
# Scholarship Management System

A comprehensive web application for managing scholarship applications, built with React, TypeScript, and Tailwind CSS. This system enables students to apply for scholarships and allows government officials to review, approve, and process payments.

## 🚀 Features

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

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Student UI    │    │ Government UI   │    │  Auth System    │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - Dashboard     │    │ - Login/Register│
│ - Applications  │    │ - Reviews       │    │ - User Context  │
│ - Profile       │    │ - Payments      │    │ - Role-based    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                ┌─────────────────▼─────────────────┐
                │        Application Service        │
                │                                   │
                │ - Store/Retrieve Applications     │
                │ - Status Management              │
                │ - Data Persistence               │
                └─────────────────┬─────────────────┘
                                 │
                ┌─────────────────▼─────────────────┐
                │       Local Storage              │
                │                                   │
                │ - Applications Data              │
                │ - User Preferences               │
                │ - Session Data                   │
                └───────────────────────────────────┘
```

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
git clone <repository-url>

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
- **React 18**: Frontend framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **Lucide React**: Icons
- **Radix UI**: Component library

### State Management
- React Context for authentication
- localStorage for data persistence
- Component state for UI interactions

### API Integration
- Payman service for payment processing
- RESTful service architecture
- Error handling and validation

## 🧪 Testing

### Manual Testing Workflow
1. Create student account and submit application
2. Login as government user and review application
3. Approve application and verify status updates
4. Check payment history and payee management
5. Test rejection workflow

### Test Data
The application includes fallback demo data for testing without actual submissions.

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

## 🐛 Troubleshooting

### Common Issues

1. **Applications not showing**
   - Check localStorage in browser dev tools
   - Verify user is logged in with correct role

2. **Payment integration issues**
   - Check Payman service configuration
   - Verify network connectivity

3. **Status updates not reflecting**
   - Refresh the page
   - Check console for errors

## 📈 Future Enhancements

- [ ] Database integration (replace localStorage)
- [ ] Email notifications for status updates
- [ ] Document upload functionality
- [ ] Advanced filtering and search
- [ ] Reporting and analytics
- [ ] Mobile responsiveness improvements
- [ ] Automated testing suite

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section

---

*Built with ❤️&☕ using React and TypeScript*
