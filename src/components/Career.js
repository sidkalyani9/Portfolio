import React, { useEffect, useState } from 'react'; 
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import FullScreenSection from './FullScreenSection';
import { Heading, Img, VStack } from '@chakra-ui/react';
import vgecLogo from '../images/vgeclogo.png';
import argusoftLogo from '../images/argusoftLogo.png';
// import './TimelineDemo.css';

export default function Career() {
    const [timelineAlign, setTimelineAlign] = useState('alternate');

    const events = [
        { 
            status: 'B.tech in Information Technology', 
            date: '2021-2024', 
            image: vgecLogo ,
            description: 'At VGEC'
        },
        { 
            status: 'Summer Intern', 
            date: 'May 2023 - Jul 2023', 
            image: argusoftLogo,
            description: 'Argusoft'
        },
        { 
            status: 'Programmer Analyst Intern', 
            date: 'Jan 2024 - Jun 2024', 
            image: argusoftLogo,
            description: 'Argusoft'
        },
        { 
            status: 'Programmer Analyst Trainee', 
            date: 'Jul 2024 - Dec 2024', 
            image: argusoftLogo ,
            description: 'Argusoft'
        },
        { 
            status: 'Programmer Analyst', 
            date: 'Jan 2025 - Present', 
            image: argusoftLogo ,
            description: 'Argusoft'
        }
    ];

    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={item.status} subTitle={item.date}>
                    <Img 
                        src={item.image}
                        height={'28'} 
                        width={'28'}
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
            >
                <Heading as="h1" style={{paddingBottom: "5%" }}>Career <strong className="purple">Timeline</strong></Heading>
                <Timeline 
                    value={events} 
                    align={timelineAlign}
                    content={customizedContent}
                    // marker={customizedMarker}
                    className="custom-timeline"
                />
            </VStack>
            
        
    )
}
        