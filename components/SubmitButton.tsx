import Image from "next/image";

import { Button } from "./ui/button";
import { ButtonProps } from "@/interface";
import { Icons } from "@/public/assets/icons";

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap4">
          <Icons.Loader className="animate-spin text-white" />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
