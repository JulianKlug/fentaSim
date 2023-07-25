import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const columns = [
  {
    width: 10,
    label: 'Drug',
    dataKey: 'Drug',
  },
  {
    width: 30,
    label: 'Time',
    dataKey: 'TimeDateStr',
    numeric: true,
  },
  {
    width: 10,
    label: 'Dose',
    dataKey: 'Dose',
    numeric: true,
  },
  {
    width: 10,
    label: 'Units',
    dataKey: 'Units',
  },
    {
      width: 1,
        label: '',
        dataKey: 'deleteRow',
      numeric: false,
    }
];


const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'center'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function getRowContent(deleteRow) {
  return (_index, row) => {
    return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'center'}
        >
          {column.label !== ''?
              row[column.dataKey]
              :
              (
                <DeleteForeverIcon
                    onClick={() => deleteRow(_index)}/>
              )
          }
        </TableCell>
      ))}
    </React.Fragment>
  )
  };
}

export default function ReactVirtualizedTable({data, deleteRow}) {
  // map data.TimeDate to a time str
    data.forEach((row) => {
        row.TimeDateStr = new Date(row.TimeDate).toLocaleTimeString();
    });

  return (
    <Paper style={{ height: '30vh', width: '100%', zIndex: 0, margin: 'auto' }}>
      <TableVirtuoso
        data={data}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={getRowContent(deleteRow)}
      />
    </Paper>
  );
}