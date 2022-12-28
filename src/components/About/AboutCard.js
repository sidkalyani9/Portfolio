import React from "react";
import Card from "react-bootstrap/Card";
import {AiFillCaretRight} from "react-icons/ai";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p className={"aboutCard"}>
            Hi Everyone, I am <span className="purple">Siddharth Kalyani </span>
            from <span className="purple"> Ahemdabad, India. </span>
            <span>I am a junior pursuing</span><span className="purple"> B.Tech</span> in<span className="purple"> Information technology</span> from Vishwakarma Government Engineering College, Chandkheda
            <br></br>
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
               <AiFillCaretRight className={"aboutHobbies"} /> Gymnasium
            </li>
            <li className="about-activity">
            <AiFillCaretRight className={"aboutHobbies"} /> Watching Formula 1
            </li>
            <li className="about-activity">
            <AiFillCaretRight className={"aboutHobbies"}/> Travelling
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
