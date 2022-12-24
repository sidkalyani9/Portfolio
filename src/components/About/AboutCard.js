import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Siddharth Kalyani </span>
            from <span className="purple"> Ahemdabad, India.</span>
            <br />I am a junior pursuing <span className="purple">B.Tech</span> in<span className="purple"> Information technology </span>  from 
            <br />Vishwakarma Government Engineering College, Chandkheda
            <br></br>
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight style={{display:"inline-block"}}/> Gymnasium
            </li>
            <li className="about-activity">
              <ImPointRight style={{display:"inline-block"}}/> Watching Formula 1
            </li>
            <li className="about-activity">
              <ImPointRight style={{display:"inline-block"}}/> Travelling
            </li>
          </ul>

          {/* <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Siddharth K.</footer> */}
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
