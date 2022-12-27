import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../css/Assets/about.png";
import Toolstack from "./Toolstack";
import { HStack, VStack } from "@chakra-ui/react";
import FullScreenSection from "../FullScreenSection";

function About() {
  return (
    <FullScreenSection
    justifyContent="center"
    alignItems="center"
    id="about-section"
  >
      <Particle />
        <HStack style={{ justifyContent: "center", padding: "5%", textAlign:"center" , width:"100%"}}>
          <VStack
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
              display:"inline-block",
              width:"100%"
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "5%" }}>
              Know Who <strong className="purple">I am!</strong>
            </h1>
            <Aboutcard />
          </VStack>
          <VStack
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px", width:"40%"}}
            className="about-img"
          >
            <img src={laptopImg} alt="about" className="img-fluid" width={"100%"} />
          </VStack>
          </HStack>
        <h1 className="project-heading">
          Professional <strong className="purple">Skillset </strong>
        </h1>

        <Techstack />

        <h1 className="project-heading">
          <strong className="purple">Tools</strong> I use
        </h1>
        <Toolstack />
      
    </FullScreenSection>
  );
}

export default About;
