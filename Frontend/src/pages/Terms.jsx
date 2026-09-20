import { Link } from 'react-router-dom'
import { ArrowLeft, Landmark, ShieldCheck } from 'lucide-react'

export default function Terms() {
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
          <span className="eyebrow" style={{ color: 'var(--saffron)' }}><ShieldCheck size={15} /> Terms of service</span>
          <h1>Terms of service</h1>
          <p>Effective date: 20 September 2026</p>
        </div>
        <article className="policy-card">
          <section><h2>1. Purpose</h2><p>Kisan Setu helps farmers and procurement staff manage crop procurement requests, queue information, operational status, notifications and payment records.</p></section>
          <section><h2>2. Accounts</h2><p>Users are responsible for keeping their mobile number and password secure. Staff access must only be used by authorised officers and administrators.</p></section>
          <section><h2>3. Procurement records</h2><p>Information shown in the application depends on records entered by farmers, officers and administrators. Final eligibility, crop quality, accepted weight and settlement are confirmed by the authorised procurement centre.</p></section>
          <section><h2>4. Payments</h2><p>The application records procurement payment status. It does not act as a public payment gateway in the current implementation.</p></section>
          <section><h2>5. Acceptable use</h2><p>Users must not submit false records, access another user's information without permission, or attempt to bypass role-based access controls.</p></section>
          <section><h2>6. Changes</h2><p>These terms may be updated when the procurement workflow or connected services change.</p></section>
        </article>
      </main>
      <footer className="portal-footer"><div className="portal-footer-inner"><strong>Kisan Setu</strong><div className="row text-sm"><Link to="/privacy">Privacy</Link><Link to="/refund-policy">Refund policy</Link></div></div></footer>
    </div>
  )
}
