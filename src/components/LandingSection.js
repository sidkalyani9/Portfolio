import React from "react";
import { Image, VStack,HStack} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import Type from "./Type";
import "animate.css";
import displayPic from '../images/displayPic.webp';
// import { AnimationOnScroll } from "react-animation-on-scroll";


const LandingSection = () => {

  return(
    
  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    id="home-section"
    
  >
    {/* {!mobView && */}
    <HStack className={"landingSection"}
    >
     {/* <Avatar name='Siddharth' src='' size="2xl" /> */}
     <Image src={displayPic} w='35%' borderRadius='full' className={"imgLand"} alt="Display Picture of Admin" h="auto" />
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

      <div className="typewrite">
        <Type />
      </div>
      </VStack>
     </HStack>
  </FullScreenSection>
  );
};

export default LandingSection;
