import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Grid, Avatar, Chip, Divider, List, ListItem, ListItemText, ListItemAvatar, Collapse, IconButton, Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EuroIcon from '@mui/icons-material/Euro';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import logo from './image-removebg-preview (2).png'; // Make sure to add your logo file

const InfoCard = ({ icon, primary, secondary }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Avatar sx={{ width: 60, height: 60, mb: 2, bgcolor: 'primary.main' }}>{icon}</Avatar>
      <Typography variant="h6" gutterBottom>{primary}</Typography>
      <Typography variant="body2" color="text.secondary">{secondary}</Typography>
    </CardContent>
  </Card>
);
const LineItemCard = ({ ligne, theme }) => {
  const prix = typeof ligne.prix === 'number' ? ligne.prix : 0; // Ensure prix is a number
  console.log('this ligne of itemcard',ligne);
  
  return (
    <Card elevation={2} sx={{ mb: 2, backgroundColor: theme.palette.background.default }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <LocalOfferIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>Libeller : {ligne.libeller}</Typography>
              <Typography variant="h6" color="primary">
                {(prix * ligne.quantiter)} €
              </Typography>
            </Box>
            <Divider />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <EuroIcon color="secondary" sx={{ mr: 1, width: 20 }} />
              <Typography variant="body2">Prix_HT: {prix} €/unité</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <InventoryIcon color="action" sx={{ mr: 1, width: 20 }} />
              <Typography variant="body2">Quantité: {ligne.quantiter}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <ReceiptIcon color="error" sx={{ mr: 1, width: 20 }} />
              <Typography variant="body2">TVA: {(ligne.tva * 100)}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <CategoryIcon color="info" sx={{ mr: 1, width: 20 }} />
              <Typography variant="body2">Catégorie: {ligne.nom_categorie}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


const CommandItem = ({ command }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const totalAmount = useMemo(() => {
    return command.lignes.reduce((total, ligne) => total + ligne.prix * ligne.quantiter, 0);
  }, [command.lignes]);

  return (
    <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
      <ListItem alignItems="flex-start" sx={{ bgcolor: theme.palette.primary.light }}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}><ShoppingCartIcon /></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="h6">Commande #{command.idcommande || 'N/A'}</Typography>}
          secondary={<Typography variant="subtitle1" color="text.secondary">Montant total: {totalAmount} €</Typography>}
        />
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
          {command.lignes.map((ligne, index) => (
            
            
            < LineItemCard key={index} ligne={ligne} theme={theme} />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#3f51b5',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#3f51b5',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
});

// PDF Document Component
const MyDocument = ({ userInfos, groupedCommands, page }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.logo} src={logo} />
      <Text style={styles.header}>{page} Information</Text>
      <View style={styles.section}>
        <Text style={styles.subheader}>User Details</Text>
        {page === 'Fournisseur' ? (
          <>
            <Text style={styles.text}>Entreprise: {userInfos.nom_entreprise}</Text>
            <Text style={styles.text}>Email: {userInfos.email_contact}</Text>
            <Text style={styles.text}>Téléphone: {userInfos.telephone_contact}</Text>
          </>
        ) : (
          <>
            <Text style={styles.text}>Nom: {userInfos.nom}</Text>
            <Text style={styles.text}>Prénom: {userInfos.prenom}</Text>
            <Text style={styles.text}>Téléphone: {userInfos.telephone_client}</Text>
          </>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>Commandes</Text>
        {groupedCommands.map((command, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}>Commande #{command.idcommande || 'N/A'}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Produit</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Prix</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Quantité</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Total</Text>
                </View>
              </View>
              {command.lignes.map((ligne, lineIndex) => (
                <View style={styles.tableRow} key={lineIndex}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{ligne.libeller}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{ligne.prix} €</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{ligne.quantiter}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{(ligne.prix * ligne.quantiter)} €</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const SeeAllPage = () => {
  const location = useLocation();
  const { userInfos, userCommands, page } = location.state || {};
  const theme = useTheme();

  console.log('userInfos', userInfos);
  console.log('userCommands', userCommands);

  const groupedCommands = useMemo(() => {
    const grouped = {};
    userCommands.forEach(command => {
      if (!grouped[command.idcommande]) {
        grouped[command.idcommande] = {
          idcommande: command.idcommande,
          lignes: []
        };
      }
      grouped[command.idcommande].lignes.push(command);
    });
    return Object.values(grouped);
  }, [userCommands]);

  const renderUserInfo = () => {
    if (page === 'Fournisseur') {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <InfoCard icon={<BusinessIcon />} primary="Entreprise" secondary={userInfos.nom_entreprise} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard icon={<EmailIcon />} primary="Email" secondary={userInfos.email_contact} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard icon={<PhoneIcon />} primary="Téléphone" secondary={userInfos.telephone_contact} />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <InfoCard icon={<PersonIcon />} primary="Nom" secondary={userInfos.nom} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard icon={<PersonIcon />} primary="Prénom" secondary={userInfos.prenom} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard icon={<PhoneIcon />} primary="Téléphone" secondary={userInfos.telephone_client} />
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <Box sx={{ padding: theme.spacing(3), maxWidth: '1200px', margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          Information: <Chip label={page} color="primary" sx={{ ml: 2 }} />
        </Typography>
        <PDFDownloadLink
          document={<MyDocument userInfos={userInfos} groupedCommands={groupedCommands} page={page} />}
          fileName={`${page}_${userInfos.nom || userInfos.nom_entreprise}_resume.pdf`}
        >
          {({ blob, url, loading, error }) => (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              disabled={loading}
            >
              {loading ? 'Loading document...' : 'Generate PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </Box>
      
      {renderUserInfo()}
      
      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Commandes
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box>
        {groupedCommands.length > 0 ? (
          groupedCommands.map((command, index) => (
            <CommandItem key={index} command={command} />
          ))
        ) : (
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary, p: 2 }}>
            Aucune commande disponible
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SeeAllPage;