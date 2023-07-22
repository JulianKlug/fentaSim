import {makeStyles} from "@material-ui/core/styles";


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
    }
}));

const Footer = ({addDose}) => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.phantom}/>
            <div className={classes.footer}>
                <h2 className={classes.footerTitle}>FentaSim</h2>
            </div>
        </div>
    )
}

export default Footer;