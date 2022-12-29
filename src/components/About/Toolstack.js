import React from "react";
import {HStack, VStack} from "@chakra-ui/react";

import {
  SiLinux,
  SiVisualstudiocode,
  SiMacos,
  SiAnaconda,
  SiJupyter,
  SiNpm,
} from "react-icons/si";

function Toolstack() {
  return (
    <HStack style={{ justifyContent: "center", paddingBottom: "10%", width:"85%", display:"flex", flexWrap:"wrap"}}>
      <VStack className={"tech-stack-flex"}>
        <SiLinux className="tech-icons"/>
        <p>Linux</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <SiMacos className="tech-icons"/>
        <p>MacOS</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <SiVisualstudiocode className="tech-icons"/>
        <p>VS Code</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <SiAnaconda className="tech-icons"/>
        <p>Anaconda</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <SiJupyter className="tech-icons" />
        <p>Jupyter</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <SiNpm className="tech-icons"/>
        <p>NPM</p>
      </VStack>
      {/* <Col xs={4} md={2} className="tech-icons">
        <SiLinux />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVisualstudiocode />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiPostman />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVercel />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiHeroku />
      </Col> */}
    </HStack>
  );
}

export default Toolstack;
