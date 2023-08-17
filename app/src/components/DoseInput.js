import {makeStyles} from "@material-ui/core/styles";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import InputSlider from "./InputSlider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import * as React from "react";
import {useEffect, useRef} from "react";
import MultiDoseParser from "./MultiDoseParser.js";
import {isMobile} from "../utils/utils.js";

const useStyles = makeStyles((theme) => ({
    multiDoseInput: {
        marginTop: '1vh',
        marginBottom: '1vh',
        width:'100%'
    }
}));

function isFocused(ref) {
    return ref.current
            && ref.current.contains(document.activeElement)
            && document.activeElement instanceof HTMLInputElement
}

const DoseInput = ({addDoses}) => {
    const classes = useStyles();
    const refDoseInput = useRef(null);
    const [value, setValue] = React.useState(100);
    const [timeValue, setTimeValue] = React.useState(dayjs(new Date()));

    // update time every 90 seconds unless input field is focused
    useEffect(() => {
        setInterval(() => 
            {
                if (!isFocused(refDoseInput)) {
                    setTimeValue(dayjs(new Date()))
                }
            }, 90000);
    }, []);
   

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={5} direction="row" alignItems="center" justifyContent="center"
                ref={refDoseInput}
            >
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
                    <InputSlider 
                        max={500} title={'mcg'} handleValueChange={setValue}/>
                </Grid>
                <Grid item>
                    <Button variant="outlined" endIcon={<AddCircleOutlineOutlinedIcon/>}
                            onClick={() => addDoses(
                                            [{ dose: value, time: timeValue}]
                                            )}
                    >
                        Add Dose
                    </Button>
                </Grid>
            
                {isMobile()? null :
                    <Grid item
                        sx={{
                            width: 5,
                        }}
                    >
                        <MultiDoseParser addDoses={addDoses}/>                
                    </Grid>
                }
                </Grid>                                                
        </div>
    )
}

export default DoseInput;