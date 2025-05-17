import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ShiftFormProps {
  operator: string;
  email: string;
}

const ShiftForm = ({ operator, email }: ShiftFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    shift: "morning",
    steelType: "",
    // Chemical Pickling
    hfConcentration: "",
    hno3Concentration: "",
    tm1Consumption: "",
    tm2Consumption: "",
    tm1Volume: "",
    tm2Volume: "",
    brush1: "good",
    brush2: "good",
    brush3: "good",
    brush4: "good",
    hfAddition: "",
    hno3Addition: "",
    chemSample_hno3: "",
    chemSample_hf: "",
    chemSample_iron: "",
    chemObservations: "",
    // Electrolytic Pickling
    electrolyteAddition: "",
    carbonateAddition: "",
    sulfuricAcidAddition: "",
    electroSample_conductivity: "",
    electroSample_ph: "",
    electroSample_iron: "",
    electroObservations: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Form Data:", { ...formData, operator, email });
      toast.success("Registro de turno enviado com sucesso!");
      setIsSubmitting(false);
      
      // Reset some fields while keeping date and operator info
      setFormData({
        ...formData,
        steelType: "",
        // Reset Chemical Pickling fields
        hfConcentration: "",
        hno3Concentration: "",
        tm1Consumption: "",
        tm2Consumption: "",
        tm1Volume: "",
        tm2Volume: "",
        brush1: "good",
        brush2: "good",
        brush3: "good",
        brush4: "good",
        hfAddition: "",
        hno3Addition: "",
        chemSample_hno3: "",
        chemSample_hf: "",
        chemSample_iron: "",
        chemObservations: "",
        // Reset Electrolytic Pickling fields
        electrolyteAddition: "",
        carbonateAddition: "",
        sulfuricAcidAddition: "",
        electroSample_conductivity: "",
        electroSample_ph: "",
        electroSample_iron: "",
        electroObservations: "",
      });
    }, 1500);
  };

  const getConditionClass = (condition: string) => {
    switch (condition) {
      case "good": return "bg-green-500 text-white";
      case "regular": return "bg-yellow-500 text-white";
      case "bad": return "bg-red-500 text-white";
      default: return "bg-gray-200";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informações Básicas do Turno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Operador</label>
              <Input value={operator} disabled />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={email} disabled />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Select 
                value={formData.shift} 
                onValueChange={(value) => handleSelectChange("shift", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Manhã</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="night">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Aço</label>
              <Input
                name="steelType"
                placeholder="Ex: 304, 316L"
                value={formData.steelType}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chemical" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chemical">Decapagem Química</TabsTrigger>
          <TabsTrigger value="electrolytic">Decapagem Eletrolítica</TabsTrigger>
        </TabsList>
        
        {/* Chemical Pickling Tab */}
        <TabsContent value="chemical">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Decapagem Química</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Concentração de HF (%)</label>
                  <Input
                    type="number"
                    name="hfConcentration"
                    placeholder="0.0"
                    value={formData.hfConcentration}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Concentração de HNO₃ (%)</label>
                  <Input
                    type="number"
                    name="hno3Concentration"
                    placeholder="0.0"
                    value={formData.hno3Concentration}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consumo TM1 (L)</label>
                  <Input
                    type="number"
                    name="tm1Consumption"
                    placeholder="0"
                    value={formData.tm1Consumption}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consumo TM2 (L)</label>
                  <Input
                    type="number"
                    name="tm2Consumption"
                    placeholder="0"
                    value={formData.tm2Consumption}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume TM1 (L)</label>
                  <Input
                    type="number"
                    name="tm1Volume"
                    placeholder="0"
                    value={formData.tm1Volume}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume TM2 (L)</label>
                  <Input
                    type="number"
                    name="tm2Volume"
                    placeholder="0"
                    value={formData.tm2Volume}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Condições das Escovas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((brushNum) => (
                    <div key={brushNum} className="space-y-2">
                      <label className="text-sm font-medium">Escova {brushNum}</label>
                      <Select 
                        value={formData[`brush${brushNum}` as keyof typeof formData]} 
                        onValueChange={(value) => handleSelectChange(`brush${brushNum}`, value)}
                      >
                        <SelectTrigger className={getConditionClass(formData[`brush${brushNum}` as keyof typeof formData] as string)}>
                          <SelectValue placeholder="Condição" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Bom</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="bad">Ruim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adição de HF (L)</label>
                  <Input
                    type="number"
                    name="hfAddition"
                    placeholder="0"
                    value={formData.hfAddition}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adição de HNO₃ (L)</label>
                  <Input
                    type="number"
                    name="hno3Addition"
                    placeholder="0"
                    value={formData.hno3Addition}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Resultados de Amostras</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HNO₃ (%)</label>
                    <Input
                      type="number"
                      name="chemSample_hno3"
                      placeholder="0.0"
                      value={formData.chemSample_hno3}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HF (%)</label>
                    <Input
                      type="number"
                      name="chemSample_hf"
                      placeholder="0.0"
                      value={formData.chemSample_hf}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ferro (ppm)</label>
                    <Input
                      type="number"
                      name="chemSample_iron"
                      placeholder="0"
                      value={formData.chemSample_iron}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <Textarea
                  name="chemObservations"
                  placeholder="Observações sobre a decapagem química"
                  value={formData.chemObservations}
                  onChange={handleChange}
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Electrolytic Pickling Tab */}
        <TabsContent value="electrolytic">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Decapagem Eletrolítica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adição de Eletrólito (L)</label>
                  <Input
                    type="number"
                    name="electrolyteAddition"
                    placeholder="0"
                    value={formData.electrolyteAddition}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adição de Carbonato (kg)</label>
                  <Input
                    type="number"
                    name="carbonateAddition"
                    placeholder="0"
                    value={formData.carbonateAddition}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adição de Ácido Sulfúrico (L)</label>
                  <Input
                    type="number"
                    name="sulfuricAcidAddition"
                    placeholder="0"
                    value={formData.sulfuricAcidAddition}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Resultados de Amostras</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Condutividade (µS/cm)</label>
                    <Input
                      type="number"
                      name="electroSample_conductivity"
                      placeholder="0"
                      value={formData.electroSample_conductivity}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">pH</label>
                    <Input
                      type="number"
                      name="electroSample_ph"
                      placeholder="0.0"
                      value={formData.electroSample_ph}
                      onChange={handleChange}
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ferro (ppm)</label>
                    <Input
                      type="number"
                      name="electroSample_iron"
                      placeholder="0"
                      value={formData.electroSample_iron}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <Textarea
                  name="electroObservations"
                  placeholder="Observações sobre a decapagem eletrolítica"
                  value={formData.electroObservations}
                  onChange={handleChange}
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="px-6">
          {isSubmitting ? "Enviando..." : "Enviar Registro de Turno"}
        </Button>
      </div>
    </form>
  );
};

export default ShiftForm;
