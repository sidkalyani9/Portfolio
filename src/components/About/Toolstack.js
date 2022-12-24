import React from "react";
import {HStack} from "@chakra-ui/react";

import {
  SiLinux,
  SiVisualstudiocode,
  SiMacos,
  SiAnaconda,
  SiNpm,
} from "react-icons/si";

function Toolstack() {
  return (
    <HStack style={{ justifyContent: "center", paddingBottom: "10%" }}>
      <SiLinux className="tech-icons"/>
      <SiMacos className="tech-icons"/>
      <SiVisualstudiocode className="tech-icons"/>
      <SiAnaconda className="tech-icons"/>
      <SiNpm className="tech-icons"/>
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
