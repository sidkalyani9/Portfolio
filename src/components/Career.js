import React, { useEffect, useState } from 'react'; 
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import FullScreenSection from './FullScreenSection';
import { Heading, Img, VStack } from '@chakra-ui/react';
import vgecLogo from '../images/vgeclogo.png';
import argusoftLogo from '../images/argusoftLogo.png';

export default function Career() {
    const [timelineAlign, setTimelineAlign] = useState('alternate');

    const events = [
        { 
            status: 'B.tech in Information Technology', 
            date: '2021-2024', 
            image: vgecLogo ,
            description: 'At V.G. Engineering College, I earned my B.Tech in Information Technology, mastering core computer science principles and practical skills. I excelled academically, completed impactful projects, and gained hands-on experience through internship. This journey equipped me with essential skills in app & web development, and machine learning, fueling my passion for innovation where I managed to score a 9.11 CGPA.'
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
            description: 'During my tenure as a Programmer Analyst Intern at Argusoft, I had the opportunity to work within a dynamic team of nine, where I honed my skills in Angular and Java. Our primary project was the development of a full-stack Canteen Management WebApp, leveraging Angular, Java, PostgreSQL, Git, and Chart.js. Throughout the internship, we maintained daily stand-up calls to ensure seamless collaboration and progress tracking. This experience not only bolstered my technical proficiency but also underscored the importance of teamwork and iterative development.'
        },
        { 
            status: 'Programmer Analyst Trainee', 
            date: 'Jul 2024 - Dec 2024', 
            image: argusoftLogo ,
            description: "As a Programmer Analyst Trainee/Probationer at Argusoft, I was paired with a peer for collaborative learning, mentored by Mrs. Namrata Raval. We were given access to Udemy courses and encouraged to learn from various resources. Our primary focus was on mastering React, Java Spring Boot, and PostgreSQL. We applied these skills to develop the FlightEase project, a modern, responsive web application for booking flight tickets. The project incorporated Spring Security and Google login, showcasing our ability to create secure and user-friendly applications. This experience significantly enhanced my technical capabilities and collaborative skills."
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
            margin: alignment === 'right' ? '0 0 5% auto' : '0 auto 5% 0',
        };

        return (
            <Card title={item.status} subTitle={item.date}>
                <Img 
                    src={item.image}
                    height={'28'} 
                    width={'28'}
                    style={imageStyle}
                    className='TimelineCardImg'
                />
                <p>{item.description}</p>
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

    // Intersection Observer for animations
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const marker = entry.target.querySelector('.p-timeline-event-marker');
                    if (marker) marker.classList.add('animate');
                    
                    const connector = entry.target.querySelector('.p-timeline-event-connector');
                    if (connector) connector.classList.add('animate');
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 300);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        document.querySelectorAll('.p-timeline-event').forEach(event => {
            observer.observe(event);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <VStack
            className="contactForm"
            alignItems="center"
            w={'90%'}
        >
            <Heading id='career' as="h1" style={{paddingBottom: "5%" }}>Career <strong className="purple">Timeline</strong></Heading>
            <Timeline 
                value={events} 
                align={timelineAlign}
                content={(item, index) => customizedContent(item, index)}
                className="custom-timeline"
            />
        </VStack>
    );
}