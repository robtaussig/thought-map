import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: (params: any) => ({
    height: '100%',
    width: '100%',
    display: 'grid',
    overflow: 'hidden',
    gridTemplateAreas: `"thought thought"
                        "field-headers field-headers"
                        "merge-data merge-data"
                        ". buttons"`,
    gridTemplateRows: 'max-content max-content 1fr max-content',
    gridTemplateColumns: '1fr max-content',
  }),
  mergeData: ({ fieldCount }: any) => ({
    gridArea: 'merge-data',
    display: 'grid',
    gridAutoFlow: 'row',
    overflow: 'auto',
    gridGap: '5px',
    gridTemplateRows: `repeat(${fieldCount}, max-content) [buttons] max-content`,
    gridTemplateColumns: '[fields] 80px [left] 1fr [right] 1fr [custom] 80px',
    margin: 10,
    padding: 10,
    backgroundColor: theme.palette.background[200],
    boxShadow: 'inset 0px 0px 4px 0px black',
  }),
  fieldHeaders: (params: any) => ({
    gridArea: 'field-headers',
    display: 'grid',
    gridTemplateAreas: `"type left right custom"`,
    gridTemplateRows: 'max-content',
    gridTemplateColumns: '80px 1fr 1fr 80px',
    margin: '0 20px',
    '& > *': {
      fontWeight: 600,
    },
    '& .type': {      
      textTransform: 'uppercase',
      color: theme.palette.secondary[500],
    },
    '& .left': {
      ...theme.defaults.centered,
    },
    '& .right': {
      ...theme.defaults.centered,
    },
    '& .custom': {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  }),
  fields: (params: any) => ({
    gridArea: 'fields',
    display: 'grid',
    gridAutoFlow: 'row',
    gridTemplateColumns: 'max-content',
  }),
  itemType: (params: any) => ({
    gridRow: 'item-type',
    gridColumn: 'fields',
  }),
  mutualField: (params: any) => ({
    gridColumn: 'fields',
    fontWeight: 600,
  }),
  pickableField: (params: any) => ({
    gridColumn: 'fields',
    fontWeight: 600,
  }),
  custom: (params: any) => ({
    gridColumn: 'custom',
  }),
  parentThought: (params: any) => ({
    gridArea: 'thought',
    display: 'grid',
    margin: 10,
    padding: 10,
    backgroundColor: theme.palette.background[200],
    gridTemplateAreas: `"header header"
                        "title-field title-value"
                        "status-field status-value"
                        "created-field created-value"`,
    gridTemplateRows: 'repeat(4, max-content)',
    gridTemplateColumns: 'max-content 1fr',
    boxShadow: 'inset 0px 0px 4px 0px black',
    '& .header': {
      gridArea: 'header',
      fontWeight: 600,
      color: theme.palette.secondary[600],
    },
    '& .title-field': {
      gridArea: 'title-field',
      fontWeight: 600,
    },
    '& .title-value': {
      gridArea: 'title-value',
      marginLeft: 10,
    },
    '& .status-field': {
      gridArea: 'status-field',
      fontWeight: 600,
    },
    '& .status-value': {
      gridArea: 'status-value',
      marginLeft: 10,
    },
    '& .created-field': {
      gridArea: 'created-field',
      fontWeight: 600,
    },
    '& .created-value': {
      gridArea: 'created-value',
      marginLeft: 10,
    },
  }),
  pickableValue: (params: any) => ({
    whiteSpace: 'pre-line',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: 'white',
    backgroundColor: theme.palette.negative[500],
    '&.left': {
      gridColumn: 'left',
    },
    '&.right': {
      gridColumn: 'right',
    },
    '&.selected': {
      backgroundColor: theme.palette.secondary[600],
    },
  }),
  mutualValue: (params: any) => ({
    whiteSpace: 'pre-line',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&.left': {
      gridColumn: 'left',
    },
    '&.right': {
      gridColumn: 'right',
    },
    '&.selected': {
      color: theme.palette.secondary[600],
    },
  }),
  stageButton: (params: any) => ({
    gridRow: 'buttons',
    margin: 10,
    marginTop: 0,
    marginLeft: 'auto',
    padding: '3px 25px',
    borderRadius: 5,
    fontWeight: 600,
    backgroundColor: theme.palette.primary[600],
    color: 'white',
    cursor: 'pointer',
    '&:disabled': {
      backgroundColor: '#ccc',
    }
  }),
}));
