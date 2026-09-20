import { Link } from 'react-router-dom'
import { Landmark, ArrowLeft, BadgeIndianRupee, ShieldCheck } from 'lucide-react'

export default function RefundPolicy() {
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
          <span className="eyebrow" style={{ color: 'var(--saffron)' }}><BadgeIndianRupee size={15} /> Service policy</span>
          <h1>Refund and payment reversal policy</h1>
          <p>Effective date: 8 September 2026</p>
        </div>
        <article className="policy-card">
          <div className="policy-notice">
            <ShieldCheck size={20} />
            <span><strong>Important:</strong> Kisan Setu is a procurement-management platform. It does not collect a registration fee from farmers through this application.</span>
          </div>
          <section><h2>1. Scope</h2><p>This policy explains how payment corrections and reversals are handled for procurement settlements recorded on Kisan Setu. It applies only to payments related to a completed procurement request.</p></section>
          <section><h2>2. No registration-fee refunds</h2><p>Farmer registration, request submission, token generation and queue tracking are provided without a platform payment. Therefore, no refund is applicable for these services.</p></section>
          <section><h2>3. Procurement payment corrections</h2><p>If a payment amount, status, bank reference, crop quantity or rate appears incorrect, the farmer should contact the assigned procurement centre with the request token and registered mobile number. An authorised officer will verify the procurement record before any correction is made.</p></section>
          <section><h2>4. Reversal and reprocessing</h2><p>Where a payment is failed, duplicated, incorrectly credited or reversed by the payment channel, the procurement centre may initiate a correction or reprocessing procedure after verification. Timelines depend on the authorised payment channel and bank processing time.</p></section>
          <section><h2>5. Eligibility</h2><p>A correction request must relate to a genuine completed procurement record in the farmer's account. Requests may be declined where the payment record is accurate, the request does not belong to the farmer, or the required verification details cannot be provided.</p></section>
          <section><h2>6. How to raise a request</h2><p>Visit the procurement centre or contact the support channel provided by your local authority. Keep your token number, registered mobile number, procurement centre, crop details and payment reference available.</p></section>
          <section><h2>7. Data protection</h2><p>Do not share passwords, OTPs, full Aadhaar details or bank PINs with anyone. Kisan Setu will never ask for those credentials through the application.</p></section>
        </article>
      </main>

      <footer className="portal-footer">
        <div className="portal-footer-inner">
          <div><strong>Kisan Setu</strong><p className="text-sm mt-8">Smart procurement services for India's farmers.</p></div>
          <div className="row text-sm"><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><Link to="/">Home</Link></div>
        </div>
      </footer>
    </div>
  )
}
