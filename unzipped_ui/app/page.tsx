import { Globe, Server, Database } from "lucide-react"

const mockData = {
  web: { podName: "web-v2-98fc6cfbc-jb56w", podIp: "192.168.1.104" },
  was: { podName: "was-v4-64f876c6d4-h4jjm", podIp: "192.168.2.139" },
  db: {
    host: "db",
    hostIp: "10.101.207.125",
    status: "Connected to DB at db:3306",
    connected: true,
  },
}

function StatusDot({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-[7px] w-[7px] rounded-full animate-pulse ${className}`}
    />
  )
}

function ArchNode({
  icon,
  label,
  colorClass,
}: {
  icon: React.ReactNode
  label: string
  colorClass: string
}) {
  const borderMap: Record<string, string> = {
    web: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    was: "border-amber-400/30 bg-amber-400/10 text-amber-400",
    db: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${borderMap[colorClass]}`}
      >
        {icon}
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  )
}

function ArchArrow() {
  return (
    <div className="mb-6 flex items-center">
      <div className="h-[2px] w-14 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700" />
      <div className="h-0 w-0 border-y-[5px] border-l-[6px] border-y-transparent border-l-slate-500" />
    </div>
  )
}

function TierCard({
  icon,
  title,
  subtitle,
  colorClass,
  badge,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  colorClass: string
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  const iconBgMap: Record<string, string> = {
    web: "bg-blue-500/[0.12] text-blue-400",
    was: "bg-amber-400/[0.12] text-amber-400",
    db: "bg-emerald-400/[0.12] text-emerald-400",
  }
  return (
    <div className="mb-4 overflow-hidden rounded-[14px] border border-slate-700 bg-slate-800 transition-all duration-200 hover:border-slate-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3.5 px-6 pt-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBgMap[colorClass]}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-slate-100">{title}</div>
          <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div>
        </div>
        {badge}
      </div>
      <div className="px-6 pb-5 pt-4">{children}</div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/50 py-2.5 first:pt-0 last:border-b-0 last:pb-0">
      <span className="text-[13px] font-medium text-slate-400">{label}</span>
      <span
        className={`rounded-md border border-slate-700 bg-slate-900/60 px-2.5 py-1 font-mono text-[13px] font-medium text-slate-200 ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  )
}

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        connected
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-400"
          : "border-red-400/25 bg-red-400/10 text-red-400"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-red-400"}`}
      />
      {connected ? "Connected" : "Disconnected"}
    </span>
  )
}

export default function Page() {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10">
      <div className="w-full max-w-[720px]">
        {/* Header */}
        <div className="mb-9 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <StatusDot className="bg-emerald-400" />
            System Operational
          </div>
          <h1 className="text-balance text-[28px] font-bold tracking-tight text-slate-100">
            3-Tier Application Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Real-time infrastructure status overview
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="mb-7 flex items-center justify-center py-5">
          <ArchNode
            icon={<Globe className="h-5 w-5" />}
            label="Web"
            colorClass="web"
          />
          <ArchArrow />
          <ArchNode
            icon={<Server className="h-5 w-5" />}
            label="WAS"
            colorClass="was"
          />
          <ArchArrow />
          <ArchNode
            icon={<Database className="h-5 w-5" />}
            label="DB"
            colorClass="db"
          />
        </div>

        {/* Web Tier */}
        <TierCard
          icon={<Globe className="h-[22px] w-[22px]" />}
          title="Web Tier"
          subtitle="Nginx Frontend Server"
          colorClass="web"
        >
          <InfoRow label="Pod Name" value={mockData.web.podName} />
          <InfoRow label="Pod IP" value={mockData.web.podIp} />
        </TierCard>

        {/* WAS Tier */}
        <TierCard
          icon={<Server className="h-[22px] w-[22px]" />}
          title="WAS Tier"
          subtitle="Tomcat Middleware Server"
          colorClass="was"
        >
          <InfoRow label="Pod Name" value={mockData.was.podName} />
          <InfoRow label="Pod IP" value={mockData.was.podIp} />
        </TierCard>

        {/* DB Tier */}
        <TierCard
          icon={<Database className="h-[22px] w-[22px]" />}
          title="DB Tier"
          subtitle="MySQL Backend Database"
          colorClass="db"
          badge={<ConnectionBadge connected={mockData.db.connected} />}
        >
          <InfoRow label="Host / Service" value={mockData.db.host} />
          <InfoRow label="Host IP" value={mockData.db.hostIp} />
          <InfoRow
            label="Status"
            value={mockData.db.status}
            valueClassName="text-emerald-400 border-emerald-400/25"
          />
        </TierCard>

        {/* Footer */}
        <div className="mt-6 border-t border-slate-800 pt-5 text-center">
          <p className="text-xs text-slate-600">
            Each refresh may show a different pod as the load balancer routes
            your traffic.
          </p>
          <p className="mt-2 font-mono text-[11px] text-slate-500">
            Last checked: {now}
          </p>
        </div>
      </div>
    </div>
  )
}
