import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {ThemeProvider} from "@material-ui/styles";
import { isMobile } from '../../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function RefreshButton() {
  const classes = useStyles();
  const theme = useTheme();

  const buttonProps = {
    fontSize: isMobile ? "default" : "large",
  };

  return (
    <ThemeProvider theme={theme}>
    <div className={classes.root}>
      <IconButton aria-label="info" color="primary">
        <RefreshOutlinedIcon {...buttonProps}
          onClick={() => window.location.reload(false)}
        />
      </IconButton>
    </div>
    </ThemeProvider>

  );
}

