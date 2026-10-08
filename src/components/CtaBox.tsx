import { useTranslations } from "next-intl";
import { Reveal } from "./motion/Reveal";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { WindowsIcon } from "./ui/icons";

// Closing call to action shared by Features and Home: a title, one line and
// the two main actions (Download page, Docs).
export default function CtaBox({ title, body }: { title: string; body: string }) {
  const download = useTranslations("download");
  const cta = useTranslations("cta");

  return (
    <Container className="py-24">
      <Reveal
        effect="focus"
        className="flex flex-col items-center rounded-[20px] border border-line bg-panel px-8 py-16 text-center"
      >
        <h2 className="max-w-[620px] text-section font-semibold text-text">
          {title}
        </h2>
        <p className="mt-4 max-w-[520px] text-lead text-muted">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/download">
            <WindowsIcon />
            {download("downloadButton")}
          </Button>
          <Button href="/docs" variant="inset">
            {cta("docs")}
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}
