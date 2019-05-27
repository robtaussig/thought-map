export const styles = theme => ({
  root: {
    height: '100%',
    position: 'relative',
    backgroundColor: 'black',
    '& #thought-loader': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  },
});
