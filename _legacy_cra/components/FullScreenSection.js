import * as React from "react";
import { VStack } from "@chakra-ui/react";
import '../css/style.css';


/**
 * Illustrates the use of children prop and spread operator
 */



const FullScreenSection = ({ children, isDarkBackground, ...boxProps }) => {
  return (
    
    <VStack
    // Change here
      // backgroundImage={homeBg}
      color={"white"}
      className={boxProps.id==="home-section"?"mainSection":"mainSection2"}
    >
      <VStack 
        backgroundBlendMode="color-burn"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        maxWidth="1280px" minHeight="100vh" {...boxProps}>
          {children}
      </VStack>
    </VStack>
  );
};

export default FullScreenSection;
