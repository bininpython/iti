
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, User, Calendar, Edit } from "lucide-react";

interface ShiftRecord {
  id: number;
  date: string;
  operator: string;
  shift: string;
  steelType: string;
  status: "pending" | "approved" | "needs-review";
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

interface ShiftRecordsProps {
  userRole: string;
}

// Sample data
const sampleRecords: ShiftRecord[] = [
  {
    id: 1,
    date: "2025-05-12",
    operator: "Abner",
    shift: "morning",
    steelType: "304",
    status: "approved",
    comments: [
      {
        id: 1,
        author: "Ana Márcia",
        role: "engineer",
        text: "Bom trabalho! Todos os parâmetros estão dentro do esperado.",
        timestamp: "2025-05-12 09:30"
      }
    ]
  },
  {
    id: 2,
    date: "2025-05-12",
    operator: "Felipe",
    shift: "afternoon",
    steelType: "316L",
    status: "needs-review",
    comments: [
      {
        id: 1,
        author: "Ana Márcia",
        role: "engineer",
        text: "Por favor, verifique a concentração de HF. Parece estar abaixo do recomendado.",
        timestamp: "2025-05-12 17:45"
      }
    ]
  },
  {
    id: 3,
    date: "2025-05-11",
    operator: "Joaquim",
    shift: "night",
    steelType: "430",
    status: "pending",
    comments: []
  }
];

const ShiftRecords = ({ userRole }: ShiftRecordsProps) => {
  const [records, setRecords] = useState<ShiftRecord[]>(sampleRecords);
  const [selectedRecord, setSelectedRecord] = useState<ShiftRecord | null>(null);
  const [newComment, setNewComment] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredRecords = records.filter(
    (record) =>
      record.operator.toLowerCase().includes(search.toLowerCase()) ||
      record.steelType.toLowerCase().includes(search.toLowerCase()) ||
      record.date.includes(search)
  );

  const handleSelectRecord = (record: ShiftRecord) => {
    setSelectedRecord(record);
  };

  const handleAddComment = () => {
    if (!selectedRecord || !newComment.trim()) return;
    
    const updatedRecords = records.map((record) => {
      if (record.id === selectedRecord.id) {
        const updatedRecord = {
          ...record,
          comments: [
            ...record.comments,
            {
              id: record.comments.length + 1,
              author: userRole === "engineer" ? "Ana Márcia" : userRole === "supervisor" ? "Pedro Costa" : "Roberto Santos",
              role: userRole,
              text: newComment,
              timestamp: new Date().toLocaleString("pt-BR")
            }
          ]
        };
        setSelectedRecord(updatedRecord);
        return updatedRecord;
      }
      return record;
    });

    setRecords(updatedRecords);
    setNewComment("");
    toast.success("Comentário adicionado com sucesso!");
  };

  const handleUpdateStatus = (status: "pending" | "approved" | "needs-review") => {
    if (!selectedRecord) return;
    
    const updatedRecords = records.map((record) => {
      if (record.id === selectedRecord.id) {
        const updatedRecord = { ...record, status };
        setSelectedRecord(updatedRecord);
        return updatedRecord;
      }
      return record;
    });

    setRecords(updatedRecords);
    toast.success(`Status atualizado para: ${getStatusText(status)}`);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "approved": return "Aprovado";
      case "needs-review": return "Requer Revisão";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "needs-review": return "bg-red-100 text-red-800";
      default: return "bg-gray-100";
    }
  };

  const getShiftText = (shift: string) => {
    switch (shift) {
      case "morning": return "Manhã";
      case "afternoon": return "Tarde";
      case "night": return "Noite";
      default: return shift;
    }
  };

  const canChangeStatus = userRole === "engineer" || userRole === "manager";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Records List */}
      <div className="lg:col-span-1">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Registros de Turno</CardTitle>
            <CardDescription>
              {filteredRecords.length} registros encontrados
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por operador, tipo de aço..."
                className="pl-8"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {filteredRecords.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhum registro encontrado
                </div>
              ) : (
                <div className="divide-y">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedRecord?.id === record.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectRecord(record)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            <User size={14} />
                            {record.operator}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar size={14} />
                            {record.date} - {getShiftText(record.shift)}
                          </div>
                          <div className="text-sm">Aço: {record.steelType}</div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}
                        >
                          {getStatusText(record.status)}
                        </span>
                      </div>
                      {record.comments.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          {record.comments.length} comentário(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record Details */}
      <div className="lg:col-span-2">
        {selectedRecord ? (
          <Card className="shadow-sm h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Detalhes do Registro</CardTitle>
                  <CardDescription>
                    Turno: {getShiftText(selectedRecord.shift)} - {selectedRecord.date}
                  </CardDescription>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    selectedRecord.status
                  )}`}
                >
                  {getStatusText(selectedRecord.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Operador</p>
                  <p className="font-medium">{selectedRecord.operator}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Aço</p>
                  <p className="font-medium">{selectedRecord.steelType}</p>
                </div>
              </div>

              {/* Record details would typically show more data here */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500 italic">
                  Para visualizar os detalhes completos, clique em "Ver Detalhes Completos"
                </p>
                
                <Button variant="outline" size="sm" className="mt-2">
                  Ver Detalhes Completos
                </Button>
              </div>

              {/* Comments Section */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Comentários</h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {selectedRecord.comments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Nenhum comentário ainda</p>
                  ) : (
                    selectedRecord.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-sm">{comment.author}</div>
                          <div className="text-xs text-gray-500">{comment.timestamp}</div>
                        </div>
                        <div className="text-xs text-blue-600">{comment.role === "engineer" ? "Engenheiro" : comment.role === "supervisor" ? "Supervisor" : "Gerente"}</div>
                        <p className="mt-1 text-sm">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">Adicionar Comentário</label>
                  <Textarea
                    placeholder="Digite seu comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment} className="w-full">
                    Adicionar Comentário
                  </Button>
                </div>
              </div>
            </CardContent>
            {canChangeStatus && (
              <CardFooter className="border-t pt-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium mb-2">Atualizar Status</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUpdateStatus("pending")}
                    >
                      Pendente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-800 border-red-200"
                      onClick={() => handleUpdateStatus("needs-review")}
                    >
                      Requer Revisão
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-800 border-green-200"
                      onClick={() => handleUpdateStatus("approved")}
                    >
                      Aprovar
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center shadow-sm">
            <CardContent className="text-center py-12">
              <div className="flex flex-col items-center space-y-2 text-gray-500">
                <Edit className="h-12 w-12 opacity-20" />
                <h3 className="text-lg font-medium">Nenhum registro selecionado</h3>
                <p className="text-sm">
                  Selecione um registro da lista para visualizar os detalhes
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShiftRecords;
