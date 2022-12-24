import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faMedium,
  faStackOverflow,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack } from "@chakra-ui/react";
import '../css/header.css';
import '../css/style.css';

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: hello@example.com",
  },
  {
    icon: faGithub,
    url: "https://github.com",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com",
  },
  {
    icon: faMedium,
    url: "https://medium.com",
  },
  {
    icon: faStackOverflow,
    url: "https://stackoverflow.com",
  },
];

const Header = () => {

  const[isHidden,setHidden] = useState(false);
  const[translateVal,setTranslateVal] = useState("translateY(0px)");
  const[scrollVal,setScrollVal] = useState(0);

  const[classN,setClass] = useState(false);

  const handleClick = (anchor) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

    const handleScroll = () => {
    

      if(window.scrollY<30){
        setClass(false)
      }
      else{
        setClass(true);
      }
  
      setScrollVal(window.scrollY);
  
      if(isHidden){

        setTranslateVal("translateY(-200px)");
      }
      else{
        setTranslateVal("translateY(0px)");
      }
    }
  
    window.addEventListener('scroll', handleScroll)
  
    

    // return () => window.removeEventListener('scroll', handleScroll)

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      className={classN?"sticky":"navbar"}
    >
      <Box color="white" maxWidth="1920px" margin="0 auto">
        <HStack
          px={20}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <nav>
            {/* Add social media links based on the `socials` data */}
            <HStack className="left-nav" spacing={8}>
            <a href="https://youtube.com/@techybuffoon"><FontAwesomeIcon icon={faYoutube} size="1x" /></a>
            {/* <a href={socials[0].url}><FontAwesomeIcon icon={socials[0].icon} size="1x" /></a> */}
            <a href={socials[1].url}><FontAwesomeIcon icon={socials[1].icon} size="1x" /></a>
            <a href={socials[2].url}><FontAwesomeIcon icon={socials[2].icon} size="1x" /></a>
            <a href={socials[3].url}><FontAwesomeIcon icon={socials[3].icon} size="1x" /></a>
            <a href={socials[4].url}><FontAwesomeIcon icon={socials[4].icon} size="1x" /></a>
            </HStack>
          </nav>
          <nav>
            <HStack spacing={8}>
              {/* Add links to Projects and Contact me section */}
              <a href="/#home1" onClick={handleClick("home")}>Home</a>
              <a href="/#about" onClick={handleClick("about")}>About Me</a>
              <a href="/#projects" onClick={handleClick("projects")}>Projects</a>
              <a href="/#contact-me" onClick={handleClick("contactme")}>Contact Me</a>
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
};
export default Header;
