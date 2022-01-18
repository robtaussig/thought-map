import React, { FC, useRef, useEffect } from 'react';

interface ImageWrapperProps {
  children: any;
  className: string;
  loaded: boolean;
}

export const ImageWrapper: FC<ImageWrapperProps> = ({ children, className, loaded = true }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loaded) {
            setTimeout(() => {
                wrapperRef.current.scrollIntoView({behavior: 'smooth'});
            }, 100);
        }
    }, []);

    return (
        <div ref={wrapperRef} className={className}>
            {children}
        </div>
    );
};

export default ImageWrapper;
