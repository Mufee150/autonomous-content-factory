import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">{children}</div>
    </div>
  );
}
