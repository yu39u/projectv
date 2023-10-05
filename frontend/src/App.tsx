import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "@/pages/About";
import Home from "@/pages/Home";
import PageNotFound from "@/pages/PageNotFound";
import { ChakraProvider } from "@chakra-ui/react";
import AlertDialogExa from "@/pages/AlertDialogExa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "./utils/trpc";
import Signup from "@/pages/Signup";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Router>
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
                <Route path="about" element={<About />} />
                <Route path="alert" element={<AlertDialogExa />} />
                <Route path="signup" element={<Signup />} />
              </Route>
            </Routes>
          </Router>
        </ChakraProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
