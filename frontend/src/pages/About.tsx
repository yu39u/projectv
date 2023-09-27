import { trpc } from "@/utils/trpc";

const About: React.FC = () => {
  const userQuery = trpc.userById.useQuery("yo");
  const userCreator = trpc.userCreate.useMutation();

  return (
    <>
      <p>{userQuery.data?.email}</p>
      <div>About Page</div>
      <button
        onClick={() =>
          userCreator.mutate({
            publicId: "frodo",
            email: "frodo@email.com",
            password: "testpass",
          })
        }
      >
        Create Frodo
      </button>
    </>
  );
};
export default About;
