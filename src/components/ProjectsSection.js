import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
import Card from "./Card";
import {useState,useEffect} from "react";

const projects = [
  {
    title: "Lucky Shrub",
    description:
      "This is an E-Commerce website made for a hypothetical Plant Nursery. HTML, CSS, Bootstrap, JQuery and JavaScript is used for Front-end and PHP is used for the Back-end",
    getImageSrc: () => require("../images/project1.png"),
    ghLink: "https://github.com/sidkalyani9/Lucky-Shrub",
  },
  {
    title: "React Portfolio",
    description:
      "My First Big React Project where I made my own Portfolio with inforamtion like My Own Bio, My Tech Skillset, Tools that I use, My Featured Projects. Also used Node.js and MongoDb for Contact Me Section.",
    getImageSrc: () => require("../images/project2.png"),
    ghLink: "https://github.com/sidkalyani9/Portfolio",
  },
  {
    title: "Malaria Detection System",
    description:
      "This system is used to find if the blood sample is Parasitized or not, if parasitized, then it outputs the type of Malaria Disese. I used various Machine Learning Artificial Intelligence Models out of which Random Forst Classifier gave the Best Result (96%) ",
    getImageSrc: () => require("../images/Project3.png"),
    ghLink: "https://github.com/sidkalyani9/Meta-portfolio-project1",
  },
  {
    title: "Meta Calculator",
    description:
      "This was a part of Meta's React Course's Submission. I have used many Fundamental hooks like useRef, useState, ContextAPI etc.",
    getImageSrc: () => require("../images/project4.png"),
    ghLink: "https://github.com/sidkalyani9/Meta-Calculator-App",
  },
];

const ProjectsSection = () => {

  // var loadWidth = useWindow();
  var initialVal = "repeat(2,minmax(0,1fr))";

  // console.log(loadWidth);
  
  // if(loadWidth < 600 && loadWidth > 0){
  //   initialVal = "repeat(1,minmax(0,1fr))";
  // }
  // else{
  //   initialVal = "repeat(2,minmax(0,1fr))";
  // }

  const[showSingleProj,setShowSingleProj] = useState(initialVal);
  
  useEffect(() => {
    const handleWindowSize = () => {
      if(window.innerWidth < 600){
        setShowSingleProj("repeat(1,minmax(0,1fr))");
      }
      else{
        setShowSingleProj("repeat(2,minmax(0,1fr))");
      }
    }
    
    window.addEventListener("resize", handleWindowSize);

    return () => window.removeEventListener("resize", handleWindowSize);
  }, []);
  

  useEffect(() => {
    const handleWindowSize = () => {
      if(window.innerWidth < 600){
        setShowSingleProj("repeat(1,minmax(0,1fr))");
      }
      else{
        setShowSingleProj("repeat(2,minmax(0,1fr))");
      }
    }
    
    window.addEventListener("load", handleWindowSize);

    // Return a function from the effect that removes the event listener
    return () => window.removeEventListener("load", handleWindowSize);
  }, []);

  return (
    <FullScreenSection
      p={8}
      alignItems="flex-start"
      spacing={8}
      id="projects-section"
    >
      <Heading as="h1" >
        Featured Projects
      </Heading>
      <Box
        display="grid"
        gridTemplateColumns={showSingleProj}
        gridGap={8}
        
      >
        {projects.map((project) => (
          <Card
            key={project.title}
            title={project.title}
            description={project.description}
            imageSrc={project.getImageSrc()}
            ghLink={project.ghLink}
          />
        ))}
      </Box>
    </FullScreenSection>
  );
};

export default ProjectsSection;
