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
import ModuloDetail from "@/pages/percorso/modulo";
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
import Scriptorium from "@/pages/scriptorium";
import PasswordDimenticata from "@/pages/password-dimenticata";
import ReimpostaPassword from "@/pages/reimposta-password";
import OblatoDashboard from "@/pages/oblato";
import OfficiumPage from "@/pages/officium";
import CapitoloPage from "@/pages/capitolo";
import EsamePage from "@/pages/esame";
import LibroCuorePage from "@/pages/libro-cuore";
import LiturgiaIndex from "@/pages/liturgia/index";
import PraticaSpirituale from "@/pages/liturgia/pratica";
import VideoPage from "@/pages/video";
import HabitareSecum from "@/pages/habitare-secum";
import MensaPage from "@/pages/mensa";
import PadreBenedetto from "@/pages/padre-benedetto";
import RegulaOperis from "@/pages/regula-operis";
import RegulaOperisModulo from "@/pages/regula-operis/modulo";

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
        <Route path="/percorso/:id" component={ModuloDetail} />
        <Route path="/piani" component={Piani} />
        <Route path="/abbas" component={Abbas} />
        <Route path="/officina" component={Officina} />
        <Route path="/testimonianze" component={Testimonianze} />
        <Route path="/contatti" component={Contatti} />
        <Route path="/login" component={Login} />
        <Route path="/registrazione" component={Registrazione} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/scriptorium" component={Scriptorium} />
        <Route path="/password-dimenticata" component={PasswordDimenticata} />
        <Route path="/reimposta-password" component={ReimpostaPassword} />
        <Route path="/checkout/success" component={CheckoutSuccess} />
        <Route path="/checkout/cancel" component={CheckoutCancel} />
        <Route path="/oblato" component={OblatoDashboard} />
        <Route path="/officium" component={OfficiumPage} />
        <Route path="/capitolo" component={CapitoloPage} />
        <Route path="/esame" component={EsamePage} />
        <Route path="/libro-cuore" component={LibroCuorePage} />
        <Route path="/liturgia" component={LiturgiaIndex} />
        <Route path="/liturgia/pratica" component={PraticaSpirituale} />
        <Route path="/video" component={VideoPage} />
        <Route path="/habitare-secum" component={HabitareSecum} />
        <Route path="/refettorio" component={MensaPage} />
        <Route path="/padre-benedetto" component={PadreBenedetto} />
        <Route path="/regula-operis" component={RegulaOperis} />
        <Route path="/regula-operis/:id" component={RegulaOperisModulo} />
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
