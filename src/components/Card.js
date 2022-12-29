import { Heading, Image, Text, VStack,HStack } from "@chakra-ui/react";
import React from "react";
import { AnimationOnScroll } from "react-animation-on-scroll";
import '../css/card.css';
import Button from "react-bootstrap/Button";
import { BsGithub } from "react-icons/bs";

const CardB = ({ title, description, imageSrc,ghLink }) => {
  // Implement the UI for the Card component according to the instructions.
  // You should be able to implement the component with the elements imported above.
  // Feel free to import other UI components from Chakra UI if you wish to.
    return(
      
      <AnimationOnScroll animateIn="animate__fadeIn" duration="2" animateOnce={true}>
        <VStack
          maxWidth="1200px"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          className="project-card-view"
          color="white"
          borderRadius="4%"
          marginBottom="10%"
          >
          <Image borderTopRadius="4%" className="banner" src={imageSrc} alt="Project screenshot banner image"></Image>
          <Heading pl={5} size="md" className="purple">{title}</Heading>
          <Text pl={3} size="1xs">{description}</Text>
          <Button className="ghBtn" variant="primary" href={ghLink} target="_blank">
            <HStack
            maxWidth="200px"
            height="10"
            alignItems="center"
            fontSize="1em"
            className={"centerGh"}
            >
                <BsGithub /> <p>Github</p>
            </HStack>
            
          </Button>
        </VStack>
        </AnimationOnScroll>
     

    );

};

export default CardB;
