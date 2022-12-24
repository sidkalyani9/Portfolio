import React from "react";
import {Box, Flex} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box className="mainSection2">
      <footer>
        <Flex
          margin="0 auto"
          px={12}
          color="white"
          justifyContent="center"
          alignItems="center"
          maxWidth="1024px"
          height={16}
        >
          {/* <p>Siddharth Kalyani AKA TechyBuffoon • © 2022</p> */}
          <p>Siddharth K. • © 2022</p>
        </Flex>
      </footer>
    </Box>
  );
};
export default Footer;
