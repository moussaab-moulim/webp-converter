import { ConverterForm } from "@/components/ConverterForm";
import { NavBar } from "@/components/NavBar";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";


const Home = async () => {
  const session = await getSession();

  return (
    <main>
      <NavBar name = {session?.user.name}/>
      <ConverterForm/>
    </main>
  );
};

export default withPageAuthRequired(Home, { returnTo: '/' }) ;
