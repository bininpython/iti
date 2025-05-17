
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Calendar, CheckCircle, AlertTriangle, Activity } from "lucide-react";

interface DashboardOverviewProps {
  userRole: string;
}

const DashboardOverview = ({ userRole }: DashboardOverviewProps) => {
  // Dados de exemplo para os gráficos
  const shiftData = [
    { name: "Segunda", registros: 4, aprovados: 3, pendentes: 1 },
    { name: "Terça", registros: 5, aprovados: 4, pendentes: 1 },
    { name: "Quarta", registros: 3, aprovados: 3, pendentes: 0 },
    { name: "Quinta", registros: 6, aprovados: 4, pendentes: 2 },
    { name: "Sexta", registros: 4, aprovados: 2, pendentes: 2 },
    { name: "Sábado", registros: 3, aprovados: 3, pendentes: 0 },
    { name: "Domingo", registros: 2, aprovados: 2, pendentes: 0 }
  ];

  const steelTypeData = [
    { name: "304", value: 45 },
    { name: "316L", value: 25 },
    { name: "430", value: 20 },
    { name: "Outros", value: 10 }
  ];

  const COLORS = ["#8B5CF6", "#EC4899", "#F97316", "#84CC16"];

  const concentrationData = [
    { data: "10/05", HF: 4.2, HNO3: 12.7 },
    { data: "11/05", HF: 4.3, HNO3: 12.5 },
    { data: "12/05", HF: 4.1, HNO3: 12.9 },
    { data: "13/05", HF: 4.4, HNO3: 12.6 },
    { data: "14/05", HF: 4.2, HNO3: 12.4 },
    { data: "15/05", HF: 4.3, HNO3: 12.7 },
    { data: "16/05", HF: 4.5, HNO3: 12.8 }
  ];

  const notificationsData = [
    {
      id: 1,
      message: "Novo comentário em seu registro de turno",
      time: "Há 10 minutos",
      type: "comment"
    },
    {
      id: 2,
      message: "Registro do turno noturno requer revisão",
      time: "Há 2 horas",
      type: "alert"
    },
    {
      id: 3,
      message: "Concentração de HF abaixo do ideal",
      time: "Há 3 horas",
      type: "warning"
    }
  ];

  const kpiData = [
    { title: "Registros Hoje", value: "7", icon: FileIcon, color: "bg-blue-100 text-blue-800" },
    { title: "Turnos Aprovados", value: "82%", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    { title: "Pendências", value: "5", icon: AlertTriangle, color: "bg-orange-100 text-orange-800" },
    { title: "Usuários Ativos", value: "12", icon: User, color: "bg-purple-100 text-purple-800" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-800">Dashboard</h2>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-full ${kpi.color}`}>
                <kpi.icon size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de registros por dia */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Registros de Turno por Dia</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shiftData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="aprovados" fill="#8B5CF6" />
                <Bar dataKey="pendentes" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de tipos de aço */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Aço</CardTitle>
            <CardDescription>Último mês</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={steelTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {steelTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concentrações químicas */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Concentrações Químicas</CardTitle>
            <CardDescription>HF e HNO₃ nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={concentrationData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="HF" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="HNO3" stroke="#F97316" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Atualizações recentes</CardDescription>
            </div>
            <Bell className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationsData.map(notification => (
                <div key={notification.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <div className={`mt-1 p-1.5 rounded-full ${
                    notification.type === 'comment' ? 'bg-purple-100 text-purple-800' :
                    notification.type === 'alert' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {notification.type === 'comment' ? <MessageSquare size={16} /> : 
                     notification.type === 'alert' ? <AlertTriangle size={16} /> :
                     <Activity size={16} />}
                  </div>
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Ver todas notificações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Ícones para KPIs
const FileIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const MessageSquare = ({ size = 24 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default DashboardOverview;
