import Link from 'next/link'
import React from 'react'

const PolicySection = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="border-t border-coal/60 pt-6">
    <h6 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gold">{title}</h6>
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted">{children}</div>
  </div>
)

const PrivacyPolicy = (): React.ReactNode => (
  <div className="mx-auto max-w-2xl px-6 py-20">
    <div className="mb-14">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Legal</p>
      <h1 className="font-display text-4xl font-bold leading-tight text-cream sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">
        This Privacy Policy describes how your personal information is collected, used, and shared when you visit{' '}
        <Link className="text-cream transition-colors hover:text-gold" href="https://jokes.dbowland.com/">
          jokes.dbowland.com
        </Link>
        .
      </p>
    </div>

    <div className="flex flex-col gap-6">
      <PolicySection title="Personal Information We Collect">
        <p>
          When you visit the Site, we automatically collect certain information about your device, including information
          about your web browser, IP address, time zone, and some of the cookies that are installed on your device. We
          refer to this automatically-collected information as &ldquo;Device Information.&rdquo;
        </p>
        <p>We collect Device Information using the following technologies:</p>
        <ul className="flex flex-col gap-2 pl-0">
          {[
            [
              'Cookies',
              <>
                Data files placed on your device that often include an anonymous unique identifier. See{' '}
                <Link className="text-gold hover:underline" href="http://www.allaboutcookies.org">
                  allaboutcookies.org
                </Link>{' '}
                for more.
              </>,
            ],
            [
              'Log files',
              'Track actions on the Site, collecting IP address, browser type, ISP, referring/exit pages, and date/time stamps.',
            ],
          ].map(([term, def]) => (
            <li className="flex gap-3" key={String(term)}>
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-gold/40" />
              <span>
                <strong className="font-semibold text-cream">{term}</strong> — {def}
              </span>
            </li>
          ))}
        </ul>
      </PolicySection>

      <PolicySection title="How We Use Your Information">
        <p>
          We use the Device Information to help us screen for potential risk and fraud (in particular, your IP address),
          and to improve and optimize our Site.
        </p>
        <p>We do not share your Personal Information with third parties except in the extreme cases defined below.</p>
        <p>
          We may share your Personal Information to comply with applicable laws and regulations, to respond to a
          subpoena or other lawful request for information we receive, or to otherwise protect our rights.
        </p>
      </PolicySection>

      <PolicySection title="Do Not Track">
        <p>
          We do not alter our Site&apos;s data collection and use practices when we see a Do Not Track signal from your
          browser.
        </p>
      </PolicySection>

      <PolicySection title="Your Rights">
        <p>
          If you are a European resident, you have the right to access personal information we hold about you and to ask
          that your personal information be corrected, updated, or deleted. If you would like to exercise this right,
          please contact us through the contact information below.
        </p>
      </PolicySection>

      <PolicySection title="Data Retention">
        <p>We may maintain log files for up to 90 days. We do not collect or keep personal data.</p>
      </PolicySection>

      <PolicySection title="Minors">
        <p>The Site is not intended for individuals under the age of 18.</p>
      </PolicySection>

      <PolicySection title="Changes">
        <p>
          We may update this privacy policy from time to time to reflect changes to our practices or for other
          operational, legal, or regulatory reasons.
        </p>
      </PolicySection>

      <PolicySection title="Contact Us">
        <p>
          For questions about our privacy practices, please contact us at{' '}
          <Link className="text-gold hover:underline" href="mailto:privacy@dbowland.com">
            privacy@dbowland.com
          </Link>{' '}
          or by mail:
        </p>
        <p className="font-medium text-cream/70">
          dbowland.com Privacy Department
          <br />
          P.O. Box 81226, Seattle, WA 98108-1226
        </p>
      </PolicySection>
    </div>

    <div className="mt-14 border-t border-coal/60 pt-8">
      <Link
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-cream"
        href="/"
      >
        <span aria-hidden="true">←</span>
        Back to Punchline
      </Link>
    </div>
  </div>
)

export default PrivacyPolicy
