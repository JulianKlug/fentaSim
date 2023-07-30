import TableRowsIcon from '@mui/icons-material/TableRows';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
}));

const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: 'none',
        boxShadow: 24,
        p: 4,
        // rounded corners
        borderRadius: 2,
    };

function parseMultiDoseString(inputData) {
    const regex = /(?<drug>[A-Za-z]+(?: [A-Za-z]+)*)\s*(?<volume>\d+ ml)?\s*(?<dose>\d+(\.\d+)?)?\s*(?<unit>[A-Za-z]+)?\s*(?<time>\d{2}\.\d{2}\.\d{4} \d{2}:\d{2})/g;
    const matches = [];
    let match;

    while ((match = regex.exec(inputData)) !== null) {
        const drug = (match.groups.drug || "").trim();
        const volume = (match.groups.volume || "").trim();
        let dose = parseFloat((match.groups.dose || "").trim());
        let unit = (match.groups.unit || "").trim();
        let time = (match.groups.time || "").trim();

        if (drug.toLowerCase() !== "fentanyl") {
            continue;
        }   

        // target unit: mcg
        if (unit === "g") { 
            dose *= 1000000;
            unit = "mcg";
        } else if (unit === "mg") {
            dose *= 1000;
            unit = "mcg";
        }
        if (unit !== "mcg") {
            continue;
        }

        time = timeStringParser(time);

        if (drug !== "") {
        matches.push({ drug, volume, dose, unit, time });
        }
    }

    return matches;
}

function timeStringParser(dateString) {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split(".");
    const [hour, minute] = timePart.split(":");
    const formattedDate = new Date(`${year}-${month}-${day}T${hour}:${minute}`);

    return formattedDate;
}

const MultiDoseParser = ({addDoses}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [multiDoseString, setMultiDoseString] = useState('');

    const toggleOpen = async () => {
        setOpen(!open);
    }

    const parseData = () => {
        const parsedData = parseMultiDoseString(multiDoseString);
        addDoses(parsedData);
        toggleOpen();
    };

    return (
        <div>
        {/* on click of button open modal with text input field */}
        <IconButton aria-label="addMultiple" size='small' color='primary'
        // let color be light grey, primary color on hover
        sx={{
            color: 'lightgrey',
        }}
                    onClick={() => toggleOpen()} 
        >
            <PlaylistAddOutlinedIcon/>
        </IconButton>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        {/* open a text input field */}
        <Box sx={modalStyle}>
            <TextField id="standard-basic" label="Parse multiple doses" variant="standard" 
                onChange={(event) => {
                                    setMultiDoseString(event.target.value);
                                    }}
            />
            <IconButton color='primary' 
                onClick={parseData}>
                <PlaylistAddOutlinedIcon/>
            </IconButton>
        </Box>
        </Modal>        
        </div>

    )
}

export default MultiDoseParser;