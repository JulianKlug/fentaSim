import React from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactVirtualizedTable from "./ReactVirtualizedTable";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

const AccordionSummary = withStyles({
  root: {
    flexDirection: "column",
  },
  content: {
    marginBottom: 0
  },
  expandIcon: {
    marginRight: 0,
    paddingTop: 0
  }
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
      maxWidth: '600px',
        margin: 'auto'
    }
}))((props) => <MuiAccordionDetails {...props} />);



const DoseHistory = ({summaryContent, doseHistory, deleteDose}) => {
    const classes = useStyles();
    const [expand, setExpand] = React.useState(false);
    const toggleAcordion = () => {
      setExpand((prev) => !prev);
    };

    return (
      <div className={classes.root}>
        <Accordion elevation={0} expanded={expand}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            onClick={toggleAcordion}
          >
            {/*{expand ? summaryContent : ""}*/}
          </AccordionSummary>
          <AccordionDetails>
              <ReactVirtualizedTable data={doseHistory} deleteRow={deleteDose}/>
          </AccordionDetails>
        </Accordion>
      </div>
    )
};

export default DoseHistory;