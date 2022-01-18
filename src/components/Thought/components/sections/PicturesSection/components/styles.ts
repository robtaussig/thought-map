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
    flexDirection: 'column',
    '& > img': {
      gridArea: 'image',
      width: '100%',
    }
  },
  pictureDescription: {
    gridArea: 'description',
    display: 'flex',
    alignItems: 'center',
  },
  toggleDestructiveIcons: {
    marginLeft: 'auto',
  },
  pictureDescriptionText: {
    flex: 1,
  },
  editPictureDescriptionButton: () => ({
    flex: '0 0 40px',
    color: theme.palette.secondary[700],
    display: 'flex',
    justifyContent: 'flex-end',
  }),
  pictureDescriptionButton: () => ({
    gridArea: 'description',
    marginTop: 10,
    color: theme.palette.secondary[700],
    fontWeight: 600,
  }),
  deleteButton: () => ({
    gridArea: 'delete',
    borderBottom: 'none!important',
    color: `${theme.palette.negative[500]}!important`,
    margin: '0!important',
  }),
  pinButton: {
    gridArea: 'delete',
    color: '#0000002e!important',
    borderBottom: 'none!important',
    margin: '0!important',
  },
  unpinButton: {
    gridArea: 'delete',
    borderBottom: 'none!important',
    margin: '0!important',
  },
  image: {
    width: `calc(100% - ${UPLOAD_OPTIONS_WIDTH}px)`,
    height: 'auto',
    flex: 1,
  },
  uploadOptions: () => ({
    flex: `0 0 ${UPLOAD_OPTIONS_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    '& > button': {
      borderBottom: `1px solid ${theme.palette.secondary[700]}`,
      cursor: 'pointer',
      color: theme.palette.secondary[700],
      margin: '15px 0',
    },
  }),
});
