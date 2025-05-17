import { MultiSelect } from "@/components/MultiSelect";
import { FC } from "react";
const initialItems = [
  { id: "1", label: "Art" },
  { id: "2", label: "Sport" },
  { id: "3", label: "Games" },
];
const Home: FC = () => {
  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
          <h1>Science</h1>
          <MultiSelect initialItems={initialItems} placeholder={"Science"} />
        </div>
      </section>
    </>
  );
};

export default Home;
