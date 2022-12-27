import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { SiLeetcode } from "react-icons/si";
import { Box, HStack } from "@chakra-ui/react";
import '../css/header.css';
import '../css/style.css';

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: sidkalyani9@gmail.com",
  },
  {
    icon: faGithub,
    url: "https://github.com/sidkalyani9",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/siddharth-kalyani/",
  },
  {
    icon: faTwitter,
    url: "https://twitter.com/techybuffoon",
  },
  {
    icon: SiLeetcode,
    url: "https://leetcode.com/sidkalyani9/",
  },
];

const Header = () => {

  // const[isHidden,setHidden] = useState(false);
  // const[translateVal,setTranslateVal] = useState("translateY(0px)");
  // const[scrollVal,setScrollVal] = useState(0);
  // const [expand, updateExpanded] = useState(false);
  const[classN,setClass] = useState(false);
  const[showLink,setShowLink] = useState(true);

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

  useEffect(() => {
    const handleWindowSize = () => {
      if(window.innerWidth > 829){
        setShowLink(true);
      }
      else{
        setShowLink(false);
      }
    }
    
    window.addEventListener("resize", handleWindowSize);
    return () => window.removeEventListener("resize", handleWindowSize);
  }, []);

  useEffect(() => {
    const handleWindowSize = () => {
      if(window.innerWidth > 829){
        setShowLink(true);
      }
      else{
        setShowLink(false);
      }
    }
    
    window.addEventListener("load", handleWindowSize);
    return () => window.removeEventListener("load", handleWindowSize);
  }, []);

    const handleScroll = () => {
    

      if(window.scrollY<30){
        setClass(false)
      }
      else{
        setClass(true);
      }
  
      // setScrollVal(window.scrollY);
  
      // if(isHidden){

      //   setTranslateVal("translateY(-200px)");
      // }
      // else{
      //   setTranslateVal("translateY(0px)");
      // }
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
          px={showLink?21:0}
          py={showLink?4:0}
          justifyContent="space-between"
          alignItems="center"
        >
          {showLink && <><nav>
            <HStack className="left-nav" spacing={8}>
              <a href={socials[0].url}><FontAwesomeIcon icon={socials[0].icon} size="1x" /></a>
              <a href="https://youtube.com/@techybuffoon"><FontAwesomeIcon icon={faYoutube} size="1x" /></a>
              <a href={socials[1].url}><FontAwesomeIcon icon={socials[1].icon} size="1x" /></a>
              <a href={socials[2].url}><FontAwesomeIcon icon={socials[2].icon} size="1x" /></a>
              <a href={socials[3].url}><FontAwesomeIcon icon={socials[3].icon} size="1x" /></a>
              <a href={socials[4].url}><SiLeetcode /> </a>
            </HStack>
          </nav><nav>
              <HStack spacing={8}>
                <a href="/#home1" onClick={handleClick("home")} class={"navLink"}>Home</a>
                <a href="/#about" onClick={handleClick("about")} class={"navLink"}>About Me</a>
                <a href="/#projects" onClick={handleClick("projects")} class={"navLink"}>Projects</a>
                <a href="/#contact-me" onClick={handleClick("contactme")} class={"navLink"}>Contact Me</a>
              </HStack>
            </nav></>}

            {!showLink && 
            <nav>
            <HStack spacing={5} className={"mobileNav"}>
              <a href="/#home1" onClick={handleClick("home")} class={"navLink"}>Home</a>
              <a href="/#about" onClick={handleClick("about")} class={"navLink"}>About Me</a>
              <a href="/#projects" onClick={handleClick("projects")} class={"navLink"}>Projects</a>
              <a href="/#contact-me" onClick={handleClick("contactme")} class={"navLink"}>Contact Me</a>
            </HStack>
          </nav>}
        </HStack>
      </Box>
    </Box>
  );
};
export default Header;
