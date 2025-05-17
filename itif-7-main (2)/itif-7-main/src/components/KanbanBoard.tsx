
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KanbanSquare, User, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface KanbanTask {
  id: number;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
  createdBy: string;
}

interface KanbanBoardProps {
  userRole: string;
}

const KanbanBoard = ({ userRole }: KanbanBoardProps) => {
  // Dados iniciais de exemplo
  const initialTasks: KanbanTask[] = [
    {
      id: 1,
      title: "Revisar parâmetros de decapagem",
      description: "Analisar os parâmetros de decapagem do turno da manhã e verificar concentrações",
      assignee: "Ana Márcia",
      priority: "high",
      status: "todo",
      createdBy: "Pedro Costa",
    },
    {
      id: 2,
      title: "Manutenção da escova 2",
      description: "Realizar a troca da escova 2 que está apresentando desgaste",
      assignee: "Carlos Silva",
      priority: "medium",
      status: "in-progress",
      createdBy: "Roberto Santos",
    },
    {
      id: 3,
      title: "Verificar consumo de HF",
      description: "Analisar o consumo de HF do último mês e preparar relatório",
      assignee: "João Mendes",
      priority: "low",
      status: "review",
      createdBy: "Ana Márcia",
    },
    {
      id: 4,
      title: "Calibração dos sensores de pH",
      description: "Realizar a calibração semestral dos sensores de pH da linha 2",
      assignee: "Roberto Almeida",
      priority: "medium",
      status: "done",
      createdBy: "Ana Márcia",
    },
  ];

  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [newTask, setNewTask] = useState<Partial<KanbanTask>>({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    status: "todo",
  });

  const canCreateTasks = userRole === "engineer" || userRole === "supervisor" || userRole === "manager";

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description || !newTask.assignee) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    if (editingTask) {
      // Editar tarefa existente
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...newTask } : task
      );
      setTasks(updatedTasks);
      toast.success("Tarefa atualizada com sucesso!");
    } else {
      // Criar nova tarefa
      const newTaskWithId: KanbanTask = {
        ...newTask as KanbanTask,
        id: Math.max(0, ...tasks.map(t => t.id)) + 1,
        createdBy: userRole === "engineer" ? "Ana Márcia" : userRole === "supervisor" ? "Pedro Costa" : "Roberto Santos",
      };
      setTasks([...tasks, newTaskWithId]);
      toast.success("Tarefa criada com sucesso!");
    }
    
    setNewTaskOpen(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      status: "todo",
    });
  };

  const handleEditTask = (task: KanbanTask) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
    });
    setNewTaskOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Tarefa removida com sucesso!");
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: KanbanTask["status"]) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    
    setTasks(updatedTasks);
    toast.success("Status da tarefa atualizado!");
  };

  // Filtrar tarefas por status
  const getTasksByStatus = (status: KanbanTask["status"]) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityBadge = (priority: KanbanTask["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Alta</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Baixa</Badge>;
    }
  };

  const getStatusColumn = (status: KanbanTask["status"]) => {
    const statusTitles = {
      "todo": "A Fazer",
      "in-progress": "Em Progresso",
      "review": "Em Revisão",
      "done": "Concluído"
    };
    
    const statusColors = {
      "todo": "bg-gray-100",
      "in-progress": "bg-blue-50",
      "review": "bg-amber-50",
      "done": "bg-green-50"
    };

    return (
      <div 
        className={`${statusColors[status]} rounded-lg p-4 min-h-[500px] flex flex-col`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{statusTitles[status]}</h3>
          <span className="bg-white text-xs px-2 py-1 rounded-full">
            {getTasksByStatus(status).length}
          </span>
        </div>
        
        <div className="space-y-3 flex-grow">
          {getTasksByStatus(status).map(task => (
            <Card 
              key={task.id} 
              className="bg-white shadow-sm cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {task.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-3 pt-1 flex flex-col items-start">
                <div className="flex justify-between w-full items-center mb-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <User size={12} className="mr-1" />
                    {task.assignee}
                  </div>
                  {getPriorityBadge(task.priority)}
                </div>
                
                <div className="flex justify-between w-full mt-2">
                  <div className="text-xs text-gray-500">
                    <span>Por: {task.createdBy}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit size={12} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-purple-800">Quadro Kanban</h2>
          <p className="text-gray-500">Arraste e solte as tarefas entre as colunas</p>
        </div>
        {canCreateTasks && (
          <Button 
            onClick={() => setNewTaskOpen(true)}
            className="bg-purple-800 hover:bg-purple-700"
          >
            <Plus size={16} className="mr-1" /> Nova Tarefa
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-4">
        {getStatusColumn("todo")}
        {getStatusColumn("in-progress")}
        {getStatusColumn("review")}
        {getStatusColumn("done")}
      </div>
      
      {/* Modal para nova/edição de tarefa */}
      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Título</label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Digite o título da tarefa"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Descrição</label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Descreva a tarefa a ser realizada"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="assignee" className="text-sm font-medium">Responsável</label>
              <Input
                id="assignee"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Prioridade</label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as KanbanTask["priority"] })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select
                id="status"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as KanbanTask["status"] })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="todo">A Fazer</option>
                <option value="in-progress">Em Progresso</option>
                <option value="review">Em Revisão</option>
                <option value="done">Concluído</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskOpen(false)}>Cancelar</Button>
            <Button className="bg-purple-800 hover:bg-purple-700" onClick={handleCreateTask}>
              {editingTask ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
