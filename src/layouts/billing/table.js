import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import axios from 'axios';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useSelector } from "react-redux";


import { useNavigate } from 'react-router-dom';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import logoImage from 'assets/images/logos/labelvie.png';

const baseUrl = process.env.REACT_APP_API_URL;
const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#3f51b5',
    textTransform: 'uppercase',
  },
  logo: { 
    width: 100, 
    alignSelf: 'center',
    marginBottom: 20 
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#3f51b5',
  },
  table: { 
    display: 'table', 
    width: 'auto', 
    marginVertical: 10,
  },
  tableRow: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  tableColHeader: { 
    width: '20%',
    borderRightWidth: 1,
    borderRightColor: '#bdbdbd',
    borderRightStyle: 'solid',
  },
  tableCol: { 
    width: '20%',
    borderRightWidth: 1,
    borderRightColor: '#bdbdbd',
    borderRightStyle: 'solid',
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  tableCell: { 
    margin: 5, 
    fontSize: 10 
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: '30%',
    fontWeight: 'bold',
  },
  infoValue: {
    width: '70%',
  },
  total: { 
    marginTop: 20,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
// Inside PDFDocument component
const PDFDocument = ({ rowData = {}, commandeData = [] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.logo} src={logoImage} />
      <Text style={styles.header}>Commande Infos</Text>

      <View style={styles.section}>
        <Text style={styles.subheader}>Détails de la commande</Text>
        {Object.entries(rowData || {}).map(([key, value]) => (
          <View style={styles.infoRow} key={key}>
            <Text style={styles.infoLabel}>{key}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Produits commandés</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Produit</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Prix</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Quantité</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>TVA</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>
          {(commandeData || []).map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.libeller}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>€{item.prix.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantiter}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{(item.tva * 100).toFixed(0)}%</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>€{(item.prix * item.quantiter * (1 + item.tva)).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.total}>
        Total: €{(commandeData || []).reduce((acc, item) => acc + item.prix * item.quantiter * (1 + item.tva), 0).toFixed(2)}
      </Text>
    </Page>
  </Document>
);

export default function TablePaid() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/getfirstpage.php`);
        setData(response.data.userDatae);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateFilter = (data) => {
    if (startDate && endDate) {
      return data.filter((row) => {
        const rowDate = new Date(row.date_livraison);
        return rowDate >= startDate && rowDate <= endDate;
      });
    }
    return data;
  };

  const filteredData = handleDateFilter(data);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const role = useSelector((state) => state.global.role);

  const handleRowClick = (row) => {
    if (role === 'admin') {
      navigate(`/details/${row.id}`);
    }
  };

  const handleGeneratePDF = async (row) => {
    console.log(row.id_bonlivraison)
    try {
      const response = await axios.get(`${baseUrl}/api/getprodbybon.php`, {
        params: { idbon: row.id_bonlivraison }
      });
      const commandeData = response.data.userData;
      
      const pdfDoc = <PDFDocument rowData={row} commandeData={commandeData} />;
      const asPdf = pdf([]);
      asPdf.updateContainer(pdfDoc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `commande_${row.id_bonlivraison}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    
      <div style={{ overflowX: 'auto', maxWidth: '150vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
 <LocalizationProvider  dateAdapter={AdapterDateFns}>

          <DatePicker
  label="Start Date"
  value={startDate}
  onChange={(newValue) => setStartDate(newValue)}
  renderInput={(params) => <TextField {...params} />}
  inputFormat="dd-MM-yyyy" // Correct prop
/>
<DatePicker
  label="End Date"
  value={endDate}
  onChange={(newValue) => setEndDate(newValue)}
  renderInput={(params) => <TextField {...params} />}
  inputFormat="dd-MM-yyyy" // Correct prop
/>
  </LocalizationProvider>
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table aria-label="custom pagination table">
            <TableHead>
             
            </TableHead>
            <TableBody>
            <TableRow>
                {Object.keys(data[0] || {}).map((key, index) => (
                  <TableCell
                    key={key}
                    align="left"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}
                  >
                    {key}
                  </TableCell>
                ))}
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((row, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  {Object.keys(row).map((key, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align="left"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                      onClick={() => handleRowClick(row)}
                    >
                      {row[key]}
                    </TableCell>
                  ))}
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGeneratePDF(row);
                      }}
                    >
                      Generate PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={Object.keys(data[0] || {}).length + 1} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={Object.keys(data[0] || {}).length + 1}
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>

);
}