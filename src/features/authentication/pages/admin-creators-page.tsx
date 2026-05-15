import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  createCreator,
  getCreators,
  toggleCreatorStatus,
  type Creator,
} from '@/features/authentication/services/admin';
import { Copy, UserPlus, Users } from 'lucide-react';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { toast } from 'sonner';
import { LoadingScreen } from '@/templates/loading-screen';

export function AdminCreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null,
  );

  // Toggle state
  const [creatorToToggle, setCreatorToToggle] = useState<Creator | null>(null);

  const fetchCreators = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await getCreators(currentPage, 10);
      setCreators(response.content);
      setTotalPages(response.totalPages);
    } catch {
      toast.error('Erro ao carregar os criadores de conteúdo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCreators(page);
  }, [page]);

  const handleCreateSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      toast.error('Preencha todos os campos!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createCreator({ username, email });
      setGeneratedPassword(response.generatedPassword);
      toast.success('Criador de conteúdo criado com sucesso!');
      setUsername('');
      setEmail('');
      fetchCreators(page); // Refresh list
    } catch (error: any) {

      const apiResponse = error.response?.data;
      const specificError = apiResponse?.data?.error;
      
      if (specificError && specificError.field) {
        if (specificError.field === 'email') {
          toast.error('E-mail: Um usuário com esse e-mail já existe.');
        } else if (specificError.field === 'username') {
          toast.error('Usuário: Um usuário com esse login já existe.');
        } else {
          toast.error(`Erro no campo ${specificError.field}: dados inválidos.`);
        }
      } 
      
      else {
        toast.error('Erro ao criar criador de conteúdo. Verifique os dados inseridos.');
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleConfirm = async () => {
    if (!creatorToToggle) return;

    try {
      await toggleCreatorStatus(creatorToToggle.id);
      toast.success('Status alterado com sucesso!');
      fetchCreators(page);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erro ao alterar status do criador.',
      );
    } finally {
      setCreatorToToggle(null);
    }
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast.success('Senha copiada para a área de transferência!');
    }
  };

  if (isLoading && creators.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-foreground flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Users className="text-primary size-8" />
          Gerenciar Criadores
        </h1>

        <Dialog
          open={isCreateModalOpen}
          onOpenChange={(open) => {
            setIsCreateModalOpen(open);
            if (!open) setGeneratedPassword(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="size-4" />
              Novo Criador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            {!generatedPassword ? (
              <>
                <DialogHeader>
                  <DialogTitle>Novo Criador de Conteúdo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username (Login)</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: joao.criador"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: joao@fluveny.com"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Gerando...' : 'Criar Conta'}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Conta Criada!</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-muted-foreground text-sm">
                    A conta foi criada com sucesso. Copie a senha temporária
                    abaixo e envie para o criador.
                    <strong>
                      {' '}
                      Ele precisará redefini-la no primeiro acesso.
                    </strong>
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={generatedPassword}
                      className="font-mono text-lg font-bold"
                    />
                    <Button type="button" size="icon" onClick={copyToClipboard}>
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setGeneratedPassword(null);
                      setIsCreateModalOpen(false);
                    }}
                  >
                    Fechar
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card overflow-hidden rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome / Login</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Módulos</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum criador de conteúdo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              creators.map((creator) => (
                <TableRow key={creator.id}>
                  <TableCell className="font-medium">
                    {creator.name || creator.username}
                    {!creator.name && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        (Sem nome)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{creator.email}</TableCell>
                  <TableCell>{creator.modulesCount || 0}</TableCell>
                  <TableCell>
                    {creator.lastLoginAt
                      ? new Date(creator.lastLoginAt).toLocaleDateString(
                          'pt-BR',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )
                      : 'Nunca acessou'}
                  </TableCell>
                  <TableCell>
                    {creator.isActive ? (
                      <Badge
                        variant="default"
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={creator.isActive ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => setCreatorToToggle(creator)}
                    >
                      {creator.isActive ? 'Desativar' : 'Ativar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 0) setPage(page - 1);
                }}
                className={page === 0 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm">
                Página {page + 1} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages - 1) setPage(page + 1);
                }}
                className={
                  page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog
        open={!!creatorToToggle}
        onOpenChange={(open) => !open && setCreatorToToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {creatorToToggle?.isActive ? 'Desativar' : 'Ativar'} Criador
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja{' '}
              {creatorToToggle?.isActive ? 'desativar' : 'ativar'} a conta de{' '}
              <strong>
                {creatorToToggle?.name || creatorToToggle?.username}
              </strong>
              ?
              {creatorToToggle?.isActive &&
                ' Ele perderá o acesso à plataforma imediatamente.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleConfirm}
              className={
                creatorToToggle?.isActive
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
