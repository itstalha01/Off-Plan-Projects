import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Privacy Policy | Clearstoreys",
  description:
    "How Clearstoreys collects, uses and protects information from website enquiries, WhatsApp and social media lead forms, including Facebook and Instagram.",
  alternates: { canonical: "https://clearstoreys.com/privacy-policy" },
};

const sections = [
  {
    id: "scope",
    title: "Who we are and when this policy applies",
    paragraphs: [
      "Clearstoreys operates clearstoreys.com, a property discovery and enquiry service for off-plan projects in Pakistan. This policy explains how we handle personal information when you use our website, submit an online enquiry or social media lead form, or contact us about a property.",
      "It applies to enquiries received through Facebook, Instagram and other social media platforms, online advertising, website forms, WhatsApp, email and phone. If an enquiry is addressed directly to a partner agency, that agency also handles your information under its own privacy practices.",
    ],
  },
  {
    id: "information",
    title: "Information we collect",
    paragraphs: [
      "Depending on what you choose to provide, we may receive your name, phone or WhatsApp number, email address, city, preferred location, property type, budget range, purchase timeline and the contents of your enquiry or messages. Social media forms may prefill contact details from your platform profile; we receive the details you submit to us.",
      "Our website and service providers may also process technical information such as your IP address, browser and device information, pages visited, referral source and interactions with an advertisement or enquiry button. Please do not send identity documents, bank details or other sensitive information through an initial enquiry or social media lead form.",
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    paragraphs: [
      "We use enquiry information to respond to you, understand your property requirements, suggest relevant projects, provide prices and payment plans, arrange calls or viewings, and keep a record of our conversations. We may contact you using the details you provide, including by phone, WhatsApp or email, in connection with your enquiry.",
      "Where you opt in to promotional updates, we may also send relevant property news or offers. You can ask us to stop promotional messages at any time. We also use technical information to operate and secure our services, troubleshoot problems and understand the performance of our website and campaigns. Where consent is required for a particular activity, we will ask for it.",
    ],
  },
  {
    id: "social-media",
    title: "Facebook, Instagram and other social media lead forms",
    paragraphs: [
      "When you submit a Clearstoreys lead form on Facebook or Instagram, Meta provides us with the information you submit so we can follow up on the property enquiry described in the form or advertisement. The same principle applies to enquiries submitted through other social media platforms.",
      "We use this information for the purposes explained in this policy and any notices or choices shown on the form. Submitting an enquiry does not sign you up for unrelated marketing. We do not sell lead information. Meta and other platforms separately process information under their own privacy policies; this policy describes Clearstoreys’ handling of the information we receive.",
    ],
  },
  {
    id: "sharing",
    title: "When we share information",
    paragraphs: [
      "Your information may be accessed by authorised Clearstoreys team members and service providers that support hosting, communication, enquiry management and campaign measurement, as needed to provide those services.",
      "If your enquiry requires an introduction to a developer, project sales team or partner agency, we will ask for your permission before passing your contact details to them, unless you have already explicitly requested that introduction. We may also disclose information where required by law or necessary to protect rights, prevent fraud or address security issues. We do not sell or rent your personal information.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies, advertising and external services",
    paragraphs: [
      "Our services use cookies where needed for functions such as secure sign-in. Campaign pages may load Google Ads conversion tracking when configured, which can use cookies or similar technologies to measure visits and enquiry-button interactions. You can manage cookies through your browser and advertising preferences through the relevant platform. Where required, optional tracking is subject to your consent.",
      "Our current website enquiry form prepares a WhatsApp message from the details you enter. Opening the chat does not send the message automatically; you choose whether to send it in WhatsApp. External services, including WhatsApp, Meta and Google, process information under their own privacy policies. Links to partner or developer websites are also subject to those sites’ policies.",
    ],
  },
  {
    id: "retention",
    title: "Retention, storage and security",
    paragraphs: [
      "We keep personal information only for as long as needed to respond to your enquiry, provide requested services, maintain necessary business records or meet legal obligations. The period depends on the nature of your enquiry and our ongoing relationship. When information is no longer needed, we delete it or anonymise it, subject to any required retention.",
      "We take reasonable steps to restrict access and protect information against unauthorised access, loss or misuse. No online service or communication method is completely secure. Our hosting, communication and other providers may process information outside Pakistan; where applicable, we use safeguards required for those transfers.",
    ],
  },
  {
    id: "choices",
    title: "Your choices and privacy requests",
    paragraphs: [
      "You can choose not to provide optional information. You can ask us what personal information we hold about you, request a correction or deletion, withdraw consent where processing relies on consent, or ask us to stop contacting you for marketing. Depending on applicable law, you may have additional rights to restrict or object to processing or obtain a copy of your information.",
      "Contact us using the WhatsApp link below and describe your request. For marketing messages, you can also reply ‘STOP’ or ask the advisor to stop. We may need to verify your identity before acting on an information request, and some records may need to be retained for legal reasons. Requests about information held independently by Meta, another platform or a partner should also be directed to that organisation.",
    ],
  },
  {
    id: "children",
    title: "Children’s information",
    paragraphs: [
      "Our property enquiry services are intended for adults. We do not knowingly collect personal information from children under 18. If you believe a child has provided information to us, please contact us so we can review and delete it as appropriate.",
    ],
  },
  {
    id: "updates",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy as our services or information practices change. The latest version will appear on this page with its updated date. Where required, we will provide additional notice or request fresh consent for material changes.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" aria-label="Clearstoreys home">
            <Logo className="flex items-center gap-2.5" />
          </Link>
          <Link href="/" className="text-sm font-semibold underline-offset-4 hover:underline">
            Back to projects
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">
          Clearstoreys · Your information
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
          Privacy policy<span className="text-gold">.</span>
        </h1>
        <p className="mt-4 text-sm text-ink/70">
          Last updated: <time dateTime="2026-11-05">5 November 2026</time>
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
          When you enquire about a property, you trust us with your details.
          Here is what we collect, how we use it and how you can stay in control.
        </p>

        <nav aria-label="Privacy policy sections" className="mt-10 rounded-2xl border border-ink/10 bg-cream/50 p-6">
          <p className="text-sm font-semibold">On this page</p>
          <ol className="mt-4 grid list-inside list-decimal gap-3 text-sm sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="underline-offset-4 hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="underline-offset-4 hover:underline">Contact us</a>
            </li>
          </ol>
        </nav>

        <article className="mt-12 space-y-10">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-8">
              <h2 id={`${section.id}-title`} className="font-serif text-2xl font-semibold">
                {index + 1}. {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-7 text-ink/80">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section id="contact" aria-labelledby="contact-title" className="scroll-mt-8 rounded-2xl border border-ink/10 bg-cream/50 p-6 sm:p-8">
            <h2 id="contact-title" className="font-serif text-2xl font-semibold">
              {sections.length + 1}. Contact us
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/80">
              For a privacy question, deletion request or marketing opt-out,
              contact Clearstoreys on WhatsApp at{" "}
              <a href={whatsappLink("Hi Clearstoreys, I have a privacy request.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-4">
                +92 329 7748627
              </a>
              . Please mention that your message concerns privacy and tell us
              which enquiry or contact details your request relates to.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
