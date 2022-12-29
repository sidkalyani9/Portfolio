import React from "react";
import Card from "react-bootstrap/Card";
import {AiFillCaretRight} from "react-icons/ai";
import { AnimationOnScroll } from "react-animation-on-scroll";

function AboutCard() {
  return (
    
    <Card className="quote-card-view">
      <Card.Body>
          <p className={"aboutCard"}>
          <AnimationOnScroll animateIn="animate__fadeInUp" duration="2" animateOnce={true}>
            Hi Everyone, I am <span className="purple">Siddharth Kalyani </span>
            from <span className="purple"> Ahemdabad, India. </span>
            <span>I am a junior pursuing</span><span className="purple"> B.Tech</span> in<span className="purple"> Information technology</span> from Vishwakarma Government Engineering College, Chandkheda
            <br></br>
            <br />
            </AnimationOnScroll>
            <AnimationOnScroll animateIn="animate__fadeInUp" duration="2" animateOnce={true}>
              Apart from coding, some other activities that I love to do!
            </AnimationOnScroll>
          </p>
          <ul>
          <AnimationOnScroll animateIn="animate__fadeInUp" duration="1" delay="500" animateOnce={true}>
          {/* <AnimationOnScroll animateIn="animate__fadeInRight" duration="3" delay="1400" animateOnce={true}> */}
          {/* <AnimationOnScroll animateIn="animate__fadeInUp" duration="3" delay="1400" animateOnce={true}> */}
            <li className="about-activity">
               <AiFillCaretRight className={"aboutHobbies"} /> Making Youtube Content
            </li>
          </AnimationOnScroll>

            <AnimationOnScroll animateIn="animate__fadeInUp"  duration="1" delay="900" animateOnce={true}>
            <li className="about-activity">
            <AiFillCaretRight className={"aboutHobbies"} /> Gymnasium
            </li>
            </AnimationOnScroll>

            <AnimationOnScroll animateIn="animate__fadeInUp" duration="1" delay="1300" animateOnce={true}>
            <li className="about-activity">
            <AiFillCaretRight className={"aboutHobbies"}/> Watching Formula 1
            </li>
            </AnimationOnScroll>

            <AnimationOnScroll animateIn="animate__fadeInUp" duration="1" delay="1700" animateOnce={true}>
            <li className="about-activity">
            <AiFillCaretRight className={"aboutHobbies"}/> Travelling
            </li>
            </AnimationOnScroll>
          </ul>

          {/* <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Siddharth K.</footer> */}
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
