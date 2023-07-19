import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    title: {
        fontSsize: "0.8rem",
        color: 'lightgray'
    },
    textInput: {
        fontSize: "0.9rem",
    }
}));



const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider({title, max, handleValueChange}) {
    const classes = useStyles();
  const [value, setValue] = React.useState(100);
  const step = 25;
  const min = 0;

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    handleValueChange(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    handleValueChange(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
      handleValueChange(0);
    } else if (value > max) {
      setValue(max);
      handleValueChange(max);
    }
  };

  return (
    <Box sx={{ width: 200 }}>
        <Typography className={classes.title} id="input-slider" gutterBottom>
          {title}
        </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            min={min}
            step={step}
            max={max}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            className={classes.textInput}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
