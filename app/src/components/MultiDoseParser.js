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

const MultiDoseParser = ({addDose}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen(!open);
    }


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
            <TextField id="standard-basic" label="Parse multiple doses" variant="standard" />
            <IconButton color='primary' 
                onClick={toggleOpen}>
                <PlaylistAddOutlinedIcon/>
            </IconButton>
        </Box>
        </Modal>        
        </div>

    )
}

export default MultiDoseParser;