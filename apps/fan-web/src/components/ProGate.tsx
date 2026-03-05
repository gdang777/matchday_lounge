type Props = { feature?: string };

export default function ProGate({ feature = 'This feature' }: Props) {
  return (
    <div className="pro-gate">
      <div className="pro-gate-icon">⚡</div>
      <h2 className="pro-gate-title">Pro Required</h2>
      <p className="pro-gate-body">
        {feature} is available to MatchDay Lounge Pro subscribers.
      </p>
      <p className="pro-gate-price">$7.99/month · $14.99 tournament pass</p>
      <a
        href="https://matchdaylounge.app/pro"
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary"
      >
        Upgrade to Pro
      </a>
    </div>
  );
}
