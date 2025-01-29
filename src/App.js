import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSection from "./components/ProjectsSection";
// import ContactMeSection from "./components/ContactMeSection";
import Footer from "./components/Footer";
import { AlertProvider } from "./context/alertContext";
import Alert from "./components/Alert";
import About from "./components/About/About";
import "./css/style.css";
import "./App.css";
import Preloader from "./components/Pre";
import {useEffect , useState} from "react";
import { PrimeReactProvider } from 'primereact/api';
import Career from "./components/Career";

// Import PrimeReact styles - order is important
import "primereact/resources/themes/lara-dark-indigo/theme.css";  // base theme
import "primereact/resources/primereact.min.css";                 
import "primeicons/primeicons.css";                              

function App() {

  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PrimeReactProvider>
      <Preloader load={load} />
      <ChakraProvider>
      <AlertProvider>
        <main>
          <Header />
          <LandingSection />
          <About/>
          <ProjectsSection />
          {/* <ContactMeSection /> */}
          <Footer />
          <Alert />
        </main>
      </AlertProvider>
    </ChakraProvider>
    </PrimeReactProvider>
  );
}

export default App;
