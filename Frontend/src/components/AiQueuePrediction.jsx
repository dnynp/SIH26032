import { Clock3, Info } from 'lucide-react'

// The current backend only returns a single estimatedWaitMinutes figure:
// peopleAhead multiplied by 10 minutes. This component can also render a
// richer aiPrediction object later if the backend provides one.
export default function AiQueuePrediction({ queue }) {
  if (!queue) return null
  const ai = queue.aiPrediction

  return (
    <div className="panel panel-accent" style={{ borderLeftColor: 'var(--clay)' }}>
      <div className="row between">
        <div className="row">
          <Clock3 size={16} color="var(--clay)" />
          <span className="panel-title" style={{ marginBottom: 0 }}>
            {ai ? 'Queue prediction' : 'Queue estimate'}
          </span>
        </div>
      </div>

      <div className="grid mt-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
        <div>
          <div className="panel-title">Current token</div>
          <div className="big-number" style={{ fontSize: '1.5rem' }}>#{queue.tokenNumber}</div>
        </div>
        <div>
          <div className="panel-title">People ahead</div>
          <div className="big-number" style={{ fontSize: '1.5rem' }}>{queue.peopleAhead}</div>
        </div>
        <div>
          <div className="panel-title">
            {ai ? 'Estimated processing time' : 'Estimated wait'}
          </div>
          <div className="big-number" style={{ fontSize: '1.5rem' }}>
            {ai ? `${ai.rangeMinMinutes}-${ai.rangeMaxMinutes} min` : `${queue.estimatedWaitMinutes} min`}
          </div>
        </div>
        {ai && (
          <div>
            <div className="panel-title">Confidence</div>
            <div className="big-number" style={{ fontSize: '1.5rem' }}>{ai.confidencePercent}%</div>
          </div>
        )}
      </div>

      {queue.estimatedTime && (
        <p className="text-sm mt-8">
          <span className="muted">Recommended arrival: </span>
          <strong>{queue.estimatedTime}</strong>
        </p>
      )}

      {!ai && (
        <p className="text-sm muted mt-8 row" style={{ alignItems: 'flex-start' }}>
          <Info size={14} style={{ marginTop: 2, flexShrink: 0 }} />
          This is today's rule-based estimate: people ahead multiplied by 10 minutes.
          A more accurate prediction can appear here when the backend provides
          historical processing time, officer capacity and centre workload.
        </p>
      )}
    </div>
  )
}
