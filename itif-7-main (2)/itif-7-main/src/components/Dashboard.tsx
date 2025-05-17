
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShiftForm from "@/components/ShiftForm";
import ShiftRecords from "@/components/ShiftRecords";
import { User, FileText, LogOut, LayoutDashboard, KanbanSquare, Users, MessageSquare } from "lucide-react";
import DashboardOverview from "@/components/DashboardOverview";
import KanbanBoard from "@/components/KanbanBoard";
import TeamChat from "@/components/TeamChat";

interface DashboardProps {
  user: {
    name: string;
    email: string;
    role: "operator" | "engineer" | "supervisor" | "manager";
  } | null;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const canSubmitRecords = user?.role === "operator";
  
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      operator: "Operador",
      engineer: "Engenheiro",
      supervisor: "Supervisor",
      manager: "Gerente"
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-purple-800 to-orange-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/51882ccd-2a07-4d1d-9199-c3393c194aa0.png" 
              alt="Aperam Logo" 
              className="h-10" 
            />
            <h1 className="text-xl font-bold">Sistema de Fechamento de Turno</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <User size={18} />
              <span className="text-sm">{user?.name}</span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded">
                {user ? getRoleDisplayName(user.role) : ""}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="text-white border-white hover:bg-white/20">
              <LogOut size={16} className="mr-1" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="dashboard" className="flex items-center gap-1">
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center gap-1">
                <FileText size={16} />
                <span className="hidden sm:inline">Registros</span>
              </TabsTrigger>
              {canSubmitRecords && (
                <TabsTrigger value="submit" className="flex items-center gap-1">
                  <FileText size={16} />
                  <span className="hidden sm:inline">Novo Registro</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="kanban" className="flex items-center gap-1">
                <KanbanSquare size={16} />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageSquare size={16} />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard" className="space-y-4">
            <DashboardOverview userRole={user?.role || "operator"} />
          </TabsContent>
          
          <TabsContent value="records" className="space-y-4">
            <ShiftRecords userRole={user?.role || "operator"} />
          </TabsContent>
          
          {canSubmitRecords && (
            <TabsContent value="submit">
              <ShiftForm operator={user?.name || ""} email={user?.email || ""} />
            </TabsContent>
          )}
          
          <TabsContent value="kanban">
            <KanbanBoard userRole={user?.role || "operator"} />
          </TabsContent>
          
          <TabsContent value="chat">
            <TeamChat user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
