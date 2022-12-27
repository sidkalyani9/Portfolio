import React from "react";
import {Box, Flex, HStack} from "@chakra-ui/react";
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { SiLeetcode } from "react-icons/si";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope} from "@fortawesome/free-solid-svg-icons";

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

const Footer = () => {
  return (
    <Box className="mainSection2">
      <footer>

      <Flex
          margin="0% auto"
          padding={"1rem 0 0 0"}
          px={12}
          color="white"
          justifyContent="center"
          alignItems="center"
          maxWidth="1024px"
        >
          <span className="purple"> CONNECT WITH ME HERE! </span>
        </Flex>

        <Flex
          margin="0 auto"
          px={12}
          color="white"
          justifyContent="center"
          alignItems="center"
          maxWidth="1024px"
          height={10}
        >
          <HStack className="left-nav" spacing={8}>
              <a href={socials[0].url}><FontAwesomeIcon icon={socials[0].icon} size="xl" /></a>
              <a href="https://youtube.com/@techybuffoon"><FontAwesomeIcon icon={faYoutube} size="xl" /></a>
              <a href={socials[1].url}><FontAwesomeIcon icon={socials[1].icon} size="xl" /></a>
              <a href={socials[2].url}><FontAwesomeIcon icon={socials[2].icon} size="xl" /></a>
              <a href={socials[3].url}><FontAwesomeIcon icon={socials[3].icon} size="xl" /></a>
              <a href={socials[4].url}><SiLeetcode size={"23"} /> </a>
            </HStack>
        </Flex>

        <Flex
          margin="0 auto"
          px={12}
          color="white"
          justifyContent="center"
          alignItems="center"
          maxWidth="1024px"
          height={10}
        >
          {/* <p>Siddharth Kalyani AKA TechyBuffoon • © 2022</p> */}
          <p>Siddharth K. • © 2022</p>
        </Flex>

      </footer>
    </Box>
  );
};
export default Footer;
