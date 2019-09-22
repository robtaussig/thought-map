import { StyleRules } from '@material-ui/core/styles';

export const styles = (theme: any): StyleRules => ({
  form: {
    height: '100%',
    display: 'grid',
    gridTemplateAreas: `"title title"
                        "type submit"
                        "expand expand"`,
    gridTemplateRows: 'max-content max-content max-content',
    gridTemplateColumns: '1fr max-content',
    gridGap: '10px',
  },
  expanded: {
    gridTemplateAreas: `"title title"
                        "type ."
                        "expanded expanded"
                        ". submit"`,
    gridTemplateRows: 'max-content max-content 1fr max-content',
    gridTemplateColumns: '1fr max-content',
  },
  expandedContent: {
    gridArea: 'expanded',
  },
  inputLabel: {
    '&#title': {
      gridArea: 'title',
      '& input': {
        width: '100%',
        fontSize: 18,
      },
    },
  },
  selectLabel: {
    '&#type': {
      '& select': {
        width: '100%',
        fontSize: 18,
      },
    },
  },
  moreButton: {
    gridArea: 'expand',
  },
  submitButton: {
    gridArea: 'submit',
    cursor: 'pointer',
    fontWeight: 600,
    color: 'white',
    '&:disabled': {
      color: 'gray',
    },
  },
});