import { useEffect, useRef, useState } from "react";
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
import { LightbulbIcon, LoaderCircle } from "lucide-react";
import { validateUsername } from "../api/banner";
import { useDashboard } from "../context/DashboardContext";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UserNameInputModal = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();
  const { username: savedUsername, setUsername } = useDashboard();
  const [input, setInput] = useState<string>(savedUsername);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setInput(savedUsername);
    setError(null);
  }, [open, savedUsername]);

  const handleCancel = () => {
    abortRef.current?.abort();
    setOpen(false);
    navigate(AppRoutes.Home);
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setIsValidating(true);

    const err = await validateUsername(trimmed, controller.signal);

    setIsValidating(false);

    if (err) {
      setError(err);
      return;
    }

    setUsername(trimmed);
    setOpen(false);
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
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className={`py-5 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
            disabled={isValidating}
            autoComplete="off"
          />
          {error && (
            <p className="text-xs text-destructive -mt-2">{error}</p>
          )}
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
            variant="secondary"
            onClick={handleCancel}
            disabled={isValidating}
            className="hover:cursor-pointer py-5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!input.trim() || isValidating}
            className="hover:cursor-pointer py-5"
          >
            {isValidating ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserNameInputModal;
