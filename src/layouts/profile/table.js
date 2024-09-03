import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from "@mui/material/styles";
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
import { useEffect, useState } from 'react';
import { Button, Typography, Grid, Slide, Divider, Avatar, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

const baseUrl = process.env.REACT_APP_API_URL;

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

function CustomTable({ data, title, animationDelay, onCellClick }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
<>
    <Typography variant="h4" sx={{ marginBottom: '20px' }}>{title}</Typography>
      {data.length > 0 ? (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table aria-label="custom pagination table">
        
            <TableBody>
            <TableRow>
                {Object.keys(data[0] || {}).map((key) => (
                  <TableCell
                    key={key}
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                    }}
                  >
                    {key}
                  </TableCell>
                ))}
              </TableRow>
              {(rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((row, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  {Object.entries(row).map(([key, value], cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                      onClick={() => onCellClick(row, key)}
                    >
                      {key === 'Name' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ marginRight: '10px' }}>{value.charAt(0)}</Avatar>
                          {value}
                        </Box>
                      ) : key === 'Status' ? (
                        <Box
                          sx={{
                            backgroundColor: value.toLowerCase() === 'active' ? '#e8f5e9' : '#ffebee',
                            color: value.toLowerCase() === 'active' ? '#4caf50' : '#f44336',
                            borderRadius: '16px',
                            padding: '4px 8px',
                            display: 'inline-block',
                          }}
                        >
                          {value}
                        </Box>
                      ) : (
                        value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={Object.keys(data[0] || {}).length} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={Object.keys(data[0] || {}).length}
                  count={data.length}
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
      ) : (
        <Typography variant="body1" sx={{ marginLeft: '1vh', mt: 5 }}>No data available</Typography>
      )}
</>
    );
}

CustomTable.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  animationDelay: PropTypes.number.isRequired,
  onCellClick: PropTypes.func.isRequired,
};

function Sidebar({ rowData, open, onClose }) {
  const [userCommands, setUserCommands] = useState([]);
  const [userInfos, setUserInfos] = useState({});
  const [loading, setLoading] = useState(true);
  const page = 'Fournisseur';
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${baseUrl}/api/fournisseurinfoswithcommands.php`, {
          user_id: rowData.id_fournisseur || 1
        });
        if (response.data && response.data.userinfos && response.data.usercommands) {
          setUserCommands(response.data.usercommands || []);
          setUserInfos(response.data.userinfos[0] || {});
        } else {
          setUserCommands([]);
          setUserInfos({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setUserCommands([]);
        setUserInfos({});
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, rowData]);

  const renderCommandSummary = (commands) => {
    const summaries = commands.reduce((acc, command) => {
      const { idcommande, montant_totale } = command;
      if (!acc[idcommande]) {
        acc[idcommande] = { montant_totale, count: 0 };
      }
      acc[idcommande].count += 1;
      return acc;
    }, {});

    const limitedSummaries = Object.entries(summaries).slice(0, 2);

    return limitedSummaries.map(([idcommande, summary]) => (
      <Box key={idcommande} sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="subtitle2" color="primary"><strong>Commande #{idcommande}</strong></Typography>
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
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <KeyboardArrowRight />
        </IconButton>
        
        <Typography variant="h5" sx={{ marginBottom: '20px', color: theme.palette.primary.main }}>
          Informations fournisseurs
        </Typography>
        
        {loading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : (
          <>
            {userInfos && (
              <Box sx={{ 
                marginBottom: '20px', 
                backgroundColor: theme.palette.background.paper,
                borderRadius: '12px', 
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <Avatar sx={{ width: 60, height: 60, marginRight: '15px', backgroundColor: theme.palette.primary.main }}>
                    {userInfos.nom_entreprise ? userInfos.nom_entreprise.charAt(0).toUpperCase() : 'F'}
                  </Avatar>
                  <Typography variant="h6">{userInfos.nom_entreprise}</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={userInfos.nom_entreprise} secondary="Entreprise" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={userInfos.email_contact} secondary="Email" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={userInfos.telephone_contact} secondary="Téléphone" />
                  </ListItem>
                </List>
              </Box>
            )}

            <Divider sx={{ margin: '20px 0' }} />
            
            <Typography variant="h6" sx={{ marginBottom: '15px', color: theme.palette.primary.main }}>
              <ShoppingCartIcon sx={{ verticalAlign: 'middle', marginRight: '10px' }} />
              Informations Commandes
            </Typography>
            
            <Box>
              {userCommands && userCommands.length > 0 ? (
                renderCommandSummary(userCommands)
              ) : (
                <Typography variant="body2">No data available</Typography>
              )}
              {userInfos && userCommands && (
                <Button 
                  variant="contained" 
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
                  Voir tout
                </Button>
              )}
            </Box>
          </>
        )}
</Box>
    </Slide>
  );
}

function TablePaid() {
  const [data, setData] = React.useState([]);
  const [data2, setData2] = React.useState([]);
  const [chosen, setChosen] = React.useState([]);
  const [titre, setTitre] = React.useState('Commande Validé');
  const [data3, setData3] = React.useState([]);
  const [goback, setGoback] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [clickedColumn, setClickedColumn] = React.useState(null);

  const role = "manager";
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(`${baseUrl}/api/commandevalider.php`);
        setData(response1.data.commandevalider || []);

        if (role === 'manager') {
          const response2 = await axios.get(`${baseUrl}/api/commandeencours.php`);
          const response3 = await axios.get(`${baseUrl}/api/commandenretard.php`); 
          setData2(response2.data.commandeencours || []);
          setData3(response3.data.commandeenretard || []);
          setChosen(response1.data.commandevalider || []);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const handleCellClick = (value, column) => {
    setSelectedRowData(value);
    setClickedColumn(column);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      {role === 'comptable' && (
        <CustomTable data={data} title="Commande Valider" animationDelay={1} onCellClick={handleCellClick} />
      )}
      {role === 'manager' && (
        <>
          <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
            <Grid item>
              <Button
                variant="contained"
                color='success'
                onClick={() => {
                  setGoback(!goback);
                  setChosen(goback ? data3 : data2);
                  setTitre(goback ? "Commande en retard" : "Commande en Cours");
                }}
              >
                {goback ? "Commande non valider" : "Commande en Cours"}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setGoback(false);
                  setChosen(data);
                  setTitre("Commande Valider");
                }}
              >
                Commande valider
              </Button>
            </Grid>
          </Grid>
          <CustomTable data={chosen} title={titre} animationDelay={0.5} onCellClick={handleCellClick} />
          {selectedRowData && (
            <Sidebar 
              rowData={selectedRowData} 
              open={sidebarOpen} 
              onClose={handleCloseSidebar} 
              column={clickedColumn} 
            />
          )}
        </>
      )}
    </Box>
  );
}

export default TablePaid;