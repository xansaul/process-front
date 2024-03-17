import { ProcessesProvider } from "./context";
import { ProcessesView } from "./views/ProcessesView";

function App() {
  return (
    <>
      <ProcessesProvider>
        <ProcessesView />
      </ProcessesProvider>
    </>
  );
}

export default App;
