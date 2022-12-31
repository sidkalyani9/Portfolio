import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope} from "@fortawesome/free-solid-svg-icons";
import { Center } from "@chakra-ui/react";
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
import MediaQuery from "react-responsive";
import { motion } from "framer-motion";

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
    }

    window.addEventListener('scroll', handleScroll)

  return (
      <>
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      className={classN?"sticky":"navbar"}
    >
      <Box color="white" maxWidth="1920px" margin="0 auto">
        <HStack
          px={21}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          
          <MediaQuery minWidth={830}>
          <nav>
            <HStack className="left-nav" spacing={8}>

            <motion.div
              initial={{ opacity: 0,y:"-200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ duration: 2 }}>
              <a href={socials[0].url} aria-label="Email" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={socials[0].icon} size="xl" /></a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0,y:"-200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.15 , duration: 2 }}>
              <a href="https://youtube.com/@techybuffoon" aria-label="Youtube" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={faYoutube} size="xl" /></a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0,y:"-200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.3 , duration: 2 }}>
                <a href={socials[1].url} aria-label="Git Hub" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={socials[1].icon} size="xl" /></a>
            </motion.div>
              <motion.div
              initial={{ opacity: 0,y:"-200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.45 , duration: 2 }}>
                <a href={socials[2].url} aria-label="LinkedIn" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={socials[2].icon} size="xl" /></a>
              </motion.div>

              <motion.div
              initial={{ opacity: 0,y:"-200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.6 , duration: 2 }}>
                <a href={socials[3].url} aria-label="Twitter" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={socials[3].icon} size="xl" /></a>
              </motion.div>

              <motion.div
              initial={{ opacity: 0,y:"-200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.75 , duration: 2 }}>
                <a href={socials[4].url} aria-label="Leet Code" target="_blank" rel="noreferrer" ><SiLeetcode size={"24"}/> </a>
              </motion.div>
            </HStack>
          </nav>
          <nav>
              <HStack spacing={8}>
                <motion.div
                initial={{ opacity: 0,y:"-100%"}}
                animate={{ opacity: 1, y:"0%"}}
                transition={{ delay:1.2 , duration: 2 }}>
                  <a href="/#home1" onClick={handleClick("home")} class={"navLink"}>Home</a>
                </motion.div>

                <motion.div
                initial={{ opacity: 0,y:"-100%"}}
                animate={{ opacity: 1, y:"0%"}}
                transition={{ delay:1.35 , duration: 2 }}>
                  <a href="/#about" onClick={handleClick("about")} class={"navLink"}>About Me</a>
                </motion.div>

                <motion.div
                initial={{ opacity: 0,y:"-100%"}}
                animate={{ opacity: 1, y:"0%"}}
                transition={{ delay:1.5 , duration: 2 }}>
                  <a href="/#projects" onClick={handleClick("projects")} class={"navLink"}>Projects</a>
                </motion.div>
                {/* <a href="/#contact-me" onClick={handleClick("contactme")} class={"navLink"}>Contact Me</a> */}
              </HStack>
            </nav>
            </MediaQuery>

            <MediaQuery maxWidth={830}>
            <Center w='100%'>
            <nav>
            <HStack spacing={12} className={"mobileNav"}>
              <motion.div
              initial={{ opacity: 0,y:"-100%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ duration: 2 }}
              >
                
                <a href="/#home1" onClick={handleClick("home")} class={"navLink"}>Home</a>
              </motion.div>

              <motion.div
              initial={{ opacity: 0,y:"-100%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.5 , duration: 2 }}>
                <a href="/#about" onClick={handleClick("about")} class={"navLink"}>About Me</a>
              </motion.div>

              <motion.div
              initial={{ opacity: 0,y:"-100%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:1, duration: 2 }}>
                <a href="/#projects" onClick={handleClick("projects")} class={"navLink"}>Projects</a>
              </motion.div>
              {/* <a href="/#contact-me" onClick={handleClick("contactme")} class={"navLink"}>Contact Me</a> */}
            </HStack>
          </nav>
          </Center>
          </MediaQuery>
        </HStack>
      </Box>
    </Box>
    <MediaQuery maxWidth={829}>
    <Box
    position="fixed"
    bottom={0}
    className={classN?"stickyB":"stickyB2"}
    color="white"
    width="100%"
    >
      <Center>
      <nav>
            <HStack className="left-nav" spacing={"12vw"}>
            <motion.div
              initial={{ opacity: 0,y:"200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ duration: 2 }}>
                  <a href={socials[0].url} aria-label="Email" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={socials[0].icon} size="xl"/></a>
            </motion.div>  
              
              <motion.div
              initial={{ opacity: 0,y:"200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.4 , duration: 2 }}>
                  <a href="https://youtube.com/@techybuffoon" aria-label="Youtube" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={faYoutube} size="xl" /></a>
              </motion.div>
              
              <motion.div
              initial={{ opacity: 0,y:"200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:0.8 , duration: 2 }}>
                  <a href={socials[1].url} aria-label="Github" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={socials[1].icon} size="xl" /></a>
              </motion.div>
              
              <motion.div
              initial={{ opacity: 0,y:"200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:1.2 , duration: 2 }}>
                  <a href={socials[2].url} aria-label="LinkedIn" target="_blank" rel="noreferrer" ><FontAwesomeIcon icon={socials[2].icon} size="xl" /></a>
              </motion.div>

              <motion.div
              initial={{ opacity: 0,y:"200%"}}
              animate={{ opacity: 1, y:"0%"}}
              transition={{ delay:1.6 , duration: 2 }}>
              {/* <a href={socials[3].url}><FontAwesomeIcon icon={socials[3].icon} size="lg" /></a> */}
                  <a href={socials[4].url} aria-label="Leet Code" target="_blank" rel="noreferrer" ><SiLeetcode size={"24"}/> </a>
              </motion.div>
            
            </HStack>
          </nav>
          </Center>
    </Box>
    </MediaQuery>
    </>
  );
};
export default Header;
