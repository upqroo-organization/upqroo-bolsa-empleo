import { prisma } from "@/lib/prisma";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type Props = {
  selectedName?: string;
  name?: string;
  icon?: React.ReactNode;
};

export default async function StateSelectServerSide({
  selectedName,
  name = "stateId",
}: Props) {
  const states = await prisma.state.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Ubicación
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          defaultValue={selectedName ?? ""}
          className={clsx(
            "appearance-none flex h-[3rem] w-full rounded-md border border-input bg-background",
            "px-3 pr-10 py-2 text-sm shadow-sm focus:outline-none",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
          >
          <option disabled value="">
            Ciudad, estado o localidad
          </option>
          {states.map((state) => (
            <option key={state.id} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2"
        />
      </div>
    </div>
  );
}
