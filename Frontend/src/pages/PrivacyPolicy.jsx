import { Link } from 'react-router-dom'
import { ArrowLeft, Landmark, ShieldCheck } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div>
      <div className="tricolor-rule" />
      <header className="public-header">
        <div className="public-nav">
          <Link className="public-brand" to="/">
            <span className="brand-mark"><Landmark size={22} /></span>
            <span><strong>Kisan Setu</strong><span>Smart procurement platform</span></span>
          </Link>
          <Link className="btn btn-outline" to="/"><ArrowLeft size={16} /> Back to home</Link>
        </div>
      </header>
      <main className="policy-page">
        <div className="policy-heading">
          <span className="eyebrow" style={{ color: 'var(--saffron)' }}><ShieldCheck size={15} /> Privacy policy</span>
          <h1>Privacy policy</h1>
          <p>Effective date: 20 September 2026</p>
        </div>
        <article className="policy-card">
          <section><h2>1. Information used by the app</h2><p>The current project stores account, farmer profile, procurement request, queue, notification and payment record data needed to run the procurement workflow.</p></section>
          <section><h2>2. Authentication data</h2><p>Passwords are hashed in the backend. The frontend stores the signed-in user's token and basic user object in browser localStorage so the session can continue after refresh.</p></section>
          <section><h2>3. Operational access</h2><p>Farmers can view their own procurement data where ownership checks exist. Officers and administrators can access operational records needed for procurement management.</p></section>
          <section><h2>4. External services</h2><p>No verified SMS, email, voice-call, payment gateway, analytics or file-storage integration exists in the current repository.</p></section>
          <section><h2>5. Sensitive information</h2><p>Do not share passwords, OTPs, Aadhaar details, bank PINs or private credentials through this application.</p></section>
          <section><h2>6. Contact</h2><p>For corrections to procurement or payment records, contact the authorised procurement centre with your token number and registered mobile number.</p></section>
        </article>
      </main>
      <footer className="portal-footer"><div className="portal-footer-inner"><strong>Kisan Setu</strong><div className="row text-sm"><Link to="/terms">Terms</Link><Link to="/refund-policy">Refund policy</Link></div></div></footer>
    </div>
  )
}
