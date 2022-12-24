import React from "react";
import { Col, Row } from "react-bootstrap";
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
  SiPytorch,
  SiFirebase,
  SiNextdotjs,
} from "react-icons/si";
import {HStack, VStack} from "@chakra-ui/react";


function Techstack() {
  return (
    <HStack style={{ justifyContent: "center", paddingBottom: "50px" }}>
      
      <VStack >
        <DiJavascript1 className="tech-icons"/>
        <p>JavaScript</p>
      </VStack>
      <VStack>
        <DiNodejs className="tech-icons"/>
        <p>Node.js</p>
      </VStack>
      <VStack>
        <DiReact className="tech-icons"/>
        <p>React.js</p>
      </VStack>
      <VStack>
        <DiMongodb className="tech-icons"/>
        <p>MongoDb</p>
      </VStack>
      <VStack>
        <SiNextdotjs className="tech-icons"/>
        <p>Next.js</p>
      </VStack>
      <VStack>
        <DiJava className="tech-icons"/>
        <p>Java</p>
      </VStack>
      <VStack>
        <CgCPlusPlus className="tech-icons"/>
        <p>C/C++</p>
      </VStack>
      <VStack>
        <DiPython className="tech-icons"/>
        <p>Python</p>
      </VStack>
      <VStack>
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
