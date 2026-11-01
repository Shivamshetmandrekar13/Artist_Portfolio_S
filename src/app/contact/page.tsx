import type { Metadata } from "next";
import ExpandPage, { ExpandHeading, SERIF } from "@/components/ExpandPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Aryan Mehta for commissions, collaborations, and inquiries.",
};

const EMAIL = "aryan@fineart.com";

const CHANNELS = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "Instagram", value: "Follow the studio", href: "https://instagram.com" },
  { label: "Studio", value: "Bandra, Mumbai", note: "Visits by appointment" },
];

export default function ContactPage() {
  return (
    <ExpandPage
      src="https://images.unsplash.com/photo-1452802447250-470a88ac82bc?auto=format&fit=crop&w=2400&q=80"
      alt="A well-used paint palette full of colour"
      eyebrow="Get In Touch"
      title="Contact"
      scrollHint="Scroll to say hello"
    >
      <ExpandHeading eyebrow="Commissions · Collaborations · Enquiries">
        Let&rsquo;s make something together.
      </ExpandHeading>

      <p className="mt-6 max-w-2xl text-[clamp(0.95rem,1.4vw,1.125rem)] leading-relaxed text-white/85">
        Tell me about the piece you have in mind, a workshop you&rsquo;d like to join, or a space that needs
        art. I read and reply to every message personally.
      </p>

      <dl className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-6 border-t border-white/20 pt-6 sm:grid-cols-3">
        {CHANNELS.map(({ label, value, href, note }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">{label}</dt>
            <dd className="text-[clamp(1.1rem,2vw,1.5rem)] font-light" style={{ fontFamily: SERIF }}>
              {href ? (
                <a
                  href={href}
                  className="border-b border-white/30 transition-colors hover:border-white"
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
            {note && <dd className="text-xs text-white/60">{note}</dd>}
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a href={`mailto:${EMAIL}?subject=Commission%20enquiry`} className="btn btn-primary">
          Email the Studio
        </a>
      </div>
    </ExpandPage>
  );
}
