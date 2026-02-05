import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MoneyProvider } from './context/MoneyContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddTransactionModal from './components/AddTransactionModal';
import Login from './components/Login';
import Signup from './components/Signup';

import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';

import Analytics from './components/Analytics';
import BudgetPlanner from './components/BudgetPlanner';
import Settings from './components/Settings';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MoneyProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRoutes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute>
                <AnalyticsRoutes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/budget-planner" element={
              <ProtectedRoute>
                <BudgetRoutes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <SettingsRoutes />
              </ProtectedRoute>
            } />
          </Routes>
        </MoneyProvider>
      </AuthProvider>
    </Router>
  );
}

function DashboardRoutes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultDate, setModalDefaultDate] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <Layout isDashboard={true}>
      <Dashboard
        onOpenAddModal={handleOpenAdd}
        setSelectedDateForModal={setModalDefaultDate}
        onEditTransaction={handleEdit}
      />
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDate={modalDefaultDate}
        transactionToEdit={editingTransaction}
      />
    </Layout>
  );
}

function AnalyticsRoutes() {
  return (
    <Layout isDashboard={true}>
      <Analytics />
    </Layout>
  );
}

function BudgetRoutes() {
  return (
    <Layout isDashboard={true}>
      <BudgetPlanner />
    </Layout>
  );
}

function SettingsRoutes() {
  return (
    <Layout isDashboard={true}>
      <Settings />
    </Layout>
  );
}

export default App;
