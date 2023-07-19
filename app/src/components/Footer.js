import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    footer: {
        position:'absolute',
        left:0,
        bottom:0,
        right:0,
        background: '#f8f8ff4d',
        color: 'darkgray'
    },
    footerTitle: {
        marginLeft: '3vw'
    }
}));

const Footer = ({addDose}) => {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <h2 className={classes.footerTitle}>FentaSim</h2>
        </div>
    )
}

export default Footer;