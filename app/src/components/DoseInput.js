import {makeStyles} from "@material-ui/core/styles";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import InputSlider from "./InputSlider";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import * as React from "react";
import {useEffect} from "react";


const useStyles = makeStyles((theme) => ({}));

const DoseInput = ({addDose}) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(100);
    const [timeValue, setTimeValue] = React.useState(dayjs(new Date()));

    // update time every 30 seconds
    useEffect(() => {
      setInterval(() => setTimeValue(dayjs(new Date())), 30000);
    }, []);

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={5} direction="row" alignItems="center" justifyContent="center">
                <Grid item
                    sx={{
                            width: 200,
                        }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            // label="Administered at"
                            value={timeValue}
                            onChange={(newTimeValue) => setTimeValue(newTimeValue)}
                            ampm={false}
                          slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item
                    sx={{
                                height: 0.5,
                            }}
                    >
                    <InputSlider max={500} title={'mcg'} handleValueChange={setValue}/>
                </Grid>
                <Grid item>
                    <Button variant="outlined" endIcon={<AddCircleOutlineOutlinedIcon/>}
                            onClick={() => addDose(value, timeValue)}
                    >
                        Add Dose
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default DoseInput;