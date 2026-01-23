# MyCash+ 💰

MyCash+ is a modern, premium personal finance dashboard built with React. It features a responsive design, transaction management, family sharing capabilities, financial goals tracking, and insightful visualizations.

## 🚀 Technologies

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (v3), PostCSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** React Context API + LocalStorage Persistence
- **Routing:** React Router DOM (v6)
- **Utilities:** date-fns, clsx, tailwind-merge

## 🛠️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication related components
│   ├── dashboard/      # Dashboard specific widgets
│   ├── layout/         # Sidebar, Header, Layout wrappers
│   └── ui/             # Generic UI elements (inputs, modals)
├── context/            # Global State (Auth, Finance)
├── data/               # Mock data generators
├── types/              # TypeScript interfaces
├── utils/              # Helper functions (masks, formatters)
└── views/              # Page components (Dashboard, Login, Goals, etc.)
```

## 🏃‍♂️ Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## ✨ Key Features

-   **Dashboard:** High-level overview of net worth, income, expenses, and monthly flow.
-   **Family Management:** Filter financial data by family member.
-   **Transactions:** Complete CRUD for income and expenses with advanced filtering.
-   **Goals (Caixinhas):** Track savings goals with yield projections (CDI, Crypto, etc.).
-   **Authentication:** Mock text-based login system with session persistence.
-   **Responsive Design:** Fully fluid layout adapting from Mobile (375px) to Wide Desktop (1920px).

## 🧪 Testing Credentials

The system uses a mock authentication flow. You can use any non-empty credentials to log in:

-   **Email:** `admin@mycash.com` (example)
-   **Password:** `123456`

## 📝 Design Decisions & Notes

-   **Visual Identity:** The project follows a "Glassmorphism" inspired premium aesthetic with clear hierarchy, using a soft gray scale with vibrant accents for financial indicators.
-   **Data Persistence:** To provide a realistic prototype experience without a real backend, all data (transactions, members, goals) is persisted in the browser's `localStorage`.
-   **Filtering Logic:** Balance cards (Income/Expense) respond to global filters (Member/Date), allowing for granular analysis of individual or family finances.
-   **Mobile Experience:** The sidebar automatically converts to a bottom drawer/mobile header validation on smaller screens to ensure usability.

## 📄 License

This project is for educational and demonstration purposes.
