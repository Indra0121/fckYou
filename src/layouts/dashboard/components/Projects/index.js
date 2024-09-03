import { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

const baseUrl = process.env.REACT_APP_API_URL;

function Projects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/getfirstpage.php`);
        setData(response.data.userDataf);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error); 
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { Header: "ID Payment", accessor: "id_paiement", width: "10%" },
    { Header: "ID Bon Livraison", accessor: "id_bonlivraison", width: "15%" },
    { Header: "ID Livreur", accessor: "id_livreur", width: "10%" },
    { Header: "Montant Totale", accessor: "montant_totale", width: "10%" },
    { Header: "Montant Payer", accessor: "montant_payer", width: "10%" },
    { Header: "Moyen Paiement", accessor: "moyen_paiement", width: "10%" },
    { Header: "ID Client", accessor: "id_client", width: "10%" },
    { Header: "Nom Client", accessor: "nom_client", width: "10%" },
    { Header: "Prenom Client", accessor: "prenom_client", width: "10%" },
    { Header: "Date Paiement", accessor: "date_paiement", width: "10%" },
    { Header: "Telephone Client", accessor: "telephone_client", width: "10%" },
  ];

  const rows = data.map((row) => ({
    id_paiement: row.id_paiement,
    id_bonlivraison: row.id_bonlivraison,
    id_livreur: row.id_livreur,
    montant_totale: row.montant_totale,
    montant_payer: row.montant_payer,
    moyen_paiement: row.moyen_paiement,
    id_client: row.id_client,
    nom_client: row.nom_client,
    prenom_client: row.prenom_client,
    date_paiement: row.date_paiement,
    telephone_client: row.telephone_client,
  }));

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);



  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Projects
          </MDTypography>
        
        </MDBox>
        
        
       
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
          loading={loading}
        />
      </MDBox>
    </Card>
  );
}

export default Projects;
