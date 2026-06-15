import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/lib/auth";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import ChiSiamo from "@/pages/chi-siamo";
import LaChiamata from "@/pages/la-chiamata";
import LaRegula from "@/pages/la-regula";
import IlManifesto from "@/pages/il-manifesto";
import LectioIndex from "@/pages/lectio/index";
import LectioDetail from "@/pages/lectio/detail";
import Percorso from "@/pages/percorso";
import Piani from "@/pages/piani";
import Abbas from "@/pages/abbas";
import Officina from "@/pages/officina";
import Testimonianze from "@/pages/testimonianze";
import Contatti from "@/pages/contatti";
import Login from "@/pages/login";
import Registrazione from "@/pages/registrazione";
import AdminDashboard from "@/pages/admin/index";
import CheckoutSuccess from "@/pages/checkout/success";
import CheckoutCancel from "@/pages/checkout/cancel";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chi-siamo" component={ChiSiamo} />
        <Route path="/la-chiamata" component={LaChiamata} />
        <Route path="/la-regula" component={LaRegula} />
        <Route path="/il-manifesto" component={IlManifesto} />
        <Route path="/lectio" component={LectioIndex} />
        <Route path="/lectio/:id" component={LectioDetail} />
        <Route path="/percorso" component={Percorso} />
        <Route path="/piani" component={Piani} />
        <Route path="/abbas" component={Abbas} />
        <Route path="/officina" component={Officina} />
        <Route path="/testimonianze" component={Testimonianze} />
        <Route path="/contatti" component={Contatti} />
        <Route path="/login" component={Login} />
        <Route path="/registrazione" component={Registrazione} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/checkout/success" component={CheckoutSuccess} />
        <Route path="/checkout/cancel" component={CheckoutCancel} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
