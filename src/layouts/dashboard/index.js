/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";
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
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography, Slide, TextField } from '@mui/material';
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import ProgressLineChart from "examples/Charts/LineCharts/ProgressLineChart";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from 'axios';

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Base URL
const baseUrl = process.env.REACT_APP_API_URL;

// Table pagination actions component
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

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [dateFilter, setDateFilter] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/getfirstpage.php`);
        const response1 = await axios.get(`${baseUrl}/api/commandevalider.php`);
        const response2 = await axios.get(`${baseUrl}/api/commandeencours.php`);
        const response3 = await axios.get(`${baseUrl}/api/commandenretard.php`);
        console.log(response.data)
        setData(response.data);
        setFilteredData(response.data.userDataf);
        // setData1(response1.data.commandevalider.length);
        // setData2(response2.data.commandeencours.length);

   const leng=response3.data.commandeenretard.length
        console.log('found leng',leng);     
        setData3(response3.data.commandeenretard.length);
       
          console.log("data2 babyy",data3);
          
      
        setData4(response3.data.commandes);    
        console.log("im here")
        console.log(response3)   

        // console.log('commande en retard lenght',response3.data.commandeenretard.length)
        // console.log('commande commande',response3.data.commandes)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dateFilter) {
      const filtered = data ? data.filter(item => item.date_paiement === dateFilter) : [];
      setFilteredData(filtered);
    } else {
      setFilteredData(data ? data.userDataf : []);
    }
    setPage(0);
  }, [dateFilter, data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const summaryData = data ? [
    { title: "Bon Total Valider", value: data.userData[0].id_bonvalider },
    { title: "Commande En Cours", value: data.userDatas[0].id_commande },
    { title: "Total Revenue", value: data.userDatar[0].montant_totale, color: "green" },
    { title: "Total Perte", value:   data.userDatad[0].montant_totale, color: "red" },
  ] : [
    { title: "Bon Total Valider", value: 3 },
    { title: "Commande En Cours", value: 3 },
    { title: "Total Revenue", value: 3, color: "green" },
    { title: "Total Perte", value: 3, color: "red" },
  ];

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>

            <Grid item xs={12} md={6} lg={4} >
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color= "dark"
                    icon="weekend"
                  
                  title={summaryData[0].title}
                  count={summaryData[0].value}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4} >
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                color="success"
                icon="store"
                  
                  title={summaryData[1].title}
                  count={summaryData[1].value}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4} >
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                   color="primary"
                icon="person_add"
                  
                  title={summaryData[2].title}
                  count={summaryData[2].value}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4} >
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color= "dark"
                    icon="store"
                  
                  title={summaryData[3].title}
                  count={summaryData[3].value}
                />
              </MDBox>
            </Grid>
        </Grid>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={10} lg={12}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6} lg={6}>

          {data1 && data2 && data3 && (
<VerticalBarChart
  title="Status de Commandes"
  chart={{
    labels: ["Validé", "En cours", "En retard"],
    datasets: [{
      label: "Commandes",
      color: "dark",
      data: [data1,data2,data3],
    }],
  }}
/>   )}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
          {data4 && data4.length > 0 && (

<ProgressLineChart
  icon="date_range"
  title="Livraison"
 
  height="16rem"
  chart={{
    labels: data4.map(item => item.date_livraison || ''),
          data: data4.map(item => {
          const value = parseInt(item.commande);
          return isNaN(value) ? 0 : value;
        })
      
    
  }}
/>
  )}
          </Grid>
        </Grid>
      </MDBox>
      
      <Slide direction="left" in={sidebarOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: '300px',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '2px 0px 5px rgba(0,0,0,0.5)',
            p: 3,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6">Sidebar Content</Typography>
          {selectedRowData && (
            <div>
              <p>ID: {selectedRowData.id_paiement}</p>
              <p>Montant: {selectedRowData.montant}</p>
              <p>Type: {selectedRowData.type}</p>
              <p>Date Paiement: {selectedRowData.date_paiement}</p>
            </div>
          )}
          <button onClick={handleCloseSidebar}>Close</button>
        </Box>
      </Slide>
    </DashboardLayout>
  );
}

export default Dashboard;
