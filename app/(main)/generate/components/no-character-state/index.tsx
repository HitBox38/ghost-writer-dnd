import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const NoCharacterState = () => {
  return (
    <section className="onboarding">
      <h1>Every character has a voice.</h1>
      <p>
        Give yours a name, a little history, and a point of view. Then find the words for their next
        great—or ill-advised—moment.
      </p>
      <Link href="/characters/new" className="primary-link">
        Create your first character <ArrowRight size={18} />
      </Link>
      <p className="field-help">
        Your characters and saved lines stay in this browser. Export a backup from Settings to keep
        a copy.
      </p>
    </section>
  );
};
