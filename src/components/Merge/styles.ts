import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: (params: any) => ({
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background[600],
    display: 'grid',
    padding: 10,
    gridRowGap: '10px',
    gridTemplateAreas: `"compare"
                        "queue"
                        "stage"
                        "."`,
    gridTemplateRows: '1fr 100px 100px 95px',
    gridTemplateColumns: '1fr',
    '& > *': {
      boxShadow: '0px 0px 5px 2px black',
      backgroundColor: theme.palette.background[100],
    }
  }),
  currentCompare: (params: any) => ({
    gridArea: 'compare',
  }),
  currentReview: (params: any) => ({
    gridArea: 'compare',
  }),
  compareQueue: (params: any) => ({
    gridArea: 'queue',
  }),
  mergeStage: (params: any) => ({
    gridArea: 'stage',
  }),
  readyToMergeButton: (params: any) => ({
    fontWeight: 600,
    ...theme.defaults.centered,
    fontSize: 20,
    color: theme.palette.primary[700],
  }),
}));

export const useCompareQueueStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    padding: 10,
    gridGap: '10px',
    gridTemplateAreas: `"title title title title title"
                        "left-scan left-item middle-item right-item right-scan"`,
    gridTemplateRows: 'max-content 1fr',
    gridTemplateColumns: 'max-content 1fr 1fr 1fr max-content',
  },
  title: {
    gridArea: 'title',
    fontWeight: 600,
    color: theme.palette.background[800],
  },
  scanLeftButton: {
    gridArea: 'left-scan',
  },
  scanRightButton: {
    gridArea: 'right-scan',
  },
  compareItem: (params: any) => ({
    backgroundColor: theme.palette.background[300],
    display: 'grid',
    padding: 5,
    gridTemplateAreas: `"collection-name"
                        "diff-fields"`,
    gridTemplateRows: 'max-content 1fr',
    gridTemplateColumns: '1fr',
    transition: 'all 0.2s linear',
    boxShadow: '0px 0px 3px 0px black',
    '&.selected': {
      transform: 'scaleY(1.1)',
      boxShadow: '0px 0px 6px -1px black',
    },
  }),
  leftItem: (params: any) => ({
    gridArea: 'left-item',
  }),
  middleItem: (params: any) => ({
    gridArea: 'middle-item',
  }),
  rightItem: (params: any) => ({
    gridArea: 'right-item',
  }),
  compareItemCollectionName: (params: any) => ({
    gridArea: 'collection-name',
    fontWeight: 600,
    color: theme.palette.secondary[700],
  }),
  compareItemDiffFields: (params: any) => ({
    gridArea: 'diff-fields',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: theme.palette.secondary[700],
  }),
}));

export const useMergeStageStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    padding: 10,
    gridGap: '10px',
    gridTemplateAreas: `"title title title title title"
                        "left-scan left-item middle-item right-item right-scan"`,
    gridTemplateRows: 'max-content 1fr',
    gridTemplateColumns: 'max-content 1fr 1fr 1fr max-content',
  },
  title: {
    gridArea: 'title',
    fontWeight: 600,
    color: theme.palette.background[800],
  },
  scanLeftButton: {
    gridArea: 'left-scan',
  },
  scanRightButton: {
    gridArea: 'right-scan',
  },
  mergeItem: (params: any) => ({
    backgroundColor: theme.palette.background[300],
    display: 'grid',
    padding: 5,
    gridTemplateAreas: `"collection-name"`,
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr',
    transition: 'all 0.2s linear',
    boxShadow: '0px 0px 3px 0px black',
    '&.selected': {
      transform: 'scaleY(1.1)',
      boxShadow: '0px 0px 6px -1px black',
    },
  }),
  leftItem: (params: any) => ({
    gridArea: 'left-item',
  }),
  middleItem: (params: any) => ({
    gridArea: 'middle-item',
  }),
  rightItem: (params: any) => ({
    gridArea: 'right-item',
  }),
  mergeItemCollectionName: (params: any) => ({
    gridArea: 'collection-name',
    fontWeight: 600,
    color: theme.palette.secondary[700],
    ...theme.defaults.centered,
  }),
}));
