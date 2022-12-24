import { Heading, Image, Text, VStack,HStack } from "@chakra-ui/react";
import React from "react";
import '../css/card.css';
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

const Card = ({ title, description, imageSrc,ghLink }) => {
  // Implement the UI for the Card component according to the instructions.
  // You should be able to implement the component with the elements imported above.
  // Feel free to import other UI components from Chakra UI if you wish to.
    return(
      
      
        <VStack
          maxWidth="1200px"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          className="project-card-view"
          color="white"
          borderRadius="4%"
          >
          <Image borderTopRadius="4%" className="banner" src={imageSrc}></Image>
          <Heading pl={5} size="1x">{title}</Heading>
          <Text pl={3} size="1xs">{description}</Text>
          <Button style={{width:"20%", alignItems:"center", borderRadius:"5px", marginBottom:"3%", marginTop:"2%"}} variant="primary" href={ghLink} target="_blank">
          <HStack
          maxWidth="200px"
          height="10"
          alignItems="center"
          fontSize="1vw"
          >
          <BsGithub style={{marginLeft:"15%"}}/> <p>Github</p>
          </HStack>
        </Button>
          
        </VStack>
     

    );

};

export default Card;
