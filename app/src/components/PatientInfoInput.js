import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import {makeStyles} from "@material-ui/core/styles";
import * as React from 'react';
import {FormControl, InputAdornment, MenuItem, TextField} from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    currentPatientInfo: {
        alignItems: 'center',
        display: 'inline-flex',
        gap: '2vw',
        marginTop: '2vh',
        marginLeft: '2vw',
    },
}));

export default function PatientInfoInput({height, weight, age, sex, setHeight, setWeight, setAge, setSex}) {
  const classes = useStyles();

  return (
    <div className={classes.currentPatientInfo}>
       <SensorOccupiedIcon size="inherit"/>
            {/*Age:*/}
            {/*<FormControl sx={{ width: '3ch' }}>*/}
            {/*    <TextField style={{width: "3ch"}} id="standard-basic" label={"Age"} variant="standard" defaultValue={age}*/}
            {/*    onChange={(event) => {*/}
            {/*              setAge(event.target.value);*/}
            {/*            }}*/}
            {/*    />*/}
            {/*</FormControl>*/}
            {/*/!*Height:*!/*/}
            {/*<TextField style={{width: "6ch"}} id="standard-basic" variant="standard" label={"Height"} defaultValue={height}*/}
            {/*                   InputProps={{endAdornment: <InputAdornment position="end">cm</InputAdornment>}}*/}
            {/*        onChange={(event) => {*/}
            {/*                      setHeight(event.target.value);*/}
            {/*                    }}*/}
            {/*/>*/}
            {/*Weight: */}
            <TextField style={{width: "6ch"}} id="standard-basic" variant="standard" label={"Weight"} defaultValue={weight}
                                 InputProps={{endAdornment:<InputAdornment position="end">kg</InputAdornment>}}
                    onChange={(event) => {
                                    setWeight(event.target.value);
                                    }
                    }
            />
            {/*Sex:  */}
            {/*<TextField*/}
            {/*          id="standard-select-sex"*/}
            {/*          select*/}
            {/*          defaultValue={sex}*/}
            {/*          label={"Sex"}*/}
            {/*            onChange={(event) => {*/}
            {/*                            setSex(event.target.value);*/}
            {/*                            }*/}
            {/*            }*/}
            {/*        >*/}
            {/*      {['Male', 'Female'].map((option) => (*/}
            {/*        <MenuItem key={option} value={option}>*/}
            {/*          {option}*/}
            {/*        </MenuItem>*/}
            {/*      ))}*/}
        {/*</TextField>*/}
    </div>
  );
}