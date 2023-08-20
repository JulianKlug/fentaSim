import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {ThemeProvider} from "@material-ui/styles";
import {useMediaQuery} from "@material-ui/core";
import { isMobile } from '../../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function InfoButton() {
  const classes = useStyles();
  const theme = useTheme();

  const buttonProps = {
    fontSize: isMobile ? "default" : "large",
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <IconButton aria-label="info" color="primary">
          <InfoOutlinedIcon {...buttonProps}/>
        </IconButton>
      </div>
    </ThemeProvider>
  );
}

