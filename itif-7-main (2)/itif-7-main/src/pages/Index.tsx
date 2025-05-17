
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: "operator" | "engineer" | "supervisor" | "manager";
  } | null>(null);

  const handleLogin = (userData: {
    name: string;
    email: string;
    role: "operator" | "engineer" | "supervisor" | "manager";
  }) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/51882ccd-2a07-4d1d-9199-c3393c194aa0.png" 
                  alt="Aperam Logo" 
                  className="h-16" 
                />
              </div>
              <h1 className="text-3xl font-bold text-purple-800">Sistema de Fechamento de Turno</h1>
              <p className="text-gray-600 mt-2">Aperam South America</p>
            </div>
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
