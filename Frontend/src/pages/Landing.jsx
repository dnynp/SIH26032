import { Link } from 'react-router-dom'
import {
  Landmark,
  Sprout,
  Ticket,
  Clock3,
  IndianRupee,
  ShieldCheck,
  MapPin,
  Phone,
  ArrowRight,
  Users,
  ClipboardList,
  BellRing,
  LockKeyhole,
  Bot,
  Volume2,
} from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'

const problems = [
  { icon: Clock3, title: 'Long waiting', text: 'Farmers may have to wait at the procurement centre without knowing when their turn will come.' },
  { icon: Ticket, title: 'No clear queue information', text: 'Without clear token and queue information, it is difficult to plan the right time to reach the centre.' },
  { icon: IndianRupee, title: 'Payment uncertainty', text: 'Farmers need a simple way to know the status of their procurement and payment.' },
]

const journey = [
  [Sprout, 'Register your produce', 'Enter your crop, quantity and preferred procurement centre.'],
  [Ticket, 'Get your token', 'Receive a unique token for transparent processing at the centre.'],
  [Users, 'Know your turn', 'Check farmers ahead of you and the estimated waiting time.'],
  [Clock3, 'Plan your arrival', 'Use the recommended arrival time to avoid unnecessary waiting.'],
  [ClipboardList, 'Track procurement', 'Follow your request through each procurement stage.'],
  [IndianRupee, 'Track your payment', 'See your payment amount and settlement status in one account.'],
]

const reasons = [
  [Ticket, 'Clear token', 'Know your unique procurement token.'],
  [Users, 'Queue visibility', 'See how many farmers are ahead of you.'],
  [Clock3, 'Better planning', 'Know when to reach the centre.'],
  [ClipboardList, 'Live status', 'Follow procurement at every stage.'],
  [IndianRupee, 'Payment transparency', 'Track payment status in one place.'],
  [BellRing, 'Timely updates', 'Receive important procurement updates.'],
]

const prices = [
  ['Tur (Arhar)', 'Rs 8,450'],
  ['Moong', 'Rs 8,780'],
  ['Urad', 'Rs 8,200'],
  ['Groundnut', 'Rs 7,517'],
  ['Soyabean', 'Rs 5,708'],
]

export default function Landing() {
  return (
    <div className="landing">
      <div className="tricolor-rule" />
      <header className="public-header">
        <div className="public-utility">
          <span>Government procurement service for farmers</span>
          <span>Helpline: 1800-111-622 &nbsp; | &nbsp; <LanguageSwitcher /></span>
        </div>
        <div className="public-nav">
          <Link className="public-brand" to="/">
            <span className="brand-mark"><Landmark size={22} /></span>
            <span><strong>Kisan Setu</strong><span>Farmer procurement service</span></span>
          </Link>
          <div className="public-actions">
            <Link className="btn btn-outline" to="/login">Sign in</Link>
            <Link className="btn btn-primary" to="/register">Register produce <ArrowRight size={15} /></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="portal-hero">
          <div className="portal-hero-inner">
            <div className="eyebrow"><ShieldCheck size={15} /> Transparent, timely farmer service</div>
            <h1>Know your turn.<br />Plan your visit.<br /><em>Get paid with confidence.</em></h1>
            <p>Kisan Setu helps farmers manage their procurement journey in one simple place. Register your produce, get a token, check your queue, know when to reach the centre, and track your payment.</p>
            <div className="row mt-24">
              <Link to="/register" className="btn btn-primary">Register your produce <ArrowRight size={16} /></Link>
              <Link to="/login" className="btn hero-secondary">Track my request</Link>
            </div>
          </div>
        </section>

        <section className="portal-strip">
          <div className="portal-strip-grid">
            <div className="portal-strip-item"><MapPin /><span><strong>Centre-wise queue</strong><br /><small>Plan your arrival with confidence</small></span></div>
            <div className="portal-strip-item"><ClipboardList /><span><strong>Live status tracking</strong><br /><small>Every procurement stage is visible</small></span></div>
            <div className="portal-strip-item"><IndianRupee /><span><strong>Payment transparency</strong><br /><small>Track amount and settlement status</small></span></div>
          </div>
        </section>

        <section className="portal-section">
          <div className="section-kicker">The problem farmers face</div>
          <h2 className="section-heading">A procurement visit should not mean a day of uncertainty.</h2>
          <p className="section-copy">Farmers often travel to centres without knowing how long they will wait, when their turn will come, or what is happening with procurement and payment.</p>
          <div className="grid mt-24">
            {problems.map(({ icon: Icon, title, text }) => <article className="problem-card" key={title}><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="journey-section">
          <div className="portal-section">
            <div className="section-kicker">One platform, one journey</div>
            <h2 className="section-heading">From your farm to your payment.</h2>
            <p className="section-copy">Kisan Setu brings the important information farmers need into one place, from registration to payment.</p>
            <div className="journey-grid mt-24">
              {journey.map(([Icon, title, text], index) => <article className="journey-card" key={title}><span className="step-no">0{index + 1}</span><div className="journey-icon"><Icon size={21} /></div><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="farmer-focus">
          <div className="farmer-focus-inner">
            <div>
              <div className="section-kicker">Before you leave home</div>
              <h2 className="section-heading">Know what is happening at the centre.</h2>
              <p className="section-copy">No need to guess when your turn will come. See your token, queue position, estimated wait and procurement status before you travel.</p>
              <Link to="/login" className="btn btn-primary mt-24">View my queue <ArrowRight size={15} /></Link>
            </div>
            <div className="procurement-preview">
              <span className="preview-label">Your procurement</span>
              <div className="preview-crop"><Sprout /> <span><strong>Wheat</strong><small>500 kg</small></span><span className="badge badge-scheduled">Scheduled</span></div>
              <div className="preview-grid">
                <div><small>Token</small><strong>#27</strong></div>
                <div><small>Farmers ahead</small><strong>4</strong></div>
                <div><small>Estimated wait</small><strong>40 min</strong></div>
                <div><small>Recommended arrival</small><strong>10:20 AM</strong></div>
              </div>
              <Link to="/login" className="preview-link">View my queue <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>

        <section className="portal-section">
          <div className="section-kicker">Why Kisan Setu</div>
          <h2 className="section-heading">Information that helps farmers plan better.</h2>
          <div className="grid mt-24">
            {reasons.map(([Icon, title, text]) => <article className="reason-card" key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </section>

        <section className="msp-section">
          <div className="msp-layout">
            <div>
              <div className="section-kicker">Procurement information</div>
              <h2 className="section-heading">Know procurement information before you visit.</h2>
              <p className="section-copy">Check available procurement information and indicative commodity prices before planning your visit. Final eligibility and price are confirmed by the authorised centre.</p>
              <Link className="btn btn-primary mt-24" to="/register">Register your produce <ArrowRight size={15} /></Link>
            </div>
            <div className="msp-table">
              <div className="msp-row msp-head"><span>Commodity</span><span>Indicative price / quintal</span></div>
              {prices.map(([crop, rate]) => <div className="msp-row" key={crop}><span>{crop}</span><strong>{rate}</strong></div>)}
            </div>
          </div>
        </section>

        <section className="innovation-section">
          <div className="portal-section">
            <div className="section-kicker">Technology that works for farmers</div>
            <h2 className="section-heading">Built for a simpler, more reliable visit.</h2>
            <div className="grid mt-24">
              <article className="innovation-card"><LockKeyhole /><h3>DigiLocker-ready verification</h3><p>A future-ready, consent-based identity verification flow. No Aadhaar data is stored in the prototype.</p></article>
              <article className="innovation-card"><Bot /><h3>Smarter queue prediction</h3><p>Queue and processing information can provide a better estimate of when a farmer's turn may come.</p></article>
              <article className="innovation-card"><Volume2 /><h3>Turn-near voice alerts</h3><p>Integration-ready multilingual voice notifications can remind farmers when their turn is approaching.</p></article>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div><h2>Ready to plan your procurement visit better?</h2><p>Register your produce, get your token and stay informed throughout the procurement journey.</p></div>
          <div className="row"><Link className="btn btn-light" to="/register">Register your produce <ArrowRight size={15} /></Link><Link className="btn btn-ghost-light" to="/login">Track existing request</Link></div>
        </section>
      </main>

      <footer className="portal-footer">
        <div className="portal-footer-inner">
          <div><strong>Kisan Setu</strong><p className="text-sm mt-8">Farmer procurement information, made clear.</p></div>
          <div className="row text-sm"><Link to="/refund-policy">Refund policy</Link><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><span><Phone size={15} /> Need help? Contact your procurement centre.</span></div>
        </div>
      </footer>
    </div>
  )
}
