import { useState, useEffect } from "react";

const useWindow = () =>  {

    const[width,setWidth] = useState(0);
    
    useEffect(() => {
        const handleWindowSize = () => {
            setWidth(window.innerWidth);
        }
        
        window.addEventListener("load", handleWindowSize);
    
        // Return a function from the effect that removes the event listener
        return () => window.removeEventListener("load", handleWindowSize);
      }, []);

      return width;
}

export default useWindow;

