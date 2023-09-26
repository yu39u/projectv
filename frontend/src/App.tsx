import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "@/pages/About";
import Home from "@/pages/Home";
import PageNotFound from "@/pages/PageNotFound";
import { ChakraProvider } from "@chakra-ui/react";
import AlertDialogExa from "@/pages/AlertDialogExa";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="about" element={<About />} />
            <Route path="alert" element={<AlertDialogExa />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
