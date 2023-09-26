import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <>
      <div>Home Page</div>
      <Link to={"/about"}>About page</Link>
    </>
  );
};
export default Home;
