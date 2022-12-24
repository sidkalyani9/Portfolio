import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Image,Avatar, Heading, VStack,HStack, Center } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import Particle from "./Particle";
import Type from "./Type";
import homeLogo from "../css/Assets/home-main.svg";

const LandingSection = () => (
  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    id="home-section"
  >
    <Particle />
    <HStack style={{marginLeft:"10%"}}
    >
     {/* <Avatar name='Siddharth' src='' size="2xl" /> */}
     <Image src='https://media-exp1.licdn.com/dms/image/D4D03AQGx2G3efiS3qQ/profile-displayphoto-shrink_800_800/0/1664881316202?e=1675900800&v=beta&t=igThhgxKtg57FySsN-NMIbKk5PUgbg7y8o1f1_WLSs0' w='35%' borderRadius='full'/>
     {/* <Heading size="1xs">{greeting}</Heading> */}
     <VStack className="right-heading">
     <h1 className="heading">
        Hi There!{" "}
        <span className="wave" role="img" aria-labelledby="wave">
          👋🏻
        </span>
      </h1>

      <h1 className="heading-name">
        I am  
        <strong className="main-name">    Siddharth Kalyani</strong>
      </h1>

      <div style={{fontSize:'1em',marginLeft: '6%'}}>
        <Type />
      </div>
      </VStack>
     </HStack>
  </FullScreenSection>

  // Changes here
  // <section>
  // <Container fluid className="home-section" id="home">
  //       <Particle />
  //       <Container className="home-content">
  //         <Row>
  //           <Col md={7} className="home-header">
  //             <h1 style={{ paddingBottom: 15 }} className="heading">
  //               Hi There!{" "}
  //               <span className="wave" role="img" aria-labelledby="wave">
  //                 👋🏻
  //               </span>
  //             </h1>

  //             <h1 className="heading-name">
  //               I am
  //               <strong className="main-name"> Siddharth Kalyani</strong>
  //             </h1>

  //             <div style={{ padding: 50, textAlign: "left" }}>
  //               <Type />
  //             </div>
  //           </Col>

  //           <Col md={5} className={"dp"}>
  //             {/* <img
  //               src={homeLogo}
  //               alt="home pic"
  //               className="img-fluid"
  //               style={{ maxHeight: "450px" }}
  //             /> */}
  //             <Image src='https://media-exp1.licdn.com/dms/image/D4D03AQGx2G3efiS3qQ/profile-displayphoto-shrink_800_800/0/1664881316202?e=1675900800&v=beta&t=igThhgxKtg57FySsN-NMIbKk5PUgbg7y8o1f1_WLSs0' 
  //               w='45%' 
  //               borderRadius='full'
  //               alt="home pic"
  //               className="img-fluid"
                
  //               />
  //           </Col>
  //         </Row>
  //       </Container>
  //     </Container>
  //   </section>

);

export default LandingSection;
