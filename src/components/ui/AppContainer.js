import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CandidateHomeSideBar from "./CandidateHomeSideBar";
import { Container } from "react-bootstrap";

function AppContainer({ user, children }) {
  console.log(user);
  return (
    <Box sx={{ flexGrow: 1, pt: 8, pb: 4, px: { xs: 1, sm: 2, md: 4 } }}>
      <Container fluid>
        {user === "candidate" && <CandidateHomeSideBar />}
      </Container>
      <Grid container>
        <Grid item>
          {/* Jobs content */}
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppContainer;
