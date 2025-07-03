
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tv, User, Lock, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IPTVCredentials {
  username: string;
  password: string;
  server: string;
  port: string;
}

interface IPTVLoginProps {
  onLogin: (credentials: IPTVCredentials) => void;
  onSkip: () => void;
}

export const IPTVLogin = ({ onLogin, onSkip }: IPTVLoginProps) => {
  const [credentials, setCredentials] = useState<IPTVCredentials>({
    username: "",
    password: "",
    server: "",
    port: "8080"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password || !credentials.server) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha usuário, senha e servidor",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular validação das credenciais
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Conectado ao servidor IPTV"
      });
      
      onLogin(credentials);
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Tv className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Login IPTV</CardTitle>
          <p className="text-muted-foreground">
            Entre com suas credenciais IPTV
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Usuário</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Seu usuário IPTV"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Senha</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="server" className="flex items-center space-x-2">
                <Server className="w-4 h-4" />
                <span>Servidor</span>
              </Label>
              <Input
                id="server"
                type="text"
                placeholder="exemplo.com ou IP"
                value={credentials.server}
                onChange={(e) => setCredentials({...credentials, server: e.target.value})}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Porta</Label>
              <Input
                id="port"
                type="text"
                placeholder="8080"
                value={credentials.port}
                onChange={(e) => setCredentials({...credentials, port: e.target.value})}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Conectando..." : "Conectar"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={onSkip}
              >
                Pular (usar M3U)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
