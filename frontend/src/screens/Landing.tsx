import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex-justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQstmH9nYTPqXc7Ns3MDo4PfswrdYinKICr_g&s"
              className="max-w-96]"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              Play Chess Online #1 Site
            </h1>
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => {
                  navigate("/game");
                }}
              >
                PLay Online
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
