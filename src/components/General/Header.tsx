import React, { FC, MouseEvent } from 'react';
import Tooltip from './Tooltip';

interface HeaderProps {
  classes: any;
  value: string;
  onClick?: (event: MouseEvent<HTMLHeadingElement>) => void;
  tooltip?: string;
  [rest: string]: any;
}

export const Header: FC<HeaderProps> = React.memo(({ classes, value, onClick, tooltip, ...rest }) => {

    return (
        <h2 className={classes.header} onClick={onClick} {...rest}>
            {value}
            {tooltip && (
                <Tooltip text={tooltip}/>
            )}
        </h2>
    );
});

export default Header;
