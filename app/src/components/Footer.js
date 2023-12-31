import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import InfoButton from "./basicComponents/InfoButton";
import InfoBackdrop from "./InfoBackdrop";

const useStyles = makeStyles((theme) => ({
    phantom: {
        display: 'block',
        height: '80px',
        width: '100%',
    },
    footer: {
        position:'fixed',
        left:0,
        bottom:0,
        right:0,
        background: '#fdfdff',
        color: 'darkgray'
    },
    footerTitle: {
        marginLeft: '3vw'
    },
    infoButtonPosition: {
        position: "fixed",
        bottom: '0',
        right: '1vw ',
    }
}));


const Footer = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
    };
    const handleClick = () => {
      setOpen(!open);
    };

    return (
        <div>
            <div>
                <div className={classes.phantom}/>
                <div className={classes.footer}>
                    <h2 className={classes.footerTitle}>FentaSim</h2>
                    <div className={classes.infoButtonPosition} onClick={handleClick}>
                        <InfoButton />
                    </div>
                </div>
            </div>
            <InfoBackdrop open={open} handleClose={handleClose}/>
        </div>
    )
}

export default Footer;