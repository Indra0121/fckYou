import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Grid, Slide, Divider, Avatar, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useSelector } from "react-redux";

const baseUrl = process.env.REACT_APP_API_URL;
function Sidebar({ rowData, open, onClose }) {
  const [userCommands, setUserCommands] = useState([]);
  const [userInfos, setUserInfos] = useState({});
  const [id, setId] = useState(rowData);
  const page = 'Client';
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setId(rowData);
    console.log('this sidebar id', rowData);

    const fetchData = async () => {
      try {
        let response = await axios.post(`${baseUrl}/api/userinfoswithcommands.php`, {
          userid: rowData
        });

        console.log(response.data);

        if (response.data) {
          setUserCommands(response.data.usercommands || []);
          setUserInfos(response.data.userinfo || {});
        } else {
          setUserCommands([]);
          setUserInfos({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setUserCommands([]);
        setUserInfos({});
      }
    };

    if (open) {
      fetchData();
    }
  }, [id, rowData, open]);

  const renderCommandSummary = (commands) => {
    // Get unique idcommande and use the montant_totale from the same entry
    const summaries = commands.reduce((acc, command) => {
      const { idcommande, montant_totale } = command;
      if (!acc[idcommande]) {
        acc[idcommande] = { montant_totale, count: 0 };
      }
      acc[idcommande].count += 1;
      return acc;
    }, {});

    // Limit to two entries
    const limitedSummaries = Object.entries(summaries).slice(0, 2);

    return limitedSummaries.map(([idcommande, summary]) => (
      <Box key={idcommande}  sx={{  backgroundColor: theme.palette.background.paper,
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="subtitle2" color="primary"><strong>Commande #</strong> {idcommande}</Typography>
        <List dense>
          <ListItem>
            <ListItemIcon><AttachMoneyIcon color="primary" /></ListItemIcon>
            <ListItemText primary={`Montant total: ${summary.montant_totale}`} />
          </ListItem>
          <ListItem>
            <ListItemIcon><InventoryIcon color="primary" /></ListItemIcon>
            <ListItemText primary={`Nombre de produits: ${summary.count}`} />
          </ListItem>
        </List>
      </Box>
    ));
  };

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Box
     sx={{
      width: '350px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      right: 0,
      backgroundColor: theme.palette.background.default,
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1100,
      padding: '20px',
      overflow: 'auto',
    }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px', color: theme.palette.primary.main }}>
          Details des commandes
        </Typography>
        {userInfos && (
          <Box sx={{ marginBottom: '20px', 
            backgroundColor: theme.palette.background.paper,
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'  }}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
               <Avatar sx={{ width: 60, height: 60, marginRight: '15px', backgroundColor: theme.palette.primary.main }}>
                    {userInfos.nom ? userInfos.nom.charAt(0).toUpperCase() : 'F'}
                  </Avatar>
                  <Typography variant="h6">{userInfos.nom}</Typography>
              </Box>
              <List dense>
                  <ListItem>
                    <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={userInfos.nom} secondary="Entreprise" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={userInfos.prenom} secondary="Email" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={userInfos.telephone_client} secondary="Téléphone" />
                  </ListItem>
                </List>
          </Box>
        )}
        <Divider sx={{ margin: '20px 0' }} />
            
        <Typography variant="h6" sx={{ marginBottom: '15px', color: theme.palette.primary.main }}>
              <ShoppingCartIcon sx={{ verticalAlign: 'middle', marginRight: '10px' }} />
              Informations Commandes
            </Typography>
            
        <Box sx={{ padding: '0 20px' }}>
          {userCommands && userCommands.length > 0 ? (
            renderCommandSummary(userCommands)
          ) : (
            <Typography variant="body2">No data available</Typography>
          )}
          {userInfos && userCommands && (
            <Button variant="contained" 
            color="primary" 
            fullWidth
            sx={{ 
              marginTop: '15px',
              borderRadius: '8px',
              padding: '10px',
              fontWeight: 'bold'
            }}
            onClick={() => {
              navigate('/notifications', { state: { userInfos, userCommands, page } });
            }}
          >
              see all</Button>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <KeyboardArrowRight />
        </IconButton>
        
      </Box>
    </Slide>
  );
}






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

const StatsTab = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [client, setClients] = useState([]);
  const [vendor, setVendors] = useState([]);
  const [commerciale, setCommerciales] = useState([]);
  const [selectedID,setSelectedID]=useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = useSelector((state) => state.global.role);
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  const handleCellClick = () => {
 
    setSidebarOpen(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch commerciale data
        const commercialeResponse = await axios.get(`${baseUrl}/api/commerciale.php`);
        const commercialeData = commercialeResponse.data.userData || [];

        // Fetch vendeur data
        const vendeurResponse = await axios.get(`${baseUrl}/api/vendeur.php`);
        const vendeurData = vendeurResponse.data.userDatas || [];
  
        // Fetch client data
        const clientResponse = await axios.get(`${baseUrl}/api/client.php`);
        const clientData = clientResponse.data.userDatar || [];
  
        // Set the data in state
        setClients(clientData);
        setVendors(vendeurData);
        setCommerciales(commercialeData);
     

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Extracting clients data
  const clients = client.map(clientData => ({
    id_client: clientData.id_client,
    nom: clientData.nom,
    prenom: clientData.prenom,
    localisation: clientData.localisation,
    id_vendeur: clientData.id_vendeur,
    montantTotal: parseFloat(clientData.total_montant_totale || 0), // Handle potential undefined or NaN values
  }));

  // Extracting vendors data
  const vendors = vendor.map(vendorData => ({
    id_vendeur: vendorData.id_vendeur,
    nom: vendorData.nom,
    prenom: vendorData.prenom,
    cin: vendorData.cin,
    date_naissance: vendorData.date_naissance,
    zone: vendorData.zone,
    adresse: vendorData.addresse,
    id_commerciale: vendorData.id_commerciale,
    email: vendorData.email,
  }));

  // Extracting commerciales data
  const commerciales = commerciale.filter(vendorData => vendorData.id_commerciale !== null)
    .map(vendorData => ({
      id_commerciale: vendorData.id_commerciale,
      cin: vendorData.cin,
      nom: vendorData.nom,
      prenom: vendorData.prenom,
      adresse: vendorData.addresse,
      date_naissance: vendorData.date_naissance,
      email: vendorData.email,
    }));

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clients.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTableData = () => {
    const tableData = [];

    for (const commerciale of commerciales) {
      const commercialeVendors = vendors.filter(
        (vendor) => vendor.id_commerciale === commerciale.id_commerciale
      );

      for (const vendor of commercialeVendors) {
        const vendorClients = clients.filter(
          (client) => client.id_vendeur === vendor.id_vendeur
        );

        const numRows = Math.max(commercialeVendors.length, vendorClients.length);
      
        for (let i = 0; i < numRows; i++) {
          const rowData = {
            id_commerciale: i === 0 ? commerciale.id_commerciale : null,
            nom_commerciale: i === 0 ? commerciale.nom : null,
            id_vendor: i === 0 ? vendor.id_vendeur : null,
            nom_vendor: i === 0 ? vendor.nom : null,
            id_client: i < vendorClients.length ? vendorClients[i].id_client : null,
            nom_client: i < vendorClients.length ? vendorClients[i].nom : null,
            montantTotal:i < vendorClients.length ? vendorClients[i].montantTotal : null,
          };
          tableData.push(rowData);
        }
      }
    }

    return tableData;
  };

  const tableData = getTableData();

  return (
<>
<TableContainer  component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>

<Table aria-label="custom pagination table">

     <TableBody>
     <TableCell align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}>ID Commerciale</TableCell>
         <TableCell align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}>Nom Commerciale</TableCell>
         <TableCell align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}>ID Vendor</TableCell>
         <TableCell align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}>Nom Vendeur</TableCell>
         <TableCell align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}>ID Client</TableCell>
         <TableCell align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}>Nom Client</TableCell>
         <TableCell align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}>Montant Total</TableCell>
       {tableData
         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
         .map((row, index) => (
           <TableRow key={index} hover>

             <TableCell align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}>{row.id_commerciale}</TableCell>
             <TableCell align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}>{row.nom_commerciale}</TableCell>
             <TableCell align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}>{row.id_vendor}</TableCell>
             <TableCell align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}>{row.nom_vendor}</TableCell>
             <TableCell onClick={()=>{setSelectedID(row.id_client);setSidebarOpen(true)}} align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}>{row.id_client}</TableCell>
             <TableCell align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}>{row.nom_client}</TableCell>
             <TableCell align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}>{row.montantTotal}</TableCell>

           </TableRow>
         ))}
       {emptyRows > 0 && (
         <TableRow style={{ height: 53 * emptyRows }}>
           <TableCell colSpan={6} />
         </TableRow>
       )}
     </TableBody>
   </Table>

   
   <TablePagination
 rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
     component="div"
     count={tableData.length}
     rowsPerPage={rowsPerPage}
     page={page}
     onPageChange={handleChangePage}
     onRowsPerPageChange={handleChangeRowsPerPage}
     ActionsComponent={TablePaginationActions}
   />
 </TableContainer>
 {selectedID && role==="manager"&& (
            <Sidebar rowData={selectedID} open={sidebarOpen} onClose={handleCloseSidebar}  />
          )}
</>
  );
};

export default StatsTab;
