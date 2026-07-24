import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas públicas
import Home from "./pages/Home";
import Adopt from "./pages/Adopt";
import PetDetails from "./pages/PetDetails";
import DonatePet from "./pages/DonatePet";
import Adopted from "./pages/Adopted";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard";
import ProfileSelect from "./pages/ProfileSelect";
import DreamPet from "./pages/DreamPet";
import Transparency from "./pages/Transparency";
import Historias from "./pages/Historias";
import SmbepaResponde from "./pages/SmbepaResponde";
import FormSmbepaResponde from "./pages/FormSmbepaResponde";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import MyPets from "./pages/MyPets";
import EditProfile from "./pages/EditProfile";
import ViewEditPet from "./pages/ViewEditPet";
import RgAnimal from "./pages/RgAnimal";
import CartaoVacina from "./pages/CartaoVacina";
import RegisterPet from "./pages/RegisterPet";
import AdoptForm from "./pages/AdoptForm";
import CadastroJuridica from "./pages/CadastroJuridica";
import CadastroEstabelecimento from "./pages/CadastroEstabelecimento";
import CadastroProtetor from "./pages/CadastroProtetor";
import Castracao from "./pages/Castracao";

// Páginas admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSolicitacoes from "./pages/admin/AdminSolicitacoes";
import AdminGraficos from "./pages/admin/AdminGraficos";
import AdminPets from "./pages/admin/AdminPets";
import AdminAdocoes from "./pages/admin/AdminAdocoes";
import AdminEventos from "./pages/admin/AdminEventos";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminHistorias from "./pages/admin/AdminHistorias";
import AdminContatos from "./pages/admin/AdminContatos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminVeterinarios from "./pages/admin/AdminVeterinarios";
import AdminProtetores from "./pages/admin/AdminProtetores";
import AdminUsuarioDetalhes from "./pages/admin/AdminUsuarioDetalhes";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Routes>
        {/* ── Rotas Públicas ── */}
        <Route path="/" element={<Home />} />
        <Route path="/adotar" element={<Adopt />} />
        <Route path="/doe-um-pet" element={<DonatePet />} />
        <Route path="/adotados" element={<Adopted />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/painel" element={<ProfileSelect />} />
        <Route path="/castracao" element={<ProtectedRoute><Castracao /></ProtectedRoute>} />
        <Route path="/cadastrar-ong" element={<Navigate to="/castracao" replace />} />
        <Route path="/meus-pets" element={<MyPets />} />
        <Route path="/cadastrar-animal" element={<RegisterPet />} />
        <Route path="/editar-perfil" element={<EditProfile />} />
        <Route path="/cadastro-juridica" element={<CadastroJuridica />} />
        <Route path="/cadastro-estabelecimento" element={<CadastroEstabelecimento />} />
        <Route path="/cadastro-protetor" element={<CadastroProtetor />} />
        <Route path="/meus-pets/:id" element={<ViewEditPet />} />
        <Route path="/rg-animal/:id" element={<RgAnimal />} />
        <Route path="/cartao-vacina/:id" element={<CartaoVacina />} />
        <Route path="/meus-pets-dos-sonhos" element={<ProtectedRoute><DreamPet /></ProtectedRoute>} />
        <Route path="/transparencia" element={<Transparency />} />
        <Route path="/historias-de-recomeco" element={<Historias />} />
        <Route path="/smbepa-responde" element={<ProtectedRoute><SmbepaResponde /></ProtectedRoute>} />
        <Route path="/form-smbepa-responde" element={<ProtectedRoute><FormSmbepaResponde /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/descricao-pet/:id" element={<PetDetails />} />
        <Route path="/adocao/:id" element={<AdoptForm />} />

        {/* ── Rotas Admin ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="solicitacoes" element={<AdminSolicitacoes />} />
            <Route path="graficos" element={<AdminGraficos />} />
            <Route path="pets" element={<AdminPets />} />
            <Route path="adocoes" element={<AdminAdocoes />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="historias" element={<AdminHistorias />} />
            <Route path="contatos" element={<AdminContatos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="veterinarios" element={<AdminVeterinarios />} />
            <Route path="protetores" element={<AdminProtetores />} />
            <Route path="usuarios/:id" element={<AdminUsuarioDetalhes />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="configuracoes" element={<AdminConfiguracoes />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
