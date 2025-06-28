import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { UserProvider } from "../contexts/UserContext";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Navbar />
      <main className="pt-16">
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
}
