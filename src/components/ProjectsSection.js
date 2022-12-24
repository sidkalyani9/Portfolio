import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
import Card from "./Card";

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
    title: "Event planner",
    description:
      "A mobile application for leisure seekers to discover unique events and activities in their city with a few taps",
    getImageSrc: () => require("../images/photo4.jpg"),
    ghLink: "https://github.com/sidkalyani9/Meta-portfolio-project1",
  },
];

const ProjectsSection = () => {
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
        gridTemplateColumns="repeat(2,minmax(0,1fr))"
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
