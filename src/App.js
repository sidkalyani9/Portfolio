import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import Footer from "./components/Footer";
import { AlertProvider } from "./context/alertContext";
import Alert from "./components/Alert";
import Particle from "./components/Particle";
import About from "./components/About/About";
import NavBar from "./components/Navbar";
import "./css/style.css";
import { useEffect, useState, useContext} from "react";

function App() {


  return (
      <ChakraProvider>
      <AlertProvider>
        <main>
          <Header />
          <LandingSection />
          <About/>
          <ProjectsSection />
          <ContactMeSection />
          <Footer />
          <Alert />
        </main>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
