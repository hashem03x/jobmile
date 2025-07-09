import AppContainer from "../../ui/AppContainer";
import Jobs from "../../ui/Jobs";
function CandidateDashboard() {
  return (
    <div>
      <AppContainer user={"candidate"}>
        <Jobs />
      </AppContainer>
    </div>
  );
}

export default CandidateDashboard;
