import { trpc } from "@/utils/trpc";

const About: React.FC = () => {
  const userQuery = trpc.userById.useQuery("yo");
  return (
    <>
      <p>{userQuery.data?.email}</p>
      <div>About Page</div>
    </>
  );
};
export default About;
