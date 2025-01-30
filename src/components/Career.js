import React, { useEffect, useState } from 'react'; 
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Heading, Img, VStack } from '@chakra-ui/react';
import vgecLogo from '../images/vgeclogo.png';
import argusoftLogo from '../images/argusoftLogo.png';

export default function Career() {
    const [timelineAlign, setTimelineAlign] = useState('alternate');
    const [expandedCards, setExpandedCards] = useState({});

    const toggleExpand = (index) => {
        setExpandedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const events = [
        { 
            status: 'B.tech in Information Technology', 
            date: '2021-2024', 
            image: vgecLogo ,
            description: 'At V.G. Engineering College, I earned my B.Tech in Information Technology, mastering core computer science principles and practical skills. I excelled academically with a 9.11 CGPA, completed impactful projects, and gained hands-on experience through internship.'
        },
        { 
            status: 'Summer Intern', 
            date: 'May 2023 - Jul 2023', 
            image: argusoftLogo,
            description: 'As a summer intern at Argusoft, I developed a full-stack Health Sync project using Angular, Node.js, Chart.js, and PrimeNG. I implemented Google login, BMI-based calorie calculation, and stored user food history, visualizing data with charts.'
        },
        { 
            status: 'Programmer Analyst Intern', 
            date: 'Jan 2024 - Jun 2024', 
            image: argusoftLogo,
            description: 'During my tenure as a Programmer Analyst Intern at Argusoft, we were paired with a team of 9, where I trained my skills in Angular and Java. Our primary project was the development of a full-stack Canteen Management WebApp, leveraging Angular, Java, PostgreSQL, Git, and Chart.js. Throughout the internship, we maintained daily stand-up calls to ensure seamless collaboration and progress tracking.'
        },
        { 
            status: 'Programmer Analyst Trainee', 
            date: 'Jul 2024 - Dec 2024', 
            image: argusoftLogo ,
            description: "As a Programmer Analyst Trainee at Argusoft, I was partnered with a peer under the mentorship of Mrs. Namrata Raval to master React, Java Spring Boot, and PostgreSQL using Udemy courses and diverse learning resources. We developed the FlightEase project, a secure, responsive web app for booking flight tickets, featuring Spring Security and Google login."
        },
        { 
            status: 'Programmer Analyst', 
            date: 'Jan 2025 - Present', 
            image: argusoftLogo ,
            description: 'As a full-time Programmer Analyst, I initially focused on training in React Native, where I developed a proof-of-concept chat app featuring pagination, batching, WebSocket integration, and mobile OTP login. Currently, I am actively involved in projects utilizing React Native and Spring Boot, contributing to the development of robust and scalable applications.'
        }
    ];

    const customizedContent = (item, index) => {
        const alignment = index % 2 === 0 ? 'left' : 'right';
        const imageStyle = {
            margin: window.innerWidth>768? alignment === 'right' ? '0 0 5% auto' : '0 auto 5% 0' : '0 auto 5% auto',
        };

        const isMobile = window.innerWidth < 768;
        const isExpanded = expandedCards[index];

        return (
            <Card title={item.status} subTitle={item.date}>
                <Img 
                    src={item.image}
                    height={'28'} 
                    width={'28'}
                    style={imageStyle}
                    className='TimelineCardImg'
                />
                {isMobile ? (
                    <div>
                        <p style={{
                            fontSize: '3.5vw',
                            textAlign: 'justify',
                            maxHeight: isExpanded ? 'none' : '120px',
                            overflow: 'hidden',
                            transition: 'max-height 0.3s ease-out'
                        }}>
                            {item.description}
                        </p>
                        <Button
                            link
                            onClick={() => toggleExpand(index)}
                            style={{
                                color: '#c770f0',
                                padding: '0.5rem 0',
                                fontSize: '0.9rem'
                            }}
                        >
                            {isExpanded ? 'Show Less' : 'Show More'}
                        </Button>
                    </div>
                ) : (
                    <p style={{
                        fontSize: '1vw',
                        textAlign: 'inherit'
                    }}>
                        {item.description}
                    </p>
                )}
            </Card>
        );
    };

    // Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setTimelineAlign('left');
            } else {
                setTimelineAlign('alternate');
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Modify the Intersection Observer
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px',  // Only trigger when element is 100px into viewport
            threshold: 0.3  // Increased threshold - requires more visibility
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        // Observe the timeline event contents
        document.querySelectorAll('.p-timeline-event-content').forEach(content => {
            observer.observe(content);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <VStack
            className="contactForm"
            alignItems="center"
            w={window.innerWidth>768?'90%':'100%'}
            style={{marginTop:"100px"}}
        >
            <Heading id='career' as="h1" style={{paddingBottom: "5%"}}>Career <strong className="purple">Timeline</strong></Heading>
            <Timeline 
                value={events} 
                align={timelineAlign}
                content={(item, index) => customizedContent(item, index)}
                className="custom-timeline"
            />
        </VStack>
    );
}