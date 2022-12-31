import React from "react";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../css/Assets/about.png";
import Toolstack from "./Toolstack";
import { Center, HStack, VStack } from "@chakra-ui/react";
import FullScreenSection from "../FullScreenSection";
import MediaQuery from "react-responsive";
import { AnimationOnScroll } from "react-animation-on-scroll";
import Particle from "../Particle";


function About() {
  return (
    
    <FullScreenSection
    justifyContent="center"
    alignItems="center"
    id="about-section"
  >
    <Particle />
      <MediaQuery minWidth={701}>
      
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
            <AnimationOnScroll animateIn="animate__fadeInUp" duration="2.5" animateOnce={true}>
            <h1 style={{ fontSize: "2.1em", paddingBottom: "5%" }}>
              Know Who <strong className="purple">I am!</strong>
            </h1>
            </AnimationOnScroll>
            <Aboutcard />
          </VStack>
          <VStack
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px", width:"40%"}}
            className="about-img"
          >
            <AnimationOnScroll animateIn="animate__fadeInUp" duration="2.7" animateOnce={true}>
            <img src={laptopImg} alt="about" className="img-fluid" width={"100%"} />
            </AnimationOnScroll>
          </VStack>
        </HStack>
      </MediaQuery>


      <MediaQuery maxWidth={700}>
      <VStack
        md={5}
        style={{width:"90%"}}
        className="about-img"
      >
        <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce={true}>
            <img src={laptopImg} alt="about" className="img-fluid" width={"100%"} />
        </AnimationOnScroll>
      </VStack>

        <VStack
            style={{
              justifyContent: "center",
              display:"inline-block",
              width:"85%",
            }}
          >
            <Center>
            <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce={true}>
            <h1 style={{ fontSize: "2.1em", paddingBottom: "5%"}}>
              Know Who <strong className="purple">I am!</strong>
            </h1>
            </AnimationOnScroll>
            </Center>
            <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce={true}>
              <Aboutcard/>
            </AnimationOnScroll>
          </VStack>
          <br/>
          {/* <VStack
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px", width:"90%"}}
            className="about-img"
          >
            <img src={laptopImg} alt="about" className="img-fluid" width={"100%"} />
          </VStack> */}
      </MediaQuery>


      <AnimationOnScroll animateIn="animate__fadeInUp" duration="2" animateOnce={"once"}>
        <h1 className="project-heading" style={{marginTop:"30%"}}>
          Professional <strong className="purple">Skillset </strong>
        </h1>
      </AnimationOnScroll>
        <Techstack />
        <AnimationOnScroll animateIn="animate__fadeInUp" duration="2.3" animateOnce={"once"}>
        <h1 className="project-heading">
          <strong className="purple">Tools</strong> I use
        </h1>
        </AnimationOnScroll>
        <Toolstack />

      
    </FullScreenSection>
    
  );
}

export default About;
