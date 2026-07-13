import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
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

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adotar" element={<Adopt />} />
        <Route path="/doe-um-pet" element={<DonatePet />} />
        <Route path="/adotados" element={<Adopted />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/painel" element={<ProfileSelect />} />
        <Route path="/cadastrar-ong" element={<Dashboard />} />
        <Route path="/meus-pets" element={<MyPets />} />
        <Route path="/cadastrar-animal" element={<RegisterPet />} />
        <Route path="/editar-perfil" element={<EditProfile />} />
        <Route path="/cadastro-juridica" element={<CadastroJuridica />} />
        <Route path="/cadastro-estabelecimento" element={<CadastroEstabelecimento />} />
        <Route path="/meus-pets/:id" element={<ViewEditPet />} />
        <Route path="/rg-animal/:id" element={<RgAnimal />} />
        <Route path="/cartao-vacina/:id" element={<CartaoVacina />} />
        <Route path="/meus-pets-dos-sonhos" element={<DreamPet />} />
        <Route path="/transparencia" element={<Transparency />} />
        <Route path="/historias-de-recomeco" element={<Historias />} />
        <Route path="/smbepa-responde" element={<SmbepaResponde />} />
        <Route path="/form-smbepa-responde" element={<FormSmbepaResponde />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/descricao-pet/:id" element={<PetDetails />} />
        <Route path="/adocao/:id" element={<AdoptForm />} />
      </Routes>
    </div>
  );
}
