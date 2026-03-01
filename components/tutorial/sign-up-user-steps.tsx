import Link from "next/link";
import { TutorialStep } from "./tutorial-step";
import { ArrowUpRight } from "lucide-react";

export function SignUpUserSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Sign up to join">
        <p>
          Head over to the{" "}
          <Link
            href="auth/sign-up"
            className="font-bold hover:underline text-foreground/80"
          >
            Sign up
          </Link>{" "}
          page and join this awesome group of enthusiast.
        </p>
      </TutorialStep>
      <TutorialStep title="Already a team member">
        <p>
          Head over to the{" "}
          <Link
            href="auth/login"
            className="font-bold hover:underline text-foreground/80"
          >
            Sign in
          </Link>{" "}
          page and enjoy!
        </p>
      </TutorialStep>
    </ol>
  );
}
