import './App.scss';
import { createTheme, makeStyles, responsiveFontSizes } from '@material-ui/core/styles';

const CAST_SHADOW_HEAVY = {
  boxShadow: '0px 0px 20px -3px black',
};

const CAST_SHADOW_LIGHT = {
  boxShadow: '0px 0px 5px -1px black',
};

export const theme = responsiveFontSizes(
  createTheme({
    status: {
      danger: 'orange',
    },
    defaults: {
      centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      textEllipsis: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
      castShadow: {
        heavy: CAST_SHADOW_HEAVY,
        light: CAST_SHADOW_LIGHT,
      },
      underlineInput: {
        position: 'relative',
        '& > input': {
          width: '100%',
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          borderBottomColor: 'hsla(341, 97%, 59%, 0.2)',
        },
        '& > input:focus': {
          outline: 'none',
        },
        '& > span': {
          position: 'absolute',
          bottom: 0,
          left: '50%',
          width: '100%',
          height: 1,
          opacity: 0,
          backgroundColor: '#bada55',
          transformOrigin: 'center',
          transform: 'translate(-50%, 0) scaleX(0)',
          willChange: 'transform',
          transition: 'transform 0.3s ease',
        },
        '& > input:focus ~ span': {
          transform: 'translate(-50%, 0) scaleX(1)',
          opacity: 1,
        },
      },
      circleButton: {
        position: 'fixed',
        margin: 20,
        height: 70,
        width: 70,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.1s linear',
        color: 'white',
        ...CAST_SHADOW_HEAVY,
        '&:not([disabled])': {
          '&:hover': {
            transform: 'scale(1.1)',
            ...CAST_SHADOW_HEAVY,
          },
          '&:active': {
            transform: 'scale(1)',
            boxShadow: 'none',
          },
          '&.touched': {
            boxShadow: 'none!important',
            transform: 'scale(0.9)!important',
          },
        },
        '&.emphasize': {
          animation: 'shadow-pulse 1s infinite',
        },
      }
    },
  } as any)
);

const styles = () => ({
  root: {
    width: '100%',
    overflow: 'hidden',
  },
});

export const useAppStyles = makeStyles(styles);
