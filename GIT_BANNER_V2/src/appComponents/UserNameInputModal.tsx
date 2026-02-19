import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router";
import { AppRoutes } from "../routes";
import { LightbulbIcon } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UserNameInputModal = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleCancleBtnClick = () => {
    setOpen(false);
    navigate(AppRoutes.Home);
  };

  const handleSubmit = () => {
    if (username.trim()) {
      // TODO: Handle username submission (e.g., save to context or fetch data)
      console.log("Username:", username);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[500px]"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Enter GitHub Username</DialogTitle>
          <DialogDescription>
            Please enter your GitHub username to generate your banner.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            id="username"
            placeholder="GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="py-5"
          />
        </div>

        <p className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
          <LightbulbIcon size={15} className="shrink-0" />
          <span>Tip: Turn on</span>
          <span className="underline">
            "Include private contributions on my profile"
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant={"secondary"}
            onClick={handleCancleBtnClick}
            className="hover:cursor-pointer py-5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="hover:cursor-pointer py-5"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserNameInputModal;
