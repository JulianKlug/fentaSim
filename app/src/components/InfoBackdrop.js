import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import {Typography} from "@material-ui/core";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey'
        }
      },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      background: '#000000c4',
      display: 'flex',
      flexDirection: 'column'
    },
    description: {
     width: '60%',
     maxHeight: '80vh',
     marginTop: '10vh',
     textAlign: 'left',
     overflowY: 'scroll',
    },
    signature: {
        fontStyle: 'italic',
        marginTop: '5vh',
        marginBottom: '2vh'
    },
  }));

export default function InfoBackdrop({open, handleClose}) {
    const classes = useStyles();
 
    return (
        <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>

            <div className={classes.description}>
                <Typography variant="body1">
                FentaSim is an app simulating the effect site concentration of multiple IV fentanyl boluses. Doses can either be entered manually, or be parsed from a dose table.<br/>
                It can be used to determine peak concentration, time to peak, as well as to simulate the time to recovery. <br/>
                The simulation relies on a three-compartment model and either parameters initially published 
                by <Link variant="inherit" color="inherit" href='https://jpet.aspetjournals.org/content/240/1/159'>Scott et al. </Link> 
                 or on paremeters defined by <Link variant="inherit" color="inherit" href='https://doi.org/10.1097/00000542-199012000-00005'>Shafer et al.</Link><br/>

                <br/><br/>
                This project is based on an original idea by Prof. Thomas Schnider 
                and on the pharmacokinetic model implementation by Prof. Steven Shafer in <Link variant="inherit" color="inherit" href='https://github.com/StevenLShafer/stanpumpR'>stanpumpR</Link>. <br/>

                <br/><br/>
                If you wish to contribute to this project, please do not hesitate to contact me.
                </Typography>
                </div>
                <div className={classes.signature}>
                    <Link variant="inherit" color="inherit" href='https://www.julianklug.com'> Julian Klug </Link>
            </div>
        </Backdrop>
    );
}