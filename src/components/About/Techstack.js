import React from "react";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiJava,
  DiBootstrap,
} from "react-icons/di";
import {
  SiNextdotjs,
} from "react-icons/si";
import {HStack, VStack} from "@chakra-ui/react";


function Techstack() {
  return (
    <HStack style={{ justifyContent: "center", paddingBottom: "50px", width:"100%", display:"flex", flexWrap:"wrap"}}>
      
      <VStack className={"tech-stack-flex"}>
        <DiJavascript1 className="tech-icons"/>
        <p>JavaScript</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <DiNodejs className="tech-icons"/>
        <p>Node.js</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <DiReact className="tech-icons"/>
        <p>React.js</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <DiMongodb className="tech-icons"/>
        <p>MongoDb</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <SiNextdotjs className="tech-icons"/>
        <p>Next.js</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <DiJava className="tech-icons"/>
        <p>Java</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <CgCPlusPlus className="tech-icons"/>
        <p>C/C++</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <DiPython className="tech-icons"/>
        <p>Python</p>
      </VStack>
      <VStack className={"tech-stack-flex"}>
        <DiGit className="tech-icons"/>
        <p>Git</p>
      </VStack>
      {/* <VStack>
        <DiBootstrap className="tech-icons" />
        <p>Bootstrap</p>
      </VStack> */}
      {/* <Col xs={4} md={2} className="tech-icons">
        <CgCPlusPlus />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiJavascript1 />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiNodejs />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiReact />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiMongodb />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiNextdotjs />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiGit />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiFirebase />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiPython />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiPytorch />
      </Col> */}
    </HStack>
  );
}

export default Techstack;
