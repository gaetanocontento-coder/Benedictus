import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import Shop from "@/pages/shop/index";
import Configuratore from "@/pages/configuratore/index";
import Dashboard from "@/pages/dashboard";
import Insight from "@/pages/insight";
import Leads from "@/pages/leads/index";
import LeadDetail from "@/pages/leads/detail";
import NewLead from "@/pages/leads/new";
import Clienti from "@/pages/clienti/index";
import ClienteDetail from "@/pages/clienti/detail";
import Catalogo from "@/pages/catalogo/index";
import Campioni from "@/pages/campioni/index";
import Proposte from "@/pages/proposte/index";
import NewProposta from "@/pages/proposte/new";
import PropostaDetail from "@/pages/proposte/detail";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/shop" component={Shop} />
        <Route path="/configuratore" component={Configuratore} />

        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />

        <Route path="/leads" component={Leads} />
        <Route path="/leads/new" component={NewLead} />
        <Route path="/leads/:id" component={LeadDetail} />

        <Route path="/clienti" component={Clienti} />
        <Route path="/clienti/:id" component={ClienteDetail} />

        <Route path="/catalogo" component={Catalogo} />

        <Route path="/campioni" component={Campioni} />

        <Route path="/proposte" component={Proposte} />
        <Route path="/proposte/new" component={NewProposta} />
        <Route path="/proposte/:id" component={PropostaDetail} />

        <Route path="/insight" component={Insight} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
