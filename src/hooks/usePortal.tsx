import React, { FC, createContext, useContext, useEffect, useState } from 'react';

const PortalContext = createContext(null);

interface PortalProps {
  
}

const ChildPortal: FC<PortalProps> = ({ children }) => {
  const setPortalChildren = useContext(PortalContext);
  
  useEffect(() => {
    setPortalChildren(children);
    return () => setPortalChildren(null);
  });

  return null;
};

export const usePortal = () => {

  return ChildPortal;
};

export const Portal: FC<PortalProps> = ({ children }) => {
  const [portalChildren, setPortalChildren] = useState<any>(null);

  return (
    <PortalContext.Provider value={setPortalChildren}>
      {children}
      {portalChildren && (
        <div id={'portal'} style={{
          position: 'fixed',
          zIndex: 99999999,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
        }}>
          {portalChildren}
        </div>
      )}
    </PortalContext.Provider>
  );
};

export default usePortal;
