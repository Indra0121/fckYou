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

import { useState } from "react";
import { useDispatch } from "react-redux"; // Assuming you're using Redux
import { useNavigate } from "react-router-dom"; // For navigation

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { authenticateUser } from "../../../state";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onRequest, setOnRequest] = useState(false); // State for request status
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setOnRequest(true);

    dispatch(authenticateUser({ email, password }))
      .unwrap()
      .then(() => {
        console.log("Login successful");
        setOnRequest(false); // Stop loading indicator
        window.location.reload();

      })
      .catch((error) => {
        console.error("Login failed:", error);
        setOnRequest(false); // Stop loading indicator on error
      });
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              {/* Add any additional content here */}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput 
                type="email" 
                label="Email" 
                fullWidth 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // Capture email input
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput 
                type="password" 
                label="Password" 
                fullWidth 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} // Capture password input
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={onRequest}>
                {onRequest ? "Signing in..." : "Sign in"} {/* Button text changes based on request status */}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              {/* Add any additional content here */}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}



export default Basic;
