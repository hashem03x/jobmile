# Employment Matcher Platform

A modern, AI-powered employment matching platform built with React, Material-UI, and Bootstrap. This platform connects candidates with companies using advanced matching algorithms, skills gap analysis, and cultural fit assessment.

## 🚀 Features

### For Candidates
- **Personalized Job Matching**: AI-powered job recommendations based on skills, experience, and preferences
- **Skills Gap Analysis**: Identify skills to develop with personalized learning recommendations
- **Cultural Fit Assessment**: Evaluate compatibility with company culture
- **Diversity & Inclusion Filters**: Find companies that prioritize D&I initiatives
- **Interactive Chatbot**: RAG-powered AI assistant for career guidance and job search

### For Employers
- **Candidate Management**: Sort and filter candidates by applied and non-applied status
- **Skills Matching**: Find candidates with specific skill sets
- **Cultural Fit Metrics**: Assess candidate-company cultural alignment
- **Diversity Tracking**: Monitor and promote inclusive hiring practices

### Core Features
- **Dual Interface**: Switch between candidate and employer views
- **Real-time Chatbot**: AI assistant with quick actions and suggestions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX**: Beautiful, intuitive interface with Material-UI components
- **Field-based Filtering**: Organize jobs and candidates by professional fields

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0
- **UI Framework**: Material-UI (MUI) v5
- **CSS Framework**: Bootstrap 5
- **Icons**: Material-UI Icons
- **Styling**: Emotion (CSS-in-JS)
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employment_matcher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
employment_matcher/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── JobCard.js          # Reusable job listing component
│   │   └── ChatbotWidget.js    # AI chatbot interface
│   ├── App.js                  # Main application component
│   ├── App.css                 # Custom styles
│   └── index.js               # Application entry point
├── package.json
└── README.md
```

## 🎨 UI Components

### JobCard Component
- Displays job information with company logo
- Shows match percentage and skills required
- Includes D&I friendly badges
- Action buttons for apply, bookmark, and share
- Hover effects and animations

### ChatbotWidget Component
- AI-powered employment assistant
- Quick action buttons for common tasks
- Real-time message exchange
- Suggestion chips for guided interactions
- Typing indicators and timestamps

### Dashboard Features
- **Candidate Dashboard**: Job recommendations, skills analysis, cultural assessment
- **Employer Dashboard**: Candidate management with tabs for applied/non-applied
- **Statistics Cards**: Key metrics and insights
- **Navigation Drawer**: Side menu with main sections

## 🎯 Key Features Implementation

### 1. Personalized Job Matching
- Match score calculation based on skills and preferences
- Field-based job categorization
- Real-time filtering and sorting

### 2. Skills Gap Analysis
- Visual representation of skills to develop
- Learning path recommendations
- Progress tracking capabilities

### 3. Cultural Fit Assessment
- Cultural profile evaluation
- Company culture matching
- Assessment questionnaires

### 4. Diversity & Inclusion
- D&I friendly company badges
- Inclusive hiring practices tracking
- Diversity metrics and reporting

### 5. AI Chatbot Integration
- RAG-powered responses
- Context-aware suggestions
- Quick action buttons
- Conversation history

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1976d2) - Trust and professionalism
- **Secondary**: Pink (#dc004e) - Innovation and creativity
- **Success**: Green (#4caf50) - Positive actions and D&I
- **Warning**: Orange (#ff9800) - Skills gaps and alerts

### Typography
- **Font Family**: Roboto (Material Design standard)
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weight for readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Rounded with hover effects
- **Chips**: Color-coded for different purposes
- **Icons**: Material Design icon set

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- **Desktop**: Full-featured interface with side navigation
- **Tablet**: Adapted layout with collapsible elements
- **Mobile**: Touch-friendly interface with bottom navigation

## 🔧 Customization

### Theme Configuration
Modify the theme in `src/App.js`:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    // Add custom colors
  },
  // Customize component styles
});
```

### Adding New Components
1. Create component in `src/components/`
2. Import and use in `App.js`
3. Add custom styles in `App.css`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications**: Push notifications for job updates
- **Advanced Filtering**: More sophisticated search and filter options
- **Analytics Dashboard**: Detailed insights and metrics
- **Mobile App**: Native mobile application
- **Integration APIs**: Connect with job boards and HR systems

### Technical Improvements
- **State Management**: Redux or Context API for complex state
- **Backend Integration**: Node.js/Express API
- **Database**: MongoDB or PostgreSQL
- **Authentication**: JWT-based user authentication
- **Real-time Features**: WebSocket integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development**: React & Material-UI
- **UI/UX Design**: Modern, accessible design patterns
- **AI Integration**: RAG-powered chatbot
- **Responsive Design**: Mobile-first approach

## 📞 Support

For questions or support, please open an issue in the GitHub repository or contact the development team.

---

**Employment Matcher Platform** - Connecting talent with opportunity through AI-powered matching.
#   j o b s y  
 