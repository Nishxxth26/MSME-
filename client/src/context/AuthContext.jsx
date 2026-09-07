import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  customer: {
    id: 'usr-customer-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    role: 'customer',
    phone: '+91 98765 43210',
    address: '42 Green Valley Enclave, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    ecoPoints: 140,
    treesPlanted: 4,
    carbonSavedKg: 32.6,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  seller: {
    id: 'usr-seller-1',
    name: 'Meera Pillai',
    email: 'meera@prakritinaturals.in',
    role: 'seller',
    phone: '+91 94471 23456',
    address: 'Coconut Grove Craft Unit, Ward 4',
    city: 'Alappuzha',
    state: 'Kerala',
    pincode: '688001',
    ecoPoints: 380,
    treesPlanted: 18,
    carbonSavedKg: 145.2,
    enterpriseName: 'Prakriti Naturals',
    msmeRegNo: 'UDYAM-KL-02-004819',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ecocart_auth') === 'true';
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('ecocart_role') || 'customer';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecocart_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_ACCOUNTS.customer;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    localStorage.setItem('ecocart_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ecocart_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ecocart_user', JSON.stringify(user));
  }, [user]);

  // Login handler
  const login = (email, password, selectedRole = 'customer') => {
    const matchedAccount = selectedRole === 'seller' ? DEMO_ACCOUNTS.seller : DEMO_ACCOUNTS.customer;
    const activeUser = {
      ...matchedAccount,
      email: email || matchedAccount.email,
      name: email.split('@')[0] || matchedAccount.name,
      role: selectedRole
    };

    setUser(activeUser);
    setRole(selectedRole);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return { success: true, user: activeUser };
  };

  // Quick 1-click Demo Login
  const loginAsDemo = (demoRole) => {
    const demoUser = DEMO_ACCOUNTS[demoRole] || DEMO_ACCOUNTS.customer;
    setUser(demoUser);
    setRole(demoRole);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return { success: true, user: demoUser };
  };

  // Registration handler
  const register = (registrationData) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      name: registrationData.name,
      email: registrationData.email,
      role: registrationData.role || 'customer',
      phone: registrationData.phone || '',
      address: registrationData.address || '',
      city: registrationData.city || '',
      state: registrationData.state || '',
      pincode: registrationData.pincode || '',
      ecoPoints: registrationData.role === 'customer' ? 50 : 100, // welcome bonus!
      treesPlanted: 1, // 1 tree for signing up
      carbonSavedKg: 2.0,
      enterpriseName: registrationData.enterpriseName || '',
      msmeRegNo: registrationData.msmeRegNo || (registrationData.role === 'seller' ? 'UDYAM-' + Math.floor(100000 + Math.random() * 900000) : ''),
      avatar: registrationData.role === 'seller' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };

    setUser(newUser);
    setRole(newUser.role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  // Logout handler
  const logout = () => {
    setIsAuthenticated(false);
    setRole('customer');
    setUser(DEMO_ACCOUNTS.customer);
    localStorage.removeItem('ecocart_auth');
  };

  const toggleRole = () => {
    setRole(prev => {
      const next = prev === 'customer' ? 'seller' : 'customer';
      if (next === 'seller') {
        setUser(DEMO_ACCOUNTS.seller);
      } else {
        setUser(DEMO_ACCOUNTS.customer);
      }
      return next;
    });
  };

  const deductEcoPoints = (amount) => {
    setUser(prev => ({
      ...prev,
      ecoPoints: Math.max(0, prev.ecoPoints - amount)
    }));
  };

  const addOrderImpact = (earnedPoints, carbonSaved, trees) => {
    setUser(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + earnedPoints,
      carbonSavedKg: parseFloat((prev.carbonSavedKg + carbonSaved).toFixed(1)),
      treesPlanted: prev.treesPlanted + (trees || 0)
    }));
  };

  const openLoginModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        setRole,
        toggleRole,
        user,
        setUser,
        login,
        loginAsDemo,
        register,
        logout,
        deductEcoPoints,
        addOrderImpact,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
