import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    padding: 10,
    overflow: 'hidden',
    gridTemplateAreas: `"header header header"
                        "sub-header sub-header sub-header"
                        "main-field main-field main-field"
                        "fields fields fields"`,
    gridTemplateRows: 'max-content max-content max-content 1fr',
    gridTemplateColumns: 'max-content max-content 1fr',
    '&.connection': {
      gridTemplateAreas: `"header header header"
                          "from-thought connection ."
                          "from-thought connection ."
                          "from-text connection to-text"
                          ". connection to-thought"
                          ". connection to-thought"`,
      gridTemplateRows: 'max-content 1fr 1fr 30px 1fr 1fr',
      gridTemplateColumns: '1fr 10px 1fr',
    },
  },
  header: (params: any) => ({
    gridArea: 'header',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 10,
    color: theme.palette.secondary[500],
  }),
  subHeader: (params: any) => ({
    gridArea: 'sub-header',
    fontWeight: 600,
    padding: 10,
    backgroundColor: theme.palette.secondary[500],
    color: 'white',
  }),
  mainField: (params: any) => ({
    gridArea: 'main-field',
    padding: 10,
    paddingTop: 0,
    marginBottom: 10,
    backgroundColor: theme.palette.secondary[500],
    color: 'white',
  }),
  fields: (params: any) => ({
    gridArea: 'fields',
    display: 'grid',
    gridTemplateColumns: '[field-name] max-content [field-value] 1fr',
    gridAutoFlow: 'row',
    overflow: 'auto',
    padding: 10,
    backgroundColor: theme.palette.secondary[400],
    color: 'white',
  }),
  fieldName: (params: any) => ({
    gridColumn: 'field-name',
    fontWeight: 600,
  }),
  fieldValue: (params: any) => ({
    gridColumn: 'field-value',
    marginLeft: 10,
  }),
  connectionThought: (params: any) => ({    
    overflow: 'auto',
    padding: 10,
    border: `1px solid ${theme.palette.secondary[700]}`,
    backgroundColor: theme.palette.secondary[500],
    color: 'white',
    '& .thought-title': {
      fontWeight: 600,
      textTransform: 'uppercase',
      display: 'block',
    },
    '&.from': {
      gridArea: 'from-thought',
      borderRight: 'none',
    },
    '&.to': {
      gridArea: 'to-thought',
      borderLeft: 'none',
    },
  }),
  connection: (params: any) => ({
    gridArea: 'connection',
    backgroundColor: theme.palette.secondary[700],
  }),
  connectionText: (params: any) => ({
    ...theme.defaults.centered,
    fontWeight: 600,
    textTransform: 'uppercase',
    '&.from': {
      gridArea: 'from-text',
    },
    '&.to': {
      gridArea: 'to-text',
    },
  }),
}));
