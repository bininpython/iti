
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Users, Send, Search, Phone, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: number;
  sender: {
    name: string;
    role: string;
    avatar?: string;
  };
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface ChatUser {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

interface TeamChatProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const TeamChat = ({ user }: TeamChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<ChatUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Lista de contatos de exemplo
  const contacts: ChatUser[] = [
    {
      id: 1,
      name: "Rafael",
      role: "engineer",
      status: "online"
    },
    {
      id: 2,
      name: "Henrique",
      role: "manager", // Changed from supervisor to manager
      status: "online"
    },
    {
      id: 3,
      name: "Lucas",
      role: "operator",
      status: "offline",
      lastSeen: "Há 10 minutos"
    },
    {
      id: 4,
      name: "William",
      role: "supervisor", // Changed from manager to supervisor
      status: "away"
    },
    {
      id: 5,
      name: "João Mendes",
      role: "operator",
      status: "online"
    },
    {
      id: 6,
      name: "Eduardo Lima",
      role: "engineer",
      status: "offline",
      lastSeen: "Hoje, 10:45"
    }
  ];

  // Mensagens de exemplo
  const sampleMessages = [
    {
      id: 1,
      sender: {
        name: "Rafael",
        role: "engineer"
      },
      message: "Bom dia! Precisamos verificar a concentração de HF no tanque 2, está um pouco baixa.",
      timestamp: "09:32",
      isCurrentUser: false
    },
    {
      id: 2,
      sender: {
        name: user?.name || "Usuário",
        role: user?.role || "operator"
      },
      message: "Vou verificar agora e fazer os ajustes necessários.",
      timestamp: "09:35",
      isCurrentUser: true
    },
    {
      id: 3,
      sender: {
        name: "Rafael",
        role: "engineer"
      },
      message: "Obrigada! Me avisa quando terminar para que possamos documentar no sistema.",
      timestamp: "09:36",
      isCurrentUser: false
    }
  ];

  // Configurar mensagens iniciais quando um contato é selecionado
  useEffect(() => {
    if (selectedContact) {
      setMessages(sampleMessages);
      scrollToBottom();
    }
  }, [selectedContact]);

  // Rolar para baixo após nova mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedContact) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: {
        name: user?.name || "Usuário",
        role: user?.role || "operator"
      },
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simular resposta após um tempo
    setTimeout(() => {
      const response: ChatMessage = {
        id: Date.now() + 1,
        sender: {
          name: selectedContact.name,
          role: selectedContact.role
        },
        message: "Ok, recebi sua mensagem. Vou verificar e retornar em breve.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: false
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      operator: "Operador",
      engineer: "Engenheiro",
      supervisor: "Supervisor",
      manager: "Gerente"
    };
    return roleMap[role] || role;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[750px]">
      {/* Lista de contatos */}
      <Card className="lg:col-span-1 shadow-sm h-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="text-xl">Contatos</span>
            <Users size={18} className="text-purple-600" />
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar contatos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[630px] w-full">
            <div className="divide-y">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                    selectedContact?.id === contact.id ? "bg-purple-50" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className={
                        contact.role === "engineer" ? "bg-purple-100 text-purple-800" :
                        contact.role === "supervisor" ? "bg-blue-100 text-blue-800" :
                        contact.role === "manager" ? "bg-orange-100 text-orange-800" :
                        "bg-gray-100 text-gray-800"
                      }>
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(contact.status)} ring-2 ring-white`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{contact.name}</p>
                    <p className="text-xs text-gray-500">
                      {getRoleDisplayName(contact.role)}
                      {contact.status === "offline" && contact.lastSeen && (
                        <span className="ml-1">{" • "}{contact.lastSeen}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="lg:col-span-3 shadow-sm h-full">
        {selectedContact ? (
          <>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className={
                      selectedContact.role === "engineer" ? "bg-purple-100 text-purple-800" :
                      selectedContact.role === "supervisor" ? "bg-blue-100 text-blue-800" :
                      selectedContact.role === "manager" ? "bg-orange-100 text-orange-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {getInitials(selectedContact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedContact.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(selectedContact.status)}`}></span>
                      {selectedContact.status === "online" ? "Online" : selectedContact.status === "away" ? "Ausente" : `Offline ${selectedContact.lastSeen ? `• ${selectedContact.lastSeen}` : ""}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Video size={18} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[560px] w-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex gap-3 max-w-[80%]">
                        {!message.isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={
                              message.sender.role === "engineer" ? "bg-purple-100 text-purple-800" :
                              message.sender.role === "supervisor" ? "bg-blue-100 text-blue-800" :
                              message.sender.role === "manager" ? "bg-orange-100 text-orange-800" :
                              "bg-gray-100 text-gray-800"
                            }>
                              {getInitials(message.sender.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className={`rounded-lg p-3 ${
                            message.isCurrentUser 
                              ? "bg-purple-100 text-purple-900 rounded-tr-none"
                              : "bg-gray-100 text-gray-800 rounded-tl-none"
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.isCurrentUser ? "Você" : message.sender.name} • {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-3">
              <div className="flex gap-2 w-full">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  className="min-h-10 max-h-32"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  className="bg-purple-800 hover:bg-purple-700 rounded-full h-10 w-10 p-0"
                >
                  <Send size={18} />
                </Button>
              </div>
            </CardFooter>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <Users size={64} className="mx-auto text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600">Selecione um contato</h3>
              <p className="text-gray-500 text-sm max-w-md">
                Escolha um contato da lista para iniciar uma conversa
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeamChat;
