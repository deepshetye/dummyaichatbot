# AI Chat Application with Nested Comments System

A comprehensive Next.js application featuring an AI chat interface with advanced search capabilities and a sophisticated nested comment system.

## 🚀 Features

### Core Functionality
- **AI Chat Interface**: Professional chat UI similar to ChatGPT/Perplexity
- **Advanced Search**: Autocomplete search with TanStack Query caching
- **Nested Comments**: Multi-level comment threading (up to 4 levels)
- **Real-time Interactions**: Optimistic updates with rollback on errors
- **Voting System**: Upvote/downvote functionality with persistence

### Technical Implementation
- **Next.js 16+ App Router**: Modern file-based routing
- **Server-Side Rendering**: Questions pre-rendered on server
- **Client-Side Hydration**: Interactive components with smooth transitions
- **TanStack Query**: Advanced caching and state management
- **TypeScript**: Full type safety throughout the application
- **shadcn/ui**: Beautiful, accessible UI components
- **Performance Optimizations**: Virtual scrolling, intersection observer, lazy loading

## 🛠️ Technology Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Data**: 1000+ generated questions with placeholder content

## 📁 Project Structure

```
chatapp/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main page (SSR/CSR hybrid)
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── ChatInterface.tsx    # Main chat component
│   ├── CommentSystem.tsx    # Nested comment system
│   ├── SearchAutocomplete.tsx # Advanced search component
│   ├── SearchWrapper.tsx    # Client wrapper for search
│   ├── QuestionsList.tsx     # Server-rendered questions
│   └── VirtualScroll.tsx    # Performance optimization
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── data.ts             # Generated question data
│   ├── utils.ts            # Utility functions
│   ├── hooks.ts            # TanStack Query hooks
│   ├── hooks-intersection.ts # Intersection observer hooks
│   └── providers.tsx        # Query client provider
└── components.json         # shadcn/ui configuration
```

## 🎯 Key Features Explained

### 1. SSR/CSR Hybrid Implementation
- **Server Components**: Questions list is pre-rendered on the server for SEO and performance
- **Client Components**: Interactive elements like search and comments are client-side
- **Progressive Enhancement**: App works without JavaScript, enhanced with client-side features

### 2. Advanced Search System
- **Debounced Input**: Optimized performance with 300ms debounce
- **TanStack Query Caching**: Intelligent caching of search results
- **Character Highlighting**: Bold/highlight matching text in results
- **Keyboard Navigation**: Arrow keys, Enter, and Escape support
- **Server-Side Search**: Initial search results from server, cached on client

### 3. Nested Comment System
- **Multi-level Threading**: Support for up to 4 levels of nesting
- **CRUD Operations**: Create, edit, delete comments with optimistic updates
- **Vote System**: Upvote/downvote with immediate UI feedback
- **Real-time Sorting**: Sort by newest, oldest, or most voted
- **Performance Optimized**: Lazy loading and memoized components

### 4. Performance Optimizations
- **Virtual Scrolling**: Efficient rendering of large comment lists
- **Intersection Observer**: Lazy loading of comment items
- **React.memo**: Prevent unnecessary re-renders
- **useCallback**: Optimized event handlers
- **Custom Scrollbars**: Smooth scrolling experience

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI/UX Features

### Design System
- **Dark/Light Mode**: Automatic theme detection with manual override
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: WCAG compliant components with keyboard navigation
- **Smooth Animations**: Fade-in effects and smooth transitions

### Chat Interface
- **Professional Layout**: Clean, modern design inspired by ChatGPT
- **Message Types**: Distinct styling for user and AI messages
- **Timestamps**: Formatted date/time display
- **Question IDs**: Trackable question references

### Search Experience
- **Instant Feedback**: Real-time search results as you type
- **Visual Highlighting**: Matching text highlighted in results
- **Category Tags**: Color-coded category badges
- **Empty States**: Helpful messages when no results found

## 🔧 Technical Details

### Data Management
- **1000+ Questions**: Generated using placeholder APIs
- **Categories**: 15 different categories (Technology, Science, Health, etc.)
- **Tags**: Dynamic tagging system for better organization
- **Mock Responses**: Predefined AI responses for each question

### State Management
- **TanStack Query**: Server state management with caching
- **React State**: Local component state for UI interactions
- **Optimistic Updates**: Immediate UI feedback with error rollback
- **Persistence**: Comment votes stored in browser storage

### Performance Considerations
- **Code Splitting**: Automatic code splitting with Next.js
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Prevent unnecessary re-renders
- **Virtual Scrolling**: Handle large datasets efficiently

## 🧪 Testing

The application includes comprehensive error handling and edge cases:

- **Empty States**: Graceful handling of no data
- **Loading States**: Proper loading indicators
- **Error Boundaries**: Catch and display errors gracefully
- **Input Validation**: Prevent invalid submissions
- **Keyboard Navigation**: Full keyboard accessibility

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **TanStack** for React Query
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
