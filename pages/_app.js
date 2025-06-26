import '../styles/globals.css';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Footer from "../components/footer";

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
      <Footer />
    </>
  );
}
