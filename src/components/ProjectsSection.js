import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading } from "@chakra-ui/react";
import Card from "./Card";
import { AnimationOnScroll } from "react-animation-on-scroll";

const projects = [
  {
    title: "Health Sync",
    description:
      "HealthSync is a diet tracking Webapp that contains functionalities like Diet Tracking, Verified Diets, Calorie tracking with history, determining target calorie, BMI tracking etc.",
    getImageSrc: () => require("../images/healthsync.webp"),
    ghLink: "https://github.com/sidkalyani9/HealthSync",
  },
  {
    title: "React Portfolio",
    description:
      "My First Big React Project where I made my own Portfolio with inforamtion like My Own Bio, My Tech Skillset, Tools that I use, My Featured Projects. Also used Node.js and MongoDb for Contact Me Section.",
    getImageSrc: () => require("../images/project2.webp"),
    ghLink: "https://github.com/sidkalyani9/Portfolio",
  },
  {
    title: "MealDash",
    description:
      "MealDash is a food delivery mobile app developed using React Native technology. The app includes fully developed front-end features such as a home page, featured section, cartmanagement through Redux, menu section, a delivery map with pin functionality, and more.",
    getImageSrc: () => require("../images/mealdash.webp"),
    ghLink: "https://github.com/sidkalyani9/MealDash",
  },
  {
    title: "Lucky Shrub",
    description:
      "This is an E-Commerce website made for a hypothetical Plant Nursery. HTML, CSS, Bootstrap, JQuery and JavaScript is used for Front-end and PHP is used for the Back-end",
    getImageSrc: () => require("../images/project1.webp"),
    ghLink: "https://github.com/sidkalyani9/Lucky-Shrub",
  },
];

const ProjectsSection = () => {

  return (
    <FullScreenSection
      p={8}
      alignItems="center"
      spacing={8}
      id="projects-section"
    >

      <AnimationOnScroll animateIn="animate__fadeInUp" duration="2.5" animateOnce={true}>
      <Heading as="h1">
        <span className="purple">Featured</span> Projects
      </Heading>
      </AnimationOnScroll>
      <Box
        className="projectBox"
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
