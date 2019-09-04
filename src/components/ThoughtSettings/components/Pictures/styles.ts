import { StyleRules } from '@material-ui/core/styles';

const UPLOAD_OPTIONS_WIDTH = 50;

export const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  uploadInput: {
    flex: '0 0 40px',
  },
  thoughtsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  imageList: {
    display: 'flex',
    flexDirection: 'column',
  },
  imageItem: {
    display: 'flex',
    margin: '15px 0',
  },
  pictureItem: {
    display: 'grid',
    gridTemplateAreas: `"image delete"
                        "description description"`,
    gridTemplateRows: '1fr max-content',
    gridTemplateColumns: '1fr 40px',
    margin: '15px 0',
    '& > img': {
      gridArea: 'image',
      width: '100%',
    }
  },
  pictureDescription: {
    gridArea: 'description',
  },
  deleteButton: {
    gridArea: 'delete',
    borderBottom: 'none!important',
    color: `${theme.palette.red[500]}!important`,
    margin: '0!important',
  },
  image: {
    width: `calc(100% - ${UPLOAD_OPTIONS_WIDTH}px)`,
    height: 'auto',
    flex: 1,
  },
  uploadOptions: {
    flex: `0 0 ${UPLOAD_OPTIONS_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    '& > button': {
      borderBottom: '1px solid white',
      cursor: 'pointer',
      color: 'white',
      margin: '15px 0',
    },
  },
});
